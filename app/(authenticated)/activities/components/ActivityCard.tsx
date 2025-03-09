"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type Activity } from "@/app/(authenticated)/activities/types";

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
}

export function ActivityCard({ activity, onSelect }: ActivityCardProps) {
  const {
    title,
    description,
    requiredResources,
    focusAreas,
    environment,
  } = activity;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        environment === "indoor" ? "border-blue-200" : 
        environment === "outdoor" ? "border-green-200" : "border-purple-200"
      )}
      onClick={() => onSelect(activity)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1">{title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {focusAreas?.slice(0, 3).map((area: { title: string }, index: number) => (
            <Badge key={index} variant="outline" className="text-xs">
              {area.title}
            </Badge>
          ))}
          {(focusAreas?.length ?? 0) > 3 && (
            <Badge variant="outline" className="text-xs">
              +{(focusAreas?.length ?? 0) - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground pt-0">
        {environment && (
          <Badge variant={environment === "indoor" ? "default" : "secondary"} className="text-xs">
            {environment === "indoor" ? "Indoor" : environment === "outdoor" ? "Outdoor" : "Both"}
          </Badge>
        )}
        {(requiredResources?.length ?? 0) > 0 && (
          <div className="text-xs">
            {requiredResources?.length} items needed
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 