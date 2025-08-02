
import React, { useState, useEffect } from "react";
import { Team } from "@/api/entities";
import { UploadFile } from "@/api/integrations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import SportTypeComboBox from "../components/shared/SportTypeComboBox";

export default function TeamSettingsPage() {
  const [team, setTeam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setIsLoading(true);
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
      const { file_url } = await UploadFile({ file });
      handleFieldChange("logo_url", file_url);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload logo.");
    }
    setIsUploading(false);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (team.id) {
        await Team.update(team.id, team);
      } else {
        const newTeam = await Team.create(team);
        setTeam(newTeam);
      }
      alert("Team settings saved successfully! The theme will update on the next page load.");
    } catch (error) {
      console.error("Error saving team settings:", error);
      alert("Failed to save settings.");
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Team Settings</CardTitle>
          <CardDescription>Manage your team's branding and appearance. Changes will be applied globally after saving.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="team-name">Team Name</Label>
            <Input
              id="team-name"
              value={team.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              placeholder="e.g., Canton Cobras"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="school-level">School Level</Label>
              <Select value={team.school_level || ""} onValueChange={(value) => handleFieldChange("school_level", value)}>
                <SelectTrigger>
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
              <Label htmlFor="sport-type">Sport Type</Label>
              <SportTypeComboBox
                value={team.sport_type || "Basketball"}
                onValueChange={(value) => handleFieldChange("sport_type", value)}
                placeholder="Select sport..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Team Logo</Label>
            <div className="flex items-center gap-4">
              {team.logo_url && (
                <img src={team.logo_url} alt="Team Logo" className="w-20 h-20 rounded-lg object-contain border p-1" />
              )}
              <Button asChild variant="outline">
                <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  <span>{isUploading ? "Uploading..." : "Upload Logo"}</span>
                  <input id="logo-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </label>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primary-color"
                  value={team.primary_color}
                  onChange={(e) => handleFieldChange("primary_color", e.target.value)}
                />
                <input
                  type="color"
                  value={team.primary_color}
                  onChange={(e) => handleFieldChange("primary_color", e.target.value)}
                  className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
                  title="Choose primary color"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
               <div className="flex items-center gap-2">
                <Input
                  id="secondary-color"
                  value={team.secondary_color}
                  onChange={(e) => handleFieldChange("secondary_color", e.target.value)}
                />
                <input
                  type="color"
                  value={team.secondary_color}
                  onChange={(e) => handleFieldChange("secondary_color", e.target.value)}
                  className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
                  title="Choose secondary color"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving || isUploading}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
