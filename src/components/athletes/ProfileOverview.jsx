import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DataPoint = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value || "N/A"}</span>
  </div>
);

export default function ProfileOverview({ athlete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Player Information</CardTitle></CardHeader>
        <CardContent>
          <DataPoint label="Position" value={athlete.position} />
          <DataPoint label="Class" value={athlete.class_year} />
          <DataPoint label="Height" value={athlete.height} />
          <DataPoint label="Weight" value={athlete.weight} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Achievements</CardTitle></CardHeader>
        <CardContent>
          {athlete.achievements && athlete.achievements.length > 0 ? (
            <ul className="space-y-2 list-disc list-inside">
              {athlete.achievements.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          ) : <p className="text-gray-500">No achievements listed.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Character Traits</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {athlete.character_traits && athlete.character_traits.length > 0 ? (
            athlete.character_traits.map((item, i) => <Badge key={i} variant="secondary">{item}</Badge>)
          ) : <p className="text-gray-500">No traits listed.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Coach's Notes</CardTitle></CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{athlete.coach_notes || "No notes available."}</p>
        </CardContent>
      </Card>
    </div>
  );
}