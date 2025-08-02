import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Volume2, VolumeX, Share, Download, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoHero({ videos, athlete, activeCategory }) {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [isMuted, setIsMuted] = useState(true);

  // Update selected video when category changes or videos change
  React.useEffect(() => {
    if (videos && videos.length > 0 && (!selectedVideo || !videos.find(v => v.id === selectedVideo.id))) {
      setSelectedVideo(videos[0]);
    }
  }, [videos, selectedVideo]);

  const getEmbedUrl = (video) => {
    if (!video) return "";
    
    if (video.source === "youtube") {
      const videoId = video.source_id;
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&showinfo=1&rel=0`;
    }
    return video.video_url;
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">No Videos Available</h3>
        <p className="text-gray-400">
          {activeCategory === "highlights" 
            ? "No highlight videos have been uploaded yet." 
            : activeCategory === "gamefilm" 
            ? "No game film videos have been uploaded yet."
            : "No interview videos have been uploaded yet."
          }
        </p>
      </div>
    );
  }

  if (!selectedVideo) {
    return (
      <div className="bg-white rounded-lg p-8 text-center">
        <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">Video Loading</h3>
        <p className="text-gray-400">Please wait while we load the video content.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Video Player */}
      <div className="lg:col-span-3">
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={getEmbedUrl(selectedVideo)}
              title={selectedVideo.title}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          {/* Video Info */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedVideo.title || "Season Highlights 2023-24"}
            </h2>
            <p className="text-gray-600">
              {selectedVideo.description || "Best plays from the 2023-24 season"}
            </p>
          </div>
        </div>
      </div>

      {/* Playlist Sidebar */}
      <div className="lg:col-span-1">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Up Next</h3>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            <AnimatePresence>
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div 
                    className={`cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-lg p-2 ${
                      selectedVideo.id === video.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedVideo(video)}
                  >
                    <div className="flex gap-3">
                      {/* Circular Video Thumbnail */}
                      <div className="relative w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                        {video.thumbnail ? (
                          <>
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        )}
                        
                        {/* Duration Badge */}
                        <div className="absolute -bottom-1 -right-1 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {video.duration || `${index === 0 ? '2:30' : index === 1 ? '15:20' : '6:15'}`}
                        </div>
                        
                        {/* Channel Avatar Overlay */}
                        <div className="absolute -top-1 -left-1">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                            <span className="text-white text-xs font-bold">
                              {athlete?.name?.split(' ').map(n => n.charAt(0)).join('').slice(0, 2) || "AA"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Video Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                          {video.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs capitalize bg-gray-100 text-gray-600">
                            {video.source || 'YouTube'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {videos.length === 0 && (
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