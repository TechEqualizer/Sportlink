

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

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isPlayerProfile = location.pathname.includes('/player/');
  const [team, setTeam] = useState(null);

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const teams = await Team.list();
        if (teams && teams.length > 0) {
          setTeam(teams[0]);
        }
      } catch (error) {
        console.error("Failed to load team data:", error);
      }
    };
    loadTeamData();
  }, []);

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
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                  {team?.logo_url ? (
                    <img src={team.logo_url} alt="Team Logo" className="w-full h-full object-contain p-1" />
                  ) : null} {/* Changed fallback from "SR" span to null as per outline */}
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">{team?.name || ""}</h1>
                  <p className="text-xs text-gray-500">{getHeaderSubtext()}</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                {isPlayerProfile && (
                  <Link to={createPageUrl("Athletes")}>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Home
                    </Button>
                  </Link>
                )}

                {!isPlayerProfile && (
                  <nav className="hidden md:flex space-x-8">
                    {navigationItems.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          location.pathname === item.url
                            ? "bg-blue-100 text-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                )}

                {/* Mobile Navigation */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-64">
                    <div className="flex flex-col gap-4 mt-8">
                      {!isPlayerProfile && navigationItems.map((item) => (
                        <Link
                          key={item.title}
                          to={item.url}
                          className="flex items-center gap-4 px-3 py-2 rounded-lg text-lg font-medium hover:bg-gray-100"
                        >
                          <item.icon className="w-5 h-5 text-gray-500" />
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

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

