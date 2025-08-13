import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Trophy, Filter } from "lucide-react";

const FILTER_OPTIONS = {
  period: [
    { value: "all", label: "All Games", icon: Calendar },
    { value: "last5", label: "Last 5", icon: Calendar },
    { value: "last10", label: "Last 10", icon: Calendar }
  ],
  location: [
    { value: "all", label: "All", icon: MapPin },
    { value: "home", label: "Home", icon: MapPin },
    { value: "away", label: "Away", icon: MapPin }
  ],
  result: [
    { value: "all", label: "All", icon: Trophy },
    { value: "win", label: "Wins", icon: Trophy },
    { value: "loss", label: "Losses", icon: Trophy }
  ]
};

export default function QuickFilters({ filters = {}, onFiltersChange, className = "" }) {
  const updateFilter = (category, value) => {
    const newFilters = {
      ...filters,
      [category]: value === filters[category] ? "all" : value
    };
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value && value !== "all").length;
  };

  const clearAllFilters = () => {
    onFiltersChange({
      period: "all",
      location: "all", 
      result: "all"
    });
  };

  return (
    <Card className={`bg-slate-900 border-slate-700 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-200 font-medium">Filters</span>
            {getActiveFiltersCount() > 0 && (
              <Badge variant="outline" className="bg-blue-900/20 text-blue-400 border-blue-400/30">
                {getActiveFiltersCount()} active
              </Badge>
            )}
          </div>
          
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs"
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Time Period Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Time Period</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.period.map(option => (
                <Button
                  key={option.value}
                  variant={filters.period === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("period", option.value)}
                  className={
                    filters.period === option.value
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Location</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.location.map(option => (
                <Button
                  key={option.value}
                  variant={filters.location === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("location", option.value)}
                  className={
                    filters.location === option.value
                      ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                      : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Game Result Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Game Result</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.result.map(option => (
                <Button
                  key={option.value}
                  variant={filters.result === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("result", option.value)}
                  className={
                    filters.result === option.value
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600"
                      : "bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700">
            <div className="text-xs text-slate-400 mb-2">Active Filters:</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === "all") return null;
                
                const category = FILTER_OPTIONS[key];
                const option = category?.find(opt => opt.value === value);
                
                if (!option) return null;
                
                return (
                  <Badge
                    key={`${key}-${value}`}
                    variant="outline"
                    className="bg-slate-800 text-slate-300 border-slate-600 text-xs"
                  >
                    {option.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}