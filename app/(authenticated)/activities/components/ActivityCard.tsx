"use client";

import {
  Card,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type Activity } from "@/app/(authenticated)/activities/types";
import { Home, Trees, HelpCircle, type LucideIcon, type LucideProps } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  colorIndex?: number; // Optional prop to control the color
}

// Dynamic Lucide icon component with TypeScript safety
function DynamicIcon({ 
  iconName, 
  ...props 
}: { 
  iconName: string; 
} & LucideProps) {
  // Type assertion to access Lucide icons dynamically
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcon>)[iconName];
  
  if (IconComponent) {
    return <IconComponent {...props} />;
  }
  
  // Fallback to HelpCircle if icon not found
  return <HelpCircle {...props} />;
}

function EnvironmentIcon({ 
  environment, 
  className,
  strokeWidth = 2 
}: { 
  environment: Activity['environment']; 
  className?: string;
  strokeWidth?: number;
}) {
  if (environment === "indoor") {
    return <Home className={className} strokeWidth={strokeWidth} />;
  }
  if (environment === "outdoor") {
    return <Trees className={className} strokeWidth={strokeWidth} />;
  }
  return (
    <div className="flex gap-1">
      <Home className={className} strokeWidth={strokeWidth} />
      <Trees className={className} strokeWidth={strokeWidth} />
    </div>
  );
}

export function ActivityCard({ activity, onSelect, colorIndex = 1 }: ActivityCardProps) {
  const {
    title,
    icon = "PlaySquare", // Default to PlaySquare icon for kid activities
    environment,
  } = activity;

  // Ensure colorIndex is between 1 and 5
  const safeColorIndex = ((colorIndex - 1) % 5) + 1;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all overflow-hidden relative rounded-3xl border-0 shadow-md",
        "flex flex-row items-center p-3 bg-background" // White background with row layout
      )}
      onClick={() => onSelect(activity)}
    >
      {/* Icon container with colored background */}
      <div className={cn(
        "flex items-center justify-center",
        "h-16 w-16 rounded-2xl mr-4", // Square with rounded corners
        `bg-card-bg-${safeColorIndex}` // Colored background based on index
      )}>
        <DynamicIcon 
          iconName={icon}
          className="h-8 w-8 text-gray-700/70 mix-blend-multiply"
          strokeWidth={1.5}
        />
      </div>
      
      {/* Title section */}
      <div className="flex-1">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
        
        {/* Optional subtitle or lesson count could go here */}
        {environment && (
          <div className="flex items-center mt-1">
            <EnvironmentIcon 
              environment={environment} 
              className="h-3.5 w-3.5 text-gray-500 mr-1.5"
              strokeWidth={1.5}
            />
            <span className="text-sm text-gray-500">
              {environment.charAt(0).toUpperCase() + environment.slice(1)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}