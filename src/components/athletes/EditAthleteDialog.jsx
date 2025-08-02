import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

// Helper for dynamic array fields
const ArrayFieldEditor = ({ label, items, onAdd, onRemove }) => {
  const [newItem, setNewItem] = useState("");
  
  const handleAdd = () => {
    if (newItem.trim()) {
      onAdd(newItem.trim());
      setNewItem("");
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        {(items || []).map((item, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {item}
            <button onClick={() => onRemove(index)} className="rounded-full hover:bg-black/10 p-0.5">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder={`Add a ${label.toLowerCase()}...`} />
        <Button type="button" variant="outline" size="icon" onClick={handleAdd}><Plus className="w-4 h-4" /></Button>
      </div>
    </div>
  );
};

export default function EditAthleteDialog({ open, onOpenChange, athlete, onSave }) {
  const [formData, setFormData] = useState(athlete);

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const updateStat = (key, value) => updateField('season_stats', { ...(formData.season_stats || {}), [key]: value });
  
  const handleArrayAdd = (field, item) => updateField(field, [...(formData[field] || []), item]);
  const handleArrayRemove = (field, index) => {
    const newArr = [...formData[field]];
    newArr.splice(index, 1);
    updateField(field, newArr);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const basketballStats = ["Points per Game", "Assists per Game", "Rebounds per Game", "Steals per Game", "Blocks per Game", "Field Goal %", "3-Point %", "Free Throw %"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader><DialogTitle>Edit Profile: {athlete.name}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto p-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Full Name</Label><Input value={formData.name} onChange={e => updateField('name', e.target.value)} /></div>
            <div><Label>Jersey #</Label><Input value={formData.jersey_number} onChange={e => updateField('jersey_number', e.target.value)} /></div>
            <div><Label>Position</Label><Input value={formData.position} onChange={e => updateField('position', e.target.value)} /></div>
            <div><Label>Class Year</Label><Select value={formData.class_year} onValueChange={v => updateField('class_year', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Freshman">Freshman</SelectItem><SelectItem value="Sophomore">Sophomore</SelectItem><SelectItem value="Junior">Junior</SelectItem><SelectItem value="Senior">Senior</SelectItem></SelectContent></Select></div>
            <div><Label>Height</Label><Input value={formData.height} onChange={e => updateField('height', e.target.value)} /></div>
            <div><Label>Weight</Label><Input value={formData.weight} onChange={e => updateField('weight', e.target.value)} /></div>
          </div>
          {/* Academics */}
          <div className="grid grid-cols-2 gap-4">
            <div><Label>GPA</Label><Input type="number" step="0.1" value={formData.gpa || ''} onChange={e => updateField('gpa', parseFloat(e.target.value))} /></div>
            <div><Label>SAT Score</Label><Input type="number" value={formData.sat_score || ''} onChange={e => updateField('sat_score', parseInt(e.target.value))} /></div>
            <div><Label>Hometown</Label><Input value={formData.hometown} onChange={e => updateField('hometown', e.target.value)} /></div>
            <div><Label>High School</Label><Input value={formData.high_school} onChange={e => updateField('high_school', e.target.value)} /></div>
          </div>
          {/* Recruiting */}
          <div><Label>Recruiting Status</Label><Select value={formData.recruiting_status} onValueChange={v => updateField('recruiting_status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Open">Open</SelectItem><SelectItem value="Verbal">Verbal</SelectItem><SelectItem value="Committed">Committed</SelectItem></SelectContent></Select></div>
          <ArrayFieldEditor label="College Interest" items={formData.college_interest} onAdd={item => handleArrayAdd('college_interest', item)} onRemove={index => handleArrayRemove('college_interest', index)} />
          {/* Traits & Notes */}
          <ArrayFieldEditor label="Character Traits" items={formData.character_traits} onAdd={item => handleArrayAdd('character_traits', item)} onRemove={index => handleArrayRemove('character_traits', index)} />
          <ArrayFieldEditor label="Achievements" items={formData.achievements} onAdd={item => handleArrayAdd('achievements', item)} onRemove={index => handleArrayRemove('achievements', index)} />
          <div><Label>Coach Notes</Label><Textarea value={formData.coach_notes} onChange={e => updateField('coach_notes', e.target.value)} /></div>
          {/* Stats */}
          <div>
            <h3 className="font-semibold mb-2">Season Stats</h3>
            <div className="grid grid-cols-3 gap-4">
              {basketballStats.map(statKey => (
                <div key={statKey}>
                  <Label>{statKey}</Label>
                  <Input type="number" step="0.1" value={formData.season_stats?.[statKey] || ''} onChange={e => updateStat(statKey, e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
          <Button type="submit" onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}