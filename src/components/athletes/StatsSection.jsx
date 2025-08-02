import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DataPoint = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value || "0"}</span>
  </div>
);

export default function StatsSection({ athlete }) {
  const stats = athlete.season_stats || {};
  const chartData = Object.entries(stats)
    .filter(([, value]) => !isNaN(parseFloat(value)))
    .map(([key, value]) => ({ name: key.replace(/ per Game| %/g, ''), value: parseFloat(value) }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Season Averages</CardTitle></CardHeader>
        <CardContent>
          {Object.entries(stats).map(([key, value]) => <DataPoint key={key} label={key} value={value} />)}
          {Object.keys(stats).length === 0 && <p className="text-gray-500">No stats recorded.</p>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Performance Chart</CardTitle></CardHeader>
        <CardContent className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-full text-gray-500">No chart data available.</div>}
        </CardContent>
      </Card>
    </div>
  );
}