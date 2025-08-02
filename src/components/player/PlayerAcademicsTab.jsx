import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, School, MapPin, Phone, Mail, Calendar } from "lucide-react";

export default function PlayerAcademicsTab({ athlete }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Academic Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-yellow-500" />
            Academic Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* GPA */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">GPA</span>
              <span className="text-2xl font-bold text-yellow-600">
                {athlete.gpa ? athlete.gpa.toFixed(1) : "N/A"}
              </span>
            </div>
          </div>

          {/* SAT Score */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">SAT Score</span>
              <span className="text-2xl font-bold text-blue-600">
                {athlete.sat_score || "N/A"}
              </span>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <span className="text-gray-600 font-medium block mb-1">Major</span>
              <span className="font-bold text-gray-900">
                {athlete.major || "Business Administration"}
              </span>
            </div>

            <div>
              <span className="text-gray-600 font-medium block mb-1">High School</span>
              <span className="font-bold text-gray-900">
                {athlete.high_school || "Lincoln High School"}
              </span>
            </div>

            <div>
              <span className="text-gray-600 font-medium block mb-1">Hometown</span>
              <span className="font-bold text-gray-900">
                {athlete.hometown || "Chicago, IL"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Coach */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Contact Coach</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Phone className="w-4 h-4" />
            Schedule a Call
          </button>

          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <Mail className="w-4 h-4" />
            Send Email
          </button>

          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
            <MapPin className="w-4 h-4" />
            Campus Visit
          </button>
        </CardContent>
      </Card>

      {/* College Interest - Full Width */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold">College Interest</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {athlete.college_interest && athlete.college_interest.length > 0 ? (
              athlete.college_interest.map((college, index) => (
                <div 
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {college.split(' ').map(word => word[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{college}</h4>
                      <p className="text-sm text-gray-600">Division I</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <School className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No college interests listed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}