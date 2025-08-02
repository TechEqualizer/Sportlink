import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Calendar } from "lucide-react";

const statusColors = {
  Open: "bg-green-500 text-white",
  Committed: "bg-blue-500 text-white", 
  Verbal: "bg-orange-500 text-white"
};

export default function PlayerInfoCard({ athlete }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header with recruiting status */}
        <div className="bg-gray-100 px-4 py-3 flex items-center justify-between">
          <Badge className={`${statusColors[athlete.recruiting_status] || statusColors.Open} font-medium`}>
            {athlete.recruiting_status || "Open"}
          </Badge>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">#{athlete.jersey_number || "00"}</div>
          </div>
        </div>
        
        {/* Player Info */}
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{athlete.name}</h1>
          <div className="text-gray-600 mb-4">
            <span className="font-medium">{athlete.position}</span>
            <span className="mx-2">•</span>
            <span>{athlete.class_year}</span>
          </div>
          
          {/* Physical Stats */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Height</span>
              <span className="font-semibold">{athlete.height || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Weight</span>
              <span className="font-semibold">{athlete.weight || "N/A"}</span>
            </div>
          </div>
          
          {/* Location */}
          {athlete.hometown && (
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{athlete.hometown}</span>
            </div>
          )}
          
          {/* High School */}
          {athlete.high_school && (
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <span className="text-sm">{athlete.high_school}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}