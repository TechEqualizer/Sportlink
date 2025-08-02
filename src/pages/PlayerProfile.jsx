
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Athlete } from "@/api/entities";
import { Video } from "@/api/entities";
import { Team } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { createPageUrl } from "@/utils";

import VideoHero from "../components/shared/VideoHero";
import PlayerInfoCard from "../components/player/PlayerInfoCard";
import PlayerStatsCard from "../components/player/PlayerStatsCard";
import ContactCoachCard from "../components/player/ContactCoachCard";
import PlayerOverviewTab from "../components/player/PlayerOverviewTab";
import PlayerStatisticsTab from "../components/player/PlayerStatisticsTab";
import PlayerAcademicsTab from "../components/player/PlayerAcademicsTab";

export default function PlayerProfile() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [athlete, setAthlete] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("highlights");
  const [activeTab, setActiveTab] = useState("videos"); // Default tab is "overview"
  const [team, setTeam] = useState(null);
  const [videosLoaded, setVideosLoaded] = useState(false); // New state for lazy loading videos
  const [allAthletes, setAllAthletes] = useState([]);
  const [currentAthleteIndex, setCurrentAthleteIndex] = useState(0);

  useEffect(() => {
    loadPlayerData();
  }, [id, location]);

  const loadPlayerData = async () => {
    setIsLoading(true);
    setError(null);
    setVideoError(null);
    setTeam(null);
    setVideosLoaded(false); // Reset video loading state when new player data is loaded
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const athleteId = id || urlParams.get('id') || '1';
      
      console.log("Loading athlete with ID:", athleteId);
      
      const athleteData = await Athlete.list("-created_date");
      console.log("All athletes:", athleteData);
      
      let foundAthlete = null;
      if (athleteData && athleteData.length > 0) {
        foundAthlete = athleteData.find(a => a.id.toString() === athleteId.toString());
        
        if (!foundAthlete && !isNaN(athleteId)) {
          const index = parseInt(athleteId) - 1;
          if (index >= 0 && index < athleteData.length) {
            foundAthlete = athleteData[index];
          }
        }
        
        if (!foundAthlete) {
          foundAthlete = athleteData[0];
        }
      }
      
      if (!foundAthlete) {
        setError("No athletes found in the system");
        setIsLoading(false);
        return;
      }
      
      console.log("Found athlete:", foundAthlete);
      setAthlete(foundAthlete);
      setAllAthletes(athleteData);
      
      // Find current athlete index for swipe navigation
      const index = athleteData.findIndex(a => a.id.toString() === athleteId.toString());
      setCurrentAthleteIndex(index >= 0 ? index : 0);

      try {
        const teamData = await Team.list();
        if (teamData && teamData.length > 0) {
          setTeam(teamData[0]);
        } else {
          console.warn("No team data found. Using default team information.");
          setTeam({ name: "Team", sport_type: "Basketball", school_level: "" });
        }
      } catch (teamError) {
        console.warn("Could not load team data:", teamError);
        setTeam({ name: "Team", sport_type: "Basketball", school_level: "" });
      }
      
      // Only load videos if the activeTab is 'videos' (e.g., if navigated directly to the videos tab)
      // Otherwise, videos will be loaded when the user switches to the 'videos' tab.
      if (activeTab === 'videos') {
        await loadVideosForAthlete(foundAthlete.id);
      }
      
    } catch (error) {
      console.error("Error loading player data:", error);
      setError("Failed to load player information");
    }
    setIsLoading(false);
  };

  // Separate function for loading videos
  const loadVideosForAthlete = async (athleteId) => {
    if (videosLoaded) return; // Don't reload if already loaded
    
    try {
      const videoData = await Video.filter({ athlete_id: athleteId.toString() }, "-created_date");
      console.log("Videos found:", videoData);
      setVideos(videoData || []);
      setVideosLoaded(true); // Mark videos as loaded
      
      if (videoData && videoData.length > 0) {
        // Set activeCategory to the first available video category
        const hasHighlights = videoData.some(v => v.category === "highlights");
        const hasGamefilm = videoData.some(v => v.category === "gamefilm");
        const hasInterviews = videoData.some(v => v.category === "interviews");
        
        if (hasHighlights) setActiveCategory("highlights");
        else if (hasGamefilm) setActiveCategory("gamefilm");
        else if (hasInterviews) setActiveCategory("interviews");
      } else {
        // If no videos, reset active category to a default or handle appropriately
        setActiveCategory("highlights"); 
      }
      
      setVideoError(null);
    } catch (videoLoadError) {
      console.error("Error loading videos for player profile:", videoLoadError);
      setVideoError("Unable to load videos at this time due to a temporary server issue. Please try again later.");
      setVideos([]);
    }
  };

  // Load videos when switching to the 'videos' tab
  useEffect(() => {
    if (activeTab === 'videos' && athlete?.id && !videosLoaded) {
      loadVideosForAthlete(athlete.id);
    }
  }, [activeTab, athlete?.id, videosLoaded]);

  // Force reload videos when component mounts or athlete changes
  useEffect(() => {
    if (athlete?.id) {
      setVideosLoaded(false);
      setVideos([]);
      setVideoError(null);
    }
  }, [athlete?.id]);

  const handleGoBack = () => {
    // Try to go back in history first, but fallback to Athletes page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(createPageUrl("Athletes"));
    }
  };

  const handleSwipeNavigation = (direction) => {
    if (allAthletes.length === 0) return;
    
    let newIndex = currentAthleteIndex;
    if (direction === 'next' && newIndex < allAthletes.length - 1) {
      newIndex++;
    } else if (direction === 'prev' && newIndex > 0) {
      newIndex--;
    } else {
      return; // No navigation possible
    }
    
    const nextAthlete = allAthletes[newIndex];
    if (nextAthlete) {
      navigate(`/PlayerProfile?id=${nextAthlete.id}`, { replace: true });
    }
  };

  // Add touch event handlers for swipe
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const threshold = 100; // Minimum swipe distance
    const restraint = 100; // Maximum perpendicular distance
    
    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const distX = endX - startX;
      const distY = endY - startY;
      
      // Check if it's a horizontal swipe
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        if (distX > 0) {
          handleSwipeNavigation('prev'); // Swipe right = previous
        } else {
          handleSwipeNavigation('next'); // Swipe left = next
        }
      }
    };
    
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('touchstart', handleTouchStart, { passive: true });
      mainElement.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        mainElement.removeEventListener('touchstart', handleTouchStart);
        mainElement.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [allAthletes, currentAthleteIndex]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !athlete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-red-700">Player Not Found</h3>
          <p className="text-gray-600 mb-6">{error || "The requested player profile could not be found."}</p>
          <Button onClick={handleGoBack} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  const categorizedVideos = {
    highlights: videos.filter(v => v.category === "highlights"),
    gamefilm: videos.filter(v => v.category === "gamefilm"),  
    interviews: videos.filter(v => v.category === "interviews")
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Navigation Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button 
            onClick={handleGoBack}
            variant="outline" 
            className="flex items-center gap-2 hover:bg-gray-100 min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          {/* Swipe Navigation Indicators (Mobile) */}
          {allAthletes.length > 1 && (
            <div className="md:hidden flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSwipeNavigation('prev')}
                disabled={currentAthleteIndex === 0}
                className="min-h-[44px] min-w-[44px] p-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-sm text-gray-600 px-2">
                {currentAthleteIndex + 1} of {allAthletes.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSwipeNavigation('next')}
                disabled={currentAthleteIndex === allAthletes.length - 1}
                className="min-h-[44px] min-w-[44px] p-0"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Player Information Tabs (now includes Videos tab) */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-white mb-6"> {/* Changed to grid-cols-4 */}
                <TabsTrigger 
                  value="overview"
                  className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-600"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="videos"
                  className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-600"
                >
                  Videos
                </TabsTrigger>
                <TabsTrigger 
                  value="statistics"
                  className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-600"
                >
                  Statistics
                </TabsTrigger>
                <TabsTrigger 
                  value="academics"
                  className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 text-gray-600"
                >
                  Academics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <PlayerOverviewTab athlete={athlete} />
              </TabsContent>

              <TabsContent value="videos">
                {/* Show video error message if videos failed to load */}
                {videoError && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <p className="text-yellow-800 font-medium">Video Service Temporarily Unavailable</p>
                    </div>
                    <p className="text-yellow-700 text-sm mt-1">{videoError}</p>
                  </div>
                )}

                {/* Show loading indicator for videos if videos tab active and not yet loaded */}
                {activeTab === 'videos' && !videosLoaded && !videoError && (
                  <div className="h-96 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center text-gray-500">
                    Loading videos...
                  </div>
                )}

                {/* Only show video content if videos loaded successfully and there are videos */}
                {!videoError && videosLoaded && videos.length > 0 && (
                  <>
                    {/* Video Category Tabs */}
                    <div className="bg-white rounded-lg mb-6 overflow-hidden shadow-sm">
                      <div className="flex">
                        <button 
                          onClick={() => setActiveCategory("highlights")}
                          className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                            activeCategory === "highlights" 
                              ? "bg-white text-gray-900 border-b-2 border-gray-900" 
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          Highlights
                        </button>
                        <button 
                          onClick={() => setActiveCategory("gamefilm")}
                          className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                            activeCategory === "gamefilm" 
                              ? "bg-white text-gray-900 border-b-2 border-gray-900" 
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          Full games
                        </button>
                        <button 
                          onClick={() => setActiveCategory("interviews")}
                          className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                            activeCategory === "interviews" 
                              ? "bg-white text-gray-900 border-b-2 border-gray-900" 
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          Interviews
                        </button>
                      </div>
                    </div>

                    {/* Video Player */}
                    <div className="mb-8">
                      <VideoHero 
                        videos={categorizedVideos[activeCategory] || []}
                        athlete={athlete}
                        activeCategory={activeCategory}
                      />
                    </div>
                  </>
                )}

                {!videoError && videosLoaded && videos.length === 0 && (
                  <div className="bg-white rounded-lg p-8 text-center shadow-sm">
                    <p className="text-gray-600">No videos available for this athlete.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="statistics">
                <PlayerStatisticsTab athlete={athlete} sportType={team?.sport_type} />
              </TabsContent>

              <TabsContent value="academics">
                <PlayerAcademicsTab athlete={athlete} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Player Info */}
          <div className="lg:col-span-1 space-y-6">
            <PlayerInfoCard athlete={athlete} sportType={team?.sport_type} />
            <PlayerStatsCard athlete={athlete} sportType={team?.sport_type} />
            <ContactCoachCard />
          </div>
        </div>
      </div>
    </div>
  );
}
