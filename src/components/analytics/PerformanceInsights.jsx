import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  Target,
  Star,
  Award,
  Users,
  GraduationCap
} from "lucide-react";
import { mockPlayerAnalytics } from "@/api/mockPerformanceData";

export default function PerformanceInsights({ playerId }) {
  const playerData = mockPlayerAnalytics[playerId];
  
  if (!playerData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No performance insights available</p>
        </CardContent>
      </Card>
    );
  }

  const { recruitingProfile, benchmarkProgress } = playerData;

  // Calculate overall performance score
  const benchmarkHitRates = Object.values(benchmarkProgress).map(b => b.hitRate);
  const avgHitRate = benchmarkHitRates.reduce((sum, rate) => sum + rate, 0) / benchmarkHitRates.length;

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'negative': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'negative': return TrendingDown;
      default: return TrendingUp;
    }
  };

  // Generate insights based on performance data
  const insights = [];
  
  // Benchmark performance insights
  Object.entries(benchmarkProgress).forEach(([stat, data]) => {
    if (data.hitRate >= 80) {
      insights.push({
        type: 'positive',
        title: `Exceeding ${stat.charAt(0).toUpperCase() + stat.slice(1)} Target`,
        message: `${data.hitRate}% hit rate with ${data.trend > 0 ? '+' : ''}${data.trend}% trend`,
        action: 'Consider raising benchmark target'
      });
    } else if (data.hitRate < 50) {
      insights.push({
        type: 'warning',
        title: `Below ${stat.charAt(0).toUpperCase() + stat.slice(1)} Target`,
        message: `Only ${data.hitRate}% hit rate, trending ${data.trend > 0 ? '+' : ''}${data.trend}%`,
        action: 'Review target or focus on skill development'
      });
    }
  });

  // College readiness insights
  if (recruitingProfile.collegeReadiness >= 90) {
    insights.push({
      type: 'positive',
      title: 'College Ready',
      message: `${recruitingProfile.collegeReadiness}% readiness score`,
      action: 'Focus on top-tier program recruitment'
    });
  } else if (recruitingProfile.collegeReadiness < 75) {
    insights.push({
      type: 'warning',
      title: 'Development Needed',
      message: `${recruitingProfile.collegeReadiness}% readiness score`,
      action: 'Focus on improvement areas'
    });
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{avgHitRate.toFixed(0)}%</div>
              <div className="text-sm text-blue-700">Benchmark Hit Rate</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{recruitingProfile.collegeReadiness}%</div>
              <div className="text-sm text-green-700">College Readiness</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{playerData.badgeStats.totalBadges}</div>
              <div className="text-sm text-purple-700">Total Badges</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coaching Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Coaching Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              return (
                <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">{insight.title}</div>
                      <div className="text-sm mb-2">{insight.message}</div>
                      <div className="text-sm font-medium">
                        💡 {insight.action}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recruiting Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            College Recruiting Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Readiness Score */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">College Readiness</span>
              <span className="text-lg font-bold">{recruitingProfile.collegeReadiness}%</span>
            </div>
            <Progress value={recruitingProfile.collegeReadiness} className="h-3" />
          </div>

          {/* Strengths */}
          <div>
            <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Strengths
            </h4>
            <div className="flex flex-wrap gap-2">
              {recruitingProfile.strengths.map((strength, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div>
            <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Development Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {recruitingProfile.improvements.map((improvement, index) => (
                <Badge key={index} variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {improvement}
                </Badge>
              ))}
            </div>
          </div>

          {/* Program Fit */}
          <div>
            <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4" />
              Best Program Fits
            </h4>
            <div className="space-y-3">
              {recruitingProfile.programFit.map((program, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-blue-900">{program.school}</div>
                    <div className="text-sm text-blue-700">{program.reason}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{program.fit}%</div>
                    <div className="text-xs text-blue-500">Fit Score</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}