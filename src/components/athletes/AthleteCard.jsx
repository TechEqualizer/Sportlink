import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const statusColors = {
  Open: "bg-green-100 text-green-800 border-green-200",
  Committed: "bg-blue-100 text-blue-800 border-blue-200",
  Verbal: "bg-orange-100 text-orange-800 border-orange-200"
};

export default function AthleteCard({ athlete, isSelected, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 ${
          isSelected 
            ? "ring-2 ring-[var(--primary-color)] shadow-lg" 
            : "hover:shadow-md border-gray-200"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ background: 'var(--primary-color)' }}
            >
              {athlete.jersey_number || athlete.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {athlete.name}
              </h3>
              <p className="text-sm text-gray-600">
                {athlete.position} • {athlete.class_year}
              </p>
              <div className="flex items-center justify-between mt-2">
                <Badge 
                  variant="secondary"
                  className={`text-xs ${statusColors[athlete.recruiting_status] || statusColors.Open}`}
                >
                  {athlete.recruiting_status || "Open"}
                </Badge>
                <Link 
                  to={createPageUrl(`PlayerProfile`) + `?id=${athlete.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}