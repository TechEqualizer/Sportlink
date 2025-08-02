import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ExternalLink } from "lucide-react";

export default function AddVideoDialog({ open, onOpenChange, onAdd, athlete }) {
  const [formData, setFormData] = useState({
    title: "",
    video_url: "",
    category: "highlights",
    description: "",
    source: "youtube",
    source_id: "",
    thumbnail: "",
    duration: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const extractYouTubeId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlChange = async (url) => {
    setFormData(prev => ({ ...prev, video_url: url }));
    setError("");

    if (url && (url.includes('youtube.com') || url.includes('youtu.be'))) {
      setIsProcessing(true);
      const videoId = extractYouTubeId(url);
      
      if (videoId) {
        setFormData(prev => ({
          ...prev,
          source: "youtube",
          source_id: videoId,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
        }));

        // Try to get video title (this is a simplified approach)
        if (!formData.title) {
          setFormData(prev => ({
            ...prev,
            title: `${athlete.name} - Video`
          }));
        }
      } else {
        setError("Invalid YouTube URL. Please check the URL and try again.");
      }
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.video_url || !formData.category) {
      setError("Please fill in all required fields.");
      return;
    }

    onAdd(formData);
    setFormData({
      title: "",
      video_url: "",
      category: "highlights",
      description: "",
      source: "youtube",
      source_id: "",
      thumbnail: "",
      duration: ""
    });
    setError("");
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Video for {athlete.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <Label htmlFor="video_url">Video URL *</Label>
            <div className="relative">
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              {isProcessing && (
                <div className="absolute right-3 top-3">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Currently supports YouTube URLs
            </p>
          </div>

          <div>
            <Label htmlFor="title">Video Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => updateField("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highlights">Highlights</SelectItem>
                <SelectItem value="gamefilm">Game Film</SelectItem>
                <SelectItem value="interviews">Interviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Brief description of the video"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                placeholder="2:30"
              />
            </div>
            <div>
              <Label htmlFor="source">Source</Label>
              <Select value={formData.source} onValueChange={(value) => updateField("source", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="wistia">Wistia</SelectItem>
                  <SelectItem value="uploaded">Uploaded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.thumbnail && (
            <div>
              <Label>Preview</Label>
              <div className="mt-2">
                <img 
                  src={formData.thumbnail} 
                  alt="Video thumbnail" 
                  className="w-full h-32 object-cover rounded-lg border"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                "Add Video"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}