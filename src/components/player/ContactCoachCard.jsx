import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, Phone } from "lucide-react";

export default function ContactCoachCard() {
  const handleRequestInfo = () => {
    // Placeholder for request information functionality
    alert("Request Information feature coming soon!");
  };

  const handleScheduleVisit = () => {
    // Placeholder for schedule visit functionality  
    alert("Schedule Visit feature coming soon!");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Contact Coach</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={handleRequestInfo}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
          size="lg"
        >
          <Mail className="w-4 h-4 mr-2" />
          Request Information
        </Button>
        
        <Button 
          onClick={handleScheduleVisit}
          variant="outline" 
          className="w-full border-gray-300 hover:bg-gray-50 font-medium"
          size="lg"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Visit  
        </Button>
        
        {/* Coach contact info placeholder */}
        <div className="pt-3 border-t border-gray-100 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
            <Phone className="w-4 h-4" />
            <span>Coach available for direct contact</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}