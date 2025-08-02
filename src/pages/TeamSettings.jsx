import React, { useState, useEffect } from "react";
import { Team } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import SportTypeComboBox from "../components/shared/SportTypeComboBox";
import { useTeamTheme } from "@/contexts/TeamThemeContext";

export default function TeamSettingsPage() {
  const { updateTeam } = useTeamTheme();
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setIsLoading(true);
    try {
      const teams = await Team.list();
      if (teams && teams.length > 0) {
        setTeam(teams[0]);
      } else {
        // Initialize with default values
        setTeam({ 
          name: "", 
          logo_url: "", 
          primary_color: "#3b82f6", 
          secondary_color: "#64748b", 
          school_level: "", 
          sport_type: "Basketball"
        });
      }
    } catch (error) {
      console.error("Error loading team:", error);
      setTeam({ 
        name: "", 
        logo_url: "", 
        primary_color: "#3b82f6", 
        secondary_color: "#64748b", 
        school_level: "", 
        sport_type: "Basketball"
      });
    }
    setIsLoading(false);
  };

  const handleFieldChange = (field, value) => {
    setTeam(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // For demo: Convert file to base64 data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        handleFieldChange("logo_url", e.target.result);
        setIsUploading(false);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        alert("Failed to upload logo.");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload logo.");
      setIsUploading(false);
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      let savedTeam;
      if (team.id) {
        savedTeam = await Team.update(team.id, team);
      } else {
        savedTeam = await Team.create(team);
        setTeam(savedTeam);
      }
      
      // Automatically apply team colors after saving
      updateTeam(savedTeam || team);
      alert("Team settings saved successfully!");
    } catch (error) {
      console.error("Error saving team settings:", error);
      alert("Failed to save settings. Please try again.");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 md:p-16">
        <Loader2 className="animate-spin w-8 h-8 text-team-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="card-readable">
        <CardHeader className="responsive-padding border-b">
          <CardTitle className="text-xl md:text-2xl text-high-contrast">Team Settings</CardTitle>
          <CardDescription className="text-medium-contrast text-sm md:text-base">
            Manage your team's branding and appearance. Changes will be applied globally after saving.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 responsive-padding">
          <div className="space-y-2">
            <Label htmlFor="team-name" className="label-readable">Team Name</Label>
            <Input
              id="team-name"
              value={team.name || ""}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="e.g., Canton Cobras"
              className="input-readable"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="school-level" className="label-readable">School Level</Label>
              <Select value={team.school_level || ""} onValueChange={(value) => handleFieldChange("school_level", value)}>
                <SelectTrigger className="input-readable">
                  <SelectValue placeholder="Select school level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="College">College</SelectItem>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Middle School">Middle School</SelectItem>
                  <SelectItem value="Youth">Youth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sport-type" className="label-readable">Sport Type</Label>
              <SportTypeComboBox
                value={team.sport_type || "Basketball"}
                onValueChange={(value) => handleFieldChange("sport_type", value)}
                placeholder="Select sport..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="label-readable">Team Logo</Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {team.logo_url && (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 border-gray-200 p-2 bg-white flex-shrink-0">
                  <img src={team.logo_url} alt="Team Logo" className="w-full h-full object-contain" />
                </div>
              )}
              <Button asChild variant="outline" className="btn-team-secondary mobile-full-width sm:w-auto">
                <label htmlFor="logo-upload" className="cursor-pointer flex items-center justify-center gap-2 min-h-[44px]">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading ? "Uploading..." : "Upload Logo"}</span>
                  <input 
                    id="logo-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload} 
                    accept="image/*"
                    disabled={isUploading}
                  />
                </label>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color" className="label-readable">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  value={team.primary_color || "#3b82f6"}
                  onChange={(e) => handleFieldChange("primary_color", e.target.value)}
                  className="input-readable flex-1"
                />
                <input
                  type="color"
                  value={team.primary_color || "#3b82f6"}
                  onChange={(e) => handleFieldChange("primary_color", e.target.value)}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-md border-2 border-gray-300 cursor-pointer flex-shrink-0"
                  title="Choose primary color"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color" className="label-readable">Secondary Color</Label>
               <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  value={team.secondary_color || "#64748b"}
                  onChange={(e) => handleFieldChange("secondary_color", e.target.value)}
                  className="input-readable flex-1"
                />
                <input
                  type="color"
                  value={team.secondary_color || "#64748b"}
                  onChange={(e) => handleFieldChange("secondary_color", e.target.value)}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-md border-2 border-gray-300 cursor-pointer flex-shrink-0"
                  title="Choose secondary color"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end pt-6 border-t">
            <Button 
              onClick={handleSave} 
              disabled={isSaving || isUploading}
              className="btn-team-primary mobile-full-width sm:w-auto min-w-[140px]"
            >
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}