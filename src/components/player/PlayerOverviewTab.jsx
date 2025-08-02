import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, MessageSquare } from "lucide-react";

export default function PlayerOverviewTab({ athlete }) {
  const statusColors = {
    Open: "bg-green-500 text-white",
    Committed: "bg-blue-500 text-white", 
    Verbal: "bg-orange-500 text-white"
  };

  const getClassColor = (classYear) => {
    switch (classYear) {
      case "Senior": return "bg-red-500 text-white";
      case "Junior": return "bg-blue-500 text-white";
      case "Sophomore": return "bg-green-500 text-white";
      case "Freshman": return "bg-purple-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Position:</span>
            <span className="font-bold">{athlete.position}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Height:</span>
            <span className="font-bold">{athlete.height || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Weight:</span>
            <span className="font-bold">{athlete.weight || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Class:</span>
            <Badge className={getClassColor(athlete.class_year)}>
              {athlete.class_year}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Status:</span>
            <Badge className={statusColors[athlete.recruiting_status] || statusColors.Open}>
              {athlete.recruiting_status || "Open"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {athlete.achievements && athlete.achievements.length > 0 ? (
              athlete.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{achievement}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Trophy className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No achievements listed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Character Traits */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            Character Traits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {athlete.character_traits && athlete.character_traits.length > 0 ? (
              athlete.character_traits.map((trait, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 border-blue-200"
                >
                  {trait}
                </Badge>
              ))
            ) : (
              <div className="w-full text-center py-6 text-gray-500">
                <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No character traits listed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Coach Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            Coach Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {athlete.coach_notes ? (
            <p className="text-gray-700 leading-relaxed">{athlete.coach_notes}</p>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No coach notes available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* College Interest */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold">College Interest</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {athlete.college_interest && athlete.college_interest.length > 0 ? (
              athlete.college_interest.map((college, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="px-3 py-1 text-sm font-medium border-blue-200 text-blue-800 bg-blue-50"
                >
                  {college}
                </Badge>
              ))
            ) : (
              <div className="w-full text-center py-6 text-gray-500">
                <p>No college interests listed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}