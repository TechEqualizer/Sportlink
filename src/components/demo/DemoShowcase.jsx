import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Target,
  BarChart3,
  Star,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { DEMO_SCENARIOS, BADGE_SHOWCASE, getDemoStoryline, getCoachingTakeaways } from "@/utils/demoScript";

export default function DemoShowcase() {
  const [activeScenario, setActiveScenario] = useState('PLAYER_DEVELOPMENT');
  const storyline = getDemoStoryline();
  const takeaways = getCoachingTakeaways();

  return (
    <div className="space-y-6">
      {/* Value Proposition Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">🏀 See the Platform Value in Action</h2>
            <p className="text-blue-100 mb-4">
              This demo shows 5 games of realistic data demonstrating how coaches track performance and motivate players
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">15+</div>
                <div className="text-sm text-blue-100">Badge Types</div>
              </div>
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-blue-100">Games Tracked</div>
              </div>
              <div>
                <div className="text-2xl font-bold">12+</div>
                <div className="text-sm text-blue-100">Badges Earned</div>
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-blue-100">Player Stories</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Scenarios */}
      <Tabs value={activeScenario} onValueChange={setActiveScenario}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="PLAYER_DEVELOPMENT" className="text-xs">Development</TabsTrigger>
          <TabsTrigger value="BADGE_MOTIVATION" className="text-xs">Motivation</TabsTrigger>
          <TabsTrigger value="COACHING_INSIGHTS" className="text-xs">Insights</TabsTrigger>
          <TabsTrigger value="PARENT_ENGAGEMENT" className="text-xs">Engagement</TabsTrigger>
        </TabsList>

        {Object.entries(DEMO_SCENARIOS).map(([key, scenario]) => (
          <TabsContent key={key} value={key} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
                <p className="text-medium-contrast">{scenario.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {scenario.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Badge Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Standout Performances & Badges Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {BADGE_SHOWCASE.map((showcase, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{showcase.scenario}</span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-medium-contrast">{showcase.player}</span>
                  </div>
                  <div className="text-xs text-medium-contrast mb-2">{showcase.stats}</div>
                  <div className="text-xs text-green-700">{showcase.impact}</div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {showcase.badges.map((badge, badgeIndex) => (
                    <Badge key={badgeIndex} variant="outline" className="text-xs bg-yellow-50 text-yellow-800">
                      🏆 {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Game Storyline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Season Storyline (5-Game Journey)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storyline.gameProgression.map((game, index) => (
              <div key={index} className="border-l-4 border-blue-600 pl-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">Game {game.game}: {game.title}</h4>
                  <Badge className={game.outcome.startsWith('W') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {game.outcome}
                  </Badge>
                </div>
                <p className="text-sm text-medium-contrast mb-2">{game.story}</p>
                <div className="flex flex-wrap gap-1">
                  {game.keyMoments.map((moment, momentIndex) => (
                    <span key={momentIndex} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {moment}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Player Development Arcs */}
      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(storyline.playerStories).map(([playerId, story]) => (
          <Card key={playerId} className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="text-base capitalize">{playerId === 'john' ? 'John Smith' : playerId === 'sarah' ? 'Sarah Johnson' : 'Mike Williams'}</CardTitle>
              <p className="text-sm text-medium-contrast">{story.arc}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-xs font-medium text-medium-contrast mb-1">Development</div>
                <div className="text-sm">{story.progression}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-medium-contrast mb-1">Key Stats</div>
                <div className="text-sm text-green-700">{story.stats}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-medium-contrast mb-1">Badges Unlocked</div>
                <div className="flex flex-wrap gap-1">
                  {story.badges.map((badge, badgeIndex) => (
                    <span key={badgeIndex} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coaching Takeaways */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-base text-green-700">Team Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {takeaways.strengths.map((strength, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-green-600" />
                  {strength}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-base text-orange-700">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {takeaways.improvements.map((improvement, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Target className="w-4 h-4 text-orange-600" />
                  {improvement}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Ready to Track Your Team's Journey?
          </h3>
          <p className="text-green-700 mb-4 text-sm">
            Load the demo data above and explore how this level of tracking can transform your coaching!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="bg-white text-green-800">📈 Performance Trends</Badge>
            <Badge variant="outline" className="bg-white text-green-800">🏆 Badge Motivation</Badge>
            <Badge variant="outline" className="bg-white text-green-800">📊 Data-Driven Insights</Badge>
            <Badge variant="outline" className="bg-white text-green-800">👨‍👩‍👧‍👦 Parent Engagement</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}