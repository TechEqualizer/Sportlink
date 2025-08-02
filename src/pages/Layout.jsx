

import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, Users, BarChart3, Home, Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Team } from "@/api/entities";
import { useTeamTheme } from "@/contexts/TeamThemeContext";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isPlayerProfile = location.pathname.includes('/player/');
  const { team } = useTeamTheme();

  const navigationItems = [
    {
      title: "Athletes",
      url: createPageUrl("Athletes"),
      icon: Users,
    },
    {
      title: "Statistics", 
      url: createPageUrl("Statistics"),
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
                    <img src={team.logo_url} alt="Team Logo" className="w-full h-full object-contain p-1 rounded-lg" />
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
                    <Button variant="outline" className="btn-team-secondary flex items-center gap-2 text-sm md:text-base">
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
                        className={`nav-item-team flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-all ${
                          location.pathname === item.url
                            ? "nav-active-team"
                            : "text-medium-contrast hover:text-team-primary hover:bg-gray-50"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="hidden lg:inline">{item.title}</span>
                      </Link>
                    ))}
                  </nav>
                )}

                {/* Mobile Navigation */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden min-h-[44px] min-w-[44px]">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72 p-0">
                    <div className="mobile-nav flex flex-col gap-2 mt-8 p-6">
                      {!isPlayerProfile && navigationItems.map((item) => (
                        <Link
                          key={item.title}
                          to={item.url}
                          className={`mobile-nav-item flex items-center gap-4 px-4 py-3 rounded-lg text-lg font-medium transition-colors ${
                            location.pathname === item.url
                              ? "bg-team-primary-light text-team-primary"
                              : "text-medium-contrast hover:bg-gray-50 hover:text-team-primary"
                          }`}
                        >
                          <item.icon className="w-6 h-6" />
                          {item.title}
                        </Link>
                      ))}
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

