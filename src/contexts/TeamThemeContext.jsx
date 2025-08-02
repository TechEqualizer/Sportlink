import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team } from '@/api/entities';

const TeamThemeContext = createContext();

export const useTeamTheme = () => {
  const context = useContext(TeamThemeContext);
  if (!context) {
    throw new Error('useTeamTheme must be used within a TeamThemeProvider');
  }
  return context;
};

export const TeamThemeProvider = ({ children }) => {
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadTeamData = async () => {
    setIsLoading(true);
    try {
      const teams = await Team.list();
      if (teams && teams.length > 0) {
        setTeam(teams[0]);
        applyTeamColors(teams[0]);
      }
    } catch (error) {
      console.error("Failed to load team data:", error);
    }
    setIsLoading(false);
  };

  const applyTeamColors = (teamData) => {
    if (!teamData) return;
    
    const root = document.documentElement;
    const primaryColor = teamData.primary_color || '#3b82f6';
    
    // Set CSS custom properties for team colors
    root.style.setProperty('--team-primary', primaryColor);
    
    // Convert hex to HSL for better color variations
    const primaryHSL = hexToHSL(primaryColor);
    
    if (primaryHSL) {
      root.style.setProperty('--team-primary-hsl', `${primaryHSL.h} ${primaryHSL.s}% ${primaryHSL.l}%`);
      root.style.setProperty('--team-primary-hover', `hsl(${primaryHSL.h} ${primaryHSL.s}% ${Math.max(primaryHSL.l - 10, 0)}%)`);
      root.style.setProperty('--team-primary-light', `hsl(${primaryHSL.h} ${primaryHSL.s}% ${Math.min(primaryHSL.l + 20, 95)}%)`);
      
      // Generate complementary secondary color based on primary
      const secondaryL = primaryHSL.l > 50 ? Math.max(primaryHSL.l - 30, 20) : Math.min(primaryHSL.l + 30, 80);
      const secondaryColor = `hsl(${primaryHSL.h} ${Math.max(primaryHSL.s - 20, 10)}% ${secondaryL}%)`;
      root.style.setProperty('--team-secondary', secondaryColor);
      
      // Text colors based on primary color brightness
      const textOnPrimary = primaryHSL.l > 50 ? '#000000' : '#ffffff';
      root.style.setProperty('--team-text-on-primary', textOnPrimary);
    }
  };

  const updateTeam = (newTeamData) => {
    setTeam(newTeamData);
    applyTeamColors(newTeamData);
  };

  useEffect(() => {
    loadTeamData();
  }, []);

  const value = {
    team,
    isLoading,
    updateTeam,
    refreshTeam: loadTeamData,
    primaryColor: team?.primary_color || '#3b82f6'
  };

  return (
    <TeamThemeContext.Provider value={value}>
      {children}
    </TeamThemeContext.Provider>
  );
};

// Helper function to convert hex to HSL
function hexToHSL(hex) {
  if (!hex) return null;
  
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}