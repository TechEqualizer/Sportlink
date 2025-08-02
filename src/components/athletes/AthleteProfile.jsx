import React, { useState, useEffect } from "react";
import { Video } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Play, Plus, AlertTriangle, Loader2 } from "lucide-react";
import { rateLimiter } from "@/components/utils/rateLimiter";

import VideoHero from "../shared/VideoHero";
import ProfileOverview from "./ProfileOverview";
import StatsSection from "./StatsSection";
import AcademicsSection from "./AcademicsSection";
import AddVideoDialog from "./AddVideoDialog";

const statusColors = {
  Open: "bg-green-100 text-green-800 border-green-200",
  Committed: "bg-blue-100 text-blue-800 border-blue-200",
  Verbal: "bg-orange-100 text-orange-800 border-orange-200"
};

export default function AthleteProfile({ athlete, onEdit }) {
  const [videos, setVideos] = useState([]);
  const [videoError, setVideoError] = useState(null);
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // Only load videos when the videos tab is active and videos haven't been loaded yet
  useEffect(() => {
    let mounted = true;
    
    const loadVideosForAthlete = async () => {
      // Only load if the videos tab is active and videos haven't been loaded yet for this athlete
      if (!athlete?.id || activeTab !== 'videos' || videosLoaded) return;
      
      setVideoError(null);
      setIsVideoLoading(true);
      
      try {
        const videoData = await rateLimiter.executeWithRateLimit(() =>
          Video.filter({ athlete_id: athlete.id.toString() }, "-created_date")
        );
        
        if (mounted) {
          setVideos(videoData || []);
          setVideosLoaded(true);
        }
      } catch (error) {
        console.error("Error loading videos:", error);
        if (mounted) {
          setVideoError("Failed to load videos. They may be temporarily unavailable.");
          setVideos([]);
        }
      } finally {
        if (mounted) {
          setIsVideoLoading(false);
        }
      }
    };

    loadVideosForAthlete();

    return () => {
      mounted = false;
    };
  }, [athlete?.id, activeTab, videosLoaded]);

  // Reset videos when athlete changes
  useEffect(() => {
    setVideos([]);
    setVideosLoaded(false);
    setVideoError(null);
    setActiveTab("overview");
  }, [athlete?.id]);

  const handleAddVideo = async (videoData) => {
    try {
      const newVideo = await rateLimiter.executeWithRateLimit(() =>
        Video.create({ ...videoData, athlete_id: athlete.id.toString() })
      );
      setVideos(prev => [newVideo, ...prev]);
      setShowAddVideo(false);
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await rateLimiter.executeWithRateLimit(() => Video.delete(videoId));
      setVideos(prev => prev.filter(v => v.id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  if (!athlete) {
    return (
      <Card className="p-12 text-center">
        <CardContent>
          <p className="text-gray-500">Select an athlete to view their profile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ background: 'var(--primary-color)' }}>
                {athlete.jersey_number || athlete.name?.charAt(0) || "#"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{athlete.name}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-gray-600">{athlete.position} • #{athlete.jersey_number} • {athlete.class_year}</span>
                  <Badge variant="secondary" className={statusColors[athlete.recruiting_status] || statusColors.Open}>
                    {athlete.recruiting_status || "Open"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      {/* Video Hero - Only show if videos tab is active and videos are loaded */}
      {activeTab === 'videos' && videos.length > 0 && !videoError && (
        <VideoHero videos={videos} athlete={athlete} activeCategory="highlights" />
      )}

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="academics">Academics</TabsTrigger>
          <TabsTrigger value="videos">
            Videos
            {!videosLoaded && activeTab !== 'videos' && (
              <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <ProfileOverview athlete={athlete} />
        </TabsContent>

        <TabsContent value="statistics" className="mt-6">
          <StatsSection athlete={athlete} />
        </TabsContent>

        <TabsContent value="academics" className="mt-6">
          <AcademicsSection athlete={athlete} />
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Video Management</CardTitle>
                <Button onClick={() => setShowAddVideo(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {isVideoLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-gray-400" />
                    <p className="mt-4 text-gray-500">Loading videos...</p>
                  </div>
                ) : videoError ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                    <p className="text-red-700">{videoError}</p>
                    <Button 
                      onClick={() => {
                        setVideosLoaded(false);
                        setVideoError(null);
                      }}
                      variant="outline" 
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : videos.length > 0 ? (
                  videos.map(video => (
                    <VideoManagementItem 
                      key={video.id} 
                      video={video} 
                      onDelete={() => handleDeleteVideo(video.id)} 
                    />
                  ))
                ) : videosLoaded ? (
                  <div className="text-center py-12 text-gray-500">
                    <Play className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">No videos uploaded yet</h3>
                    <p className="mb-4">Add your first video to get started</p>
                    <Button onClick={() => setShowAddVideo(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Video
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <AddVideoDialog 
            open={showAddVideo} 
            onOpenChange={setShowAddVideo} 
            onAdd={handleAddVideo} 
            athlete={athlete} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Video Management Item Component
function VideoManagementItem({ video, onDelete }) {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
      <div className="w-20 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-4 h-4 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{video.title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs capitalize">{video.category}</Badge>
          <Badge variant="outline" className="text-xs">{video.source}</Badge>
          {video.duration && <span className="text-xs text-gray-500">{video.duration}</span>}
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        Delete
      </Button>
    </div>
  );
}