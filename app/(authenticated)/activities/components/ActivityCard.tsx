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
import { Home, Trees } from "lucide-react";
import { useEffect, useState } from "react";

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

  // Check if vibrant mode is enabled (the class is added to documentElement)
  const [isVibrant, setIsVibrant] = useState(false);
  
  useEffect(() => {
    // Check initial state
    setIsVibrant(document.documentElement.classList.contains('theme-vibrant'));
    
    // Set up observer to detect when the theme-vibrant class is toggled
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsVibrant(document.documentElement.classList.contains('theme-vibrant'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        isVibrant 
          ? (environment === "indoor" 
              ? "bg-activity-indoor-bg border-activity-indoor-border text-activity-indoor-text" 
              : environment === "outdoor" 
                ? "bg-activity-outdoor-bg border-activity-outdoor-border text-activity-outdoor-text" 
                : "bg-activity-both-bg border-activity-both-border text-activity-both-text")
          : (environment === "indoor" 
              ? "border-blue-200" 
              : environment === "outdoor" 
                ? "border-green-200" 
                : "border-purple-200")
      )}
      onClick={() => onSelect(activity)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-1">{title}</CardTitle>
            <CardDescription className={cn(
              "line-clamp-2 mt-1",
              isVibrant && (
                environment === "indoor" 
                  ? "text-activity-indoor-text/80"
                  : environment === "outdoor"
                    ? "text-activity-outdoor-text/80"
                    : "text-activity-both-text/80"
              )
            )}>
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          {focusAreas?.slice(0, 3).map((area: { title: string }, index: number) => (
            <Badge key={index} variant="outline" className={cn(
              "text-xs",
              isVibrant && (
                environment === "indoor" 
                  ? "border-activity-indoor-border/50 bg-activity-indoor-border/10"
                  : environment === "outdoor"
                    ? "border-activity-outdoor-border/50 bg-activity-outdoor-border/10"
                    : "border-activity-both-border/50 bg-activity-both-border/10"
              )
            )}>
              {area.title}
            </Badge>
          ))}
          {(focusAreas?.length ?? 0) > 3 && (
            <Badge variant="outline" className={cn(
              "text-xs",
              isVibrant && (
                environment === "indoor" 
                  ? "border-activity-indoor-border/50 bg-activity-indoor-border/10"
                  : environment === "outdoor"
                    ? "border-activity-outdoor-border/50 bg-activity-outdoor-border/10"
                    : "border-activity-both-border/50 bg-activity-both-border/10"
              )
            )}>
              +{(focusAreas?.length ?? 0) - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs pt-0">
        {environment && (
          <div className={cn(
            "rounded-full p-1.5",
            isVibrant 
              ? (environment === "indoor" 
                  ? "bg-activity-indoor-border/30" 
                  : environment === "outdoor" 
                    ? "bg-activity-outdoor-border/30" 
                    : "bg-activity-both-border/30")
              : (environment === "indoor"
                  ? "bg-blue-100" 
                  : environment === "outdoor" 
                    ? "bg-green-100" 
                    : "bg-purple-100")
          )}>
            {environment === "indoor" ? (
              <Home className={cn("h-4 w-4", !isVibrant && "text-blue-500")} />
            ) : environment === "outdoor" ? (
              <Trees className={cn("h-4 w-4", !isVibrant && "text-green-500")} />
            ) : (
              <div className="flex gap-1">
                <Home className={cn("h-4 w-4", !isVibrant && "text-purple-500")} />
                <Trees className={cn("h-4 w-4", !isVibrant && "text-purple-500")} />
              </div>
            )}
          </div>
        )}
        {(requiredResources?.length ?? 0) > 0 && (
          <div className={cn(
            "text-xs",
            isVibrant && (
              environment === "indoor" 
                ? "text-activity-indoor-text/80"
                : environment === "outdoor"
                  ? "text-activity-outdoor-text/80"
                  : "text-activity-both-text/80"
            )
          )}>
            {requiredResources?.length} items needed
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 