
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SportTypeComboBox from "../shared/SportTypeComboBox";

export default function AddAthleteDialog({ open, onOpenChange, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    jersey_number: "",
    class_year: "",
    school_level: "High School",
    sport_type: "Basketball",
    height: "",
    weight: "",
    hometown: "",
    high_school: "",
    recruiting_status: "Open"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.position) {
      alert("Please fill in required fields (Name and Position)");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onAdd(formData); // Await the async operation
      // The parent now closes the dialog, no need to do it here.
      // Reset formData to initial state, assuming parent closes dialog and this component remounts or is re-initialized,
      // but explicitly resetting ensures clean state if dialog isn't immediately unmounted.
      setFormData({
        name: "",
        position: "",
        jersey_number: "",
        class_year: "",
        school_level: "High School",
        sport_type: "Basketball",
        height: "",
        weight: "",
        hometown: "",
        high_school: "",
        recruiting_status: "Open"
      });
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to add athlete. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add New Athlete</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-1">
          <form id="add-athlete-form" onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="jersey_number">Jersey #</Label>
                <Input
                  id="jersey_number"
                  value={formData.jersey_number}
                  onChange={(e) => updateField("jersey_number", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position *</Label>
                <Select value={formData.position} onValueChange={(value) => updateField("position", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Point Guard">Point Guard</SelectItem>
                    <SelectItem value="Shooting Guard">Shooting Guard</SelectItem>
                    <SelectItem value="Small Forward">Small Forward</SelectItem>
                    <SelectItem value="Power Forward">Power Forward</SelectItem>
                    <SelectItem value="Center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sport_type">Sport Type *</Label>
                <SportTypeComboBox
                  value={formData.sport_type}
                  onValueChange={(value) => updateField("sport_type", value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="class_year">Class Year</Label>
                <Select value={formData.class_year} onValueChange={(value) => updateField("class_year", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Freshman">Freshman</SelectItem>
                    <SelectItem value="Sophomore">Sophomore</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="school_level">School Level</Label>
                <Select value={formData.school_level} onValueChange={(value) => updateField("school_level", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="College">College</SelectItem>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Middle School">Middle School</SelectItem>
                    <SelectItem value="Youth">Youth</SelectItem> {/* Added Youth option */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  value={formData.height}
                  onChange={(e) => updateField("height", e.target.value)}
                  placeholder="6'2&quot;"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  value={formData.weight}
                  onChange={(e) => updateField("weight", e.target.value)}
                  placeholder="180 lbs"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hometown">Hometown</Label>
              <Input
                id="hometown"
                value={formData.hometown}
                onChange={(e) => updateField("hometown", e.target.value)}
                placeholder="Chicago, IL"
              />
            </div>

            <div>
              <Label htmlFor="high_school">High School</Label>
              <Input
                id="high_school"
                value={formData.high_school}
                onChange={(e) => updateField("high_school", e.target.value)}
                placeholder="Lincoln High School"
              />
            </div>
          </form>
        </div>

        <DialogFooter className="flex-shrink-0 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            type="submit"
            form="add-athlete-form"
            style={{ backgroundColor: 'var(--primary-color)' }} 
            className="text-white hover:opacity-90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Athlete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
