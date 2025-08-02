import React, { useState, useEffect } from "react";
import { Team } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, Palette, Building, Trophy, Image, Check } from "lucide-react";
import SportTypeComboBox from "../components/shared/SportTypeComboBox";
import { useTeamTheme } from "@/contexts/TeamThemeContext";
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function TeamSettingsPage() {
  const { updateTeam } = useTeamTheme();
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    setSaveSuccess(false);
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
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving team settings:", error);
      alert("Failed to save settings. Please try again.");
    }
    setIsSaving(false);
  };

  const predefinedColors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#10b981" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Orange", value: "#f97316" },
    { name: "Pink", value: "#ec4899" },
    { name: "Indigo", value: "#6366f1" },
    { name: "Yellow", value: "#eab308" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 md:p-16">
        <Loader2 className="animate-spin w-8 h-8 text-team-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-high-contrast mb-2">Team Settings</h1>
        <p className="text-medium-contrast">
          Customize your team's appearance and branding
        </p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-green-800 font-medium">Settings saved successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Identity Card */}
        <Card className="card-readable lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building className="w-5 h-5 text-team-primary" />
              Team Identity
            </CardTitle>
            <CardDescription>
              Basic information about your team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="team-name" className="text-sm font-medium text-gray-700">Team Name</Label>
              <Input
                id="team-name"
                value={team.name || ""}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                placeholder="e.g., Canton Cobras"
                className="min-h-[44px] text-base"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="school-level" className="text-sm font-medium text-gray-700">School Level</Label>
                <Select value={team.school_level || ""} onValueChange={(value) => handleFieldChange("school_level", value)}>
                  <SelectTrigger className="min-h-[44px]">
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
                <Label htmlFor="sport-type" className="text-sm font-medium text-gray-700">Sport Type</Label>
                <SportTypeComboBox
                  value={team.sport_type || "Basketball"}
                  onValueChange={(value) => handleFieldChange("sport_type", value)}
                  placeholder="Select sport..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logo Upload Card */}
        <Card className="card-readable">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Image className="w-5 h-5 text-team-primary" />
              Team Logo
            </CardTitle>
            <CardDescription>
              Upload your team's logo
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Logo Preview */}
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                  {team.logo_url ? (
                    <OptimizedImage 
                      src={team.logo_url} 
                      alt="Team Logo" 
                      className="w-full h-full object-contain rounded-lg p-2"
                    />
                  ) : (
                    <div className="text-center">
                      <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Button */}
              <Button asChild variant="outline" className="w-full min-h-[44px]">
                <label htmlFor="logo-upload" className="cursor-pointer flex items-center justify-center gap-2">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading ? "Uploading..." : team.logo_url ? "Change Logo" : "Upload Logo"}</span>
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
          </CardContent>
        </Card>

        {/* Team Colors Card */}
        <Card className="card-readable lg:col-span-3">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="w-5 h-5 text-team-primary" />
              Team Colors
            </CardTitle>
            <CardDescription>
              Choose your primary team color. This will be used throughout the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Color Presets */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Quick Colors</Label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleFieldChange("primary_color", color.value)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                        team.primary_color === color.value 
                          ? 'border-gray-800 ring-2 ring-gray-300' 
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Custom Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="primary-color" className="text-sm font-medium text-gray-700">Custom Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primary-color"
                      value={team.primary_color || "#3b82f6"}
                      onChange={(e) => handleFieldChange("primary_color", e.target.value)}
                      className="flex-1 min-h-[44px] font-mono text-sm"
                      placeholder="#3b82f6"
                    />
                    <input
                      type="color"
                      value={team.primary_color || "#3b82f6"}
                      onChange={(e) => handleFieldChange("primary_color", e.target.value)}
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      title="Choose primary color"
                    />
                  </div>
                </div>

                {/* Color Preview */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Preview</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-gray-300"
                      style={{ backgroundColor: team.primary_color || "#3b82f6" }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Primary Color</p>
                      <p className="text-xs text-gray-500">{team.primary_color || "#3b82f6"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-center pt-6">
        <Button 
          onClick={handleSave} 
          disabled={isSaving || isUploading}
          className="btn-team-primary min-w-[160px] min-h-[48px] text-base font-medium"
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Check className="w-5 h-5 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}