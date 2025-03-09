"use client";

import { useState } from "react";
import { RefinementPanel } from "./RefinementPanel";
import { ActivityCard } from "./ActivityCard";
import { ActivityDetailDialog } from "./ActivityDetailDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { resources, environmentEnum } from "@/lib/db/schema/resources";
import { familyMembers } from "@/lib/db/schema/families";
import { toast } from "sonner";
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { activitySchema } from '@/app/api/activities-generation/schema';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { type FocusArea } from "@/lib/db/schema/focus-areas";
import { type Activity } from "@/app/(authenticated)/activities/types";

type Environment = "indoor" | "outdoor" | "both";

interface ClientActivitiesPageProps {
  familyMembers: typeof familyMembers.$inferSelect[];
  focusAreas: FocusArea[];
  resources: typeof resources.$inferSelect[];
}

export function ClientActivitiesPage({
  familyMembers,
  focusAreas,
  resources,
}: ClientActivitiesPageProps) {
  const [environment, setEnvironment] = useState<Environment>("both");
  const [selectedMembers, setSelectedMembers] = useState<string[]>(familyMembers.map(m => m.id.toString()));
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [favorites, setFavorites] = useState<Array<{ id: number; activityData: Activity }>>([]);

  const { object, isLoading, error, submit, stop } = useObject({
    api: '/api/activities-generation',
    schema: z.array(activitySchema),
  });

  const handleGenerateActivities = () => {
    const selectedMemberObjects = selectedMembers
      .map(id => familyMembers.find(m => m.id.toString() === id))
      .filter((member): member is NonNullable<typeof member> => member !== undefined);
    
    if (selectedMemberObjects.length === 0) {
      toast.error('Please select at least one family member');
      return;
    }
    
    const requestData = {
      environment,
      selectedMembers: selectedMemberObjects.map(({ id, name, role }) => ({ id, name, role })),
      focusAreas: focusAreas.filter(area => 
        !area.familyMemberId || selectedMembers.includes(area.familyMemberId.toString())
      ),
      resources: resources.filter(resource => 
        environment === "both" || resource.environment === (environment as typeof environmentEnum.enumValues[number])
      ),
    };

    submit(requestData);
  };
  
  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDetailOpen(true);
  };

  const handleSaveAsFavorite = async (activity: Activity) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activity }),
      });

      if (!response.ok) {
        throw new Error('Failed to save favorite');
      }

      const newFavorite = await response.json();
      setFavorites(prev => [...prev, newFavorite]);
    } catch (err) {
      console.error('Error saving favorite:', err);
      toast.error('Failed to save favorite');
    }
  };

  const handleRemoveFavorite = async (favoriteId: number) => {
    try {
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove favorite');
    }
  };

  // Check if the selected activity is a favorite
  const isFavorite = selectedActivity ? 
    favorites.some(fav => 
      fav.activityData.title === selectedActivity.title && 
      fav.activityData.description === selectedActivity.description
    ) : false;

  // Get the favorite ID if it's a favorite
  const favoriteId = selectedActivity ? 
    favorites.find(fav => 
      fav.activityData.title === selectedActivity.title && 
      fav.activityData.description === selectedActivity.description
    )?.id : undefined;

  return (
    <div className="space-y-6">
      <RefinementPanel
        environment={environment}
        setEnvironment={setEnvironment}
        familyMembers={familyMembers}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
        onRefresh={handleGenerateActivities}
        isLoading={isLoading}
      />

      <div className="flex justify-center">
        {isLoading ? (
          <Button 
            variant="outline"
            onClick={() => stop()}
            className="w-full max-w-sm"
          >
            Stop Generation
          </Button>
        ) : (
          <Button 
            onClick={handleGenerateActivities}
            className="w-full max-w-sm"
          >
            Generate Activities
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Render existing activities as they stream in */}
        {object?.map((activity, index) => (
          activity && (
            <ActivityCard
              key={`${activity.title}-${index}`}
              activity={activity as Activity}
              onSelect={handleSelectActivity}
            />
          )
        ))}

        {/* Show skeletons for remaining activities while loading */}
        {isLoading && Array.from({ length: 3 - (object?.length || 0) }).map((_, i) => (
          <div key={`skeleton-${i}`} className="space-y-4">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}

        {/* Show error state if there's an error */}
        {error && (
          <div className="col-span-full p-4 text-center text-red-500">
            Error generating activities. Please try again.
          </div>
        )}

        {/* Show empty state when no activities and not loading */}
        {!isLoading && !error && (!object || object.length === 0) && (
          <div className="col-span-full p-4 text-center text-muted-foreground">
            Click the button above to generate activities.
          </div>
        )}
      </div>

      <ActivityDetailDialog
        activity={selectedActivity}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onSaveAsFavorite={handleSaveAsFavorite}
        isFavorite={isFavorite}
        favoriteId={favoriteId}
        onRemoveFavorite={handleRemoveFavorite}
      />
    </div>
  );
} 