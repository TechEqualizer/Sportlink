import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DataPoint = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value || "N/A"}</span>
  </div>
);

export default function AcademicsSection({ athlete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Academic Profile</CardTitle></CardHeader>
        <CardContent>
          <DataPoint label="High School" value={athlete.high_school} />
          <DataPoint label="Hometown" value={athlete.hometown} />
          <DataPoint label="GPA" value={athlete.gpa} />
          <DataPoint label="SAT Score" value={athlete.sat_score} />
          <DataPoint label="Major Interest" value={athlete.major} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>College Interest</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {athlete.college_interest && athlete.college_interest.length > 0 ? (
            athlete.college_interest.map((item, i) => <Badge key={i}>{item}</Badge>)
          ) : <p className="text-gray-500">No colleges listed.</p>}
        </CardContent>
      </Card>
    </div>
  );
}