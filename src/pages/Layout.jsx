

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, Users, BarChart3, Home, Settings, LogOut, User, Trophy, Target } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Team } from "@/api/entities";
import { useTeamTheme } from "@/contexts/TeamThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isPlayerProfile = location.pathname.includes('/player/');
  const { team } = useTeamTheme();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      title: "Athletes",
      url: createPageUrl("Athletes"),
      icon: Users,
    },
    {
      title: "Performance", 
      url: "/performance-review",
      icon: BarChart3,
    },
     {
      title: "Settings",
      url: createPageUrl("TeamSettings"),
      icon: Settings,
    },
  ];

  const primaryColor = team?.primary_color || 'transparent';
  const secondaryColor = team?.secondary_color || 'transparent';
  
  const getHeaderSubtext = () => {
    if (!team) return ""; // Prevent fallback text while loading
    const sportType = team.sport_type || "Basketball"; // Default to "Basketball" if not set
    const schoolLevel = team.school_level;
    
    if (schoolLevel) {
      return `${schoolLevel} ${sportType}`;
    }
    return sportType; // Removed "Recruiting" fallback text
  };

  return (
    <div style={{
      '--primary-color': primaryColor,
      '--secondary-color': secondaryColor
    }}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-20">
              <div className="flex-shrink-0 flex items-center min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center bg-team-primary flex-shrink-0">
                  {team?.logo_url ? (
                    <OptimizedImage 
                      src={team.logo_url} 
                      alt="Team Logo" 
                      className="w-full h-full object-contain p-1 rounded-lg"
                      fallback={<div className="w-6 h-6 bg-white/20 rounded"></div>}
                    />
                  ) : (
                    <div className="w-6 h-6 bg-white/20 rounded"></div>
                  )}
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <h1 className="text-lg md:text-xl font-bold text-high-contrast truncate">{team?.name || "Team Name"}</h1>
                  <p className="text-xs md:text-sm text-low-contrast truncate">{getHeaderSubtext()}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-2 md:gap-4">
                {isPlayerProfile && (
                  <Link to={createPageUrl("Athletes")}>
                    <Button variant="outline" className="btn-team-secondary flex items-center gap-2 text-sm md:text-base min-h-[44px] min-w-[44px]">
                      <Home className="w-4 h-4" />
                      <span className="hidden sm:inline">Home</span>
                    </Button>
                  </Link>
                )}

                {!isPlayerProfile && (
                  <nav className="hidden md:flex space-x-2 lg:space-x-4">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        className={`nav-item-team flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all min-h-[44px] ${
                          location.pathname === item.url
                            ? "nav-active-team"
                            : "text-medium-contrast hover:text-team-primary hover:bg-team-primary-light"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="hidden lg:inline">{item.title}</span>
                      </Link>
                    ))}
                  </nav>
                )}

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="min-h-[44px] min-w-[44px] rounded-full">
                      <div className="w-8 h-8 bg-team-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Navigation */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden min-h-[44px] min-w-[44px]">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 p-0">
                    <div className="mobile-nav flex flex-col gap-2 mt-8 p-6">
                      {/* User Info in Mobile */}
                      <div className="flex items-center gap-3 p-4 border-b border-gray-200 mb-4">
                        <div className="w-10 h-10 bg-team-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                      </div>

                      {!isPlayerProfile && navigationItems.map((item) => (
                        <Link
                          key={item.title}
                          to={item.url}
                          className={`mobile-nav-item flex items-center gap-4 px-4 py-3 rounded-lg text-lg font-medium transition-colors min-h-[50px] ${
                            location.pathname === item.url
                              ? "bg-team-primary-light text-team-primary"
                              : "text-medium-contrast hover:bg-team-primary-light hover:text-team-primary"
                          }`}
                        >
                          <item.icon className="w-6 h-6" />
                          {item.title}
                        </Link>
                      ))}

                      {/* Logout in Mobile */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <Button
                          onClick={logout}
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

