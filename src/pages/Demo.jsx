import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DemoShowcase from "@/components/demo/DemoShowcase";
import SampleDataLoader from "@/components/demo/SampleDataLoader";

export default function DemoPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Platform Demo</h1>
          <p className="text-medium-contrast">See how game performance tracking transforms coaching</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Quick Load Demo Data */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">🚀 Quick Start</h3>
                <p className="text-sm text-blue-700">Load sample games to see all features in action</p>
              </div>
              <SampleDataLoader onDataLoaded={() => {}} />
            </div>
          </CardContent>
        </Card>

        {/* Demo Showcase */}
        <DemoShowcase />
      </div>
    </div>
  );
}