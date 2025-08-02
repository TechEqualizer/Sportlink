import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Volume2, VolumeX, Maximize, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoHero({ videos, athlete, onVideoUpdate }) {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [isMuted, setIsMuted] = useState(true);
  const [activeCategory, setActiveCategory] = useState("highlights");

  const categorizedVideos = {
    highlights: videos.filter(v => v.category === "highlights"),
    gamefilm: videos.filter(v => v.category === "gamefilm"),
    interviews: videos.filter(v => v.category === "interviews")
  };

  const getEmbedUrl = (video) => {
    if (video.source === "youtube") {
      const videoId = video.source_id;
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}`;
    }
    return video.video_url;
  };

  if (!selectedVideo) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Video Player */}
      <div className="lg:col-span-3">
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-black">
            <iframe
              src={getEmbedUrl(selectedVideo)}
              title={selectedVideo.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Video Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2">
                <h3 className="text-white font-semibold">{selectedVideo.title}</h3>
                <p className="text-gray-300 text-sm capitalize">{selectedVideo.category}</p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-black/80 backdrop-blur-sm border-0 text-white hover:bg-black/90"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Video Categories */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="highlights">
              Game Highlights ({categorizedVideos.highlights.length})
            </TabsTrigger>
            <TabsTrigger value="gamefilm">
              Game Film ({categorizedVideos.gamefilm.length})
            </TabsTrigger>
            <TabsTrigger value="interviews">
              Interviews ({categorizedVideos.interviews.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Video Suggestions - YouTube Shorts Style */}
      <div className="lg:col-span-1">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Up Next</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            <AnimatePresence>
              {categorizedVideos[activeCategory]?.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedVideo.id === video.id 
                        ? "ring-2 ring-blue-500 shadow-lg" 
                        : "hover:shadow-md"
                    }`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="relative w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
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
                          {video.duration && (
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                              {video.duration}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                            {video.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {video.source}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {categorizedVideos[activeCategory]?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Play className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No {activeCategory} videos</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}