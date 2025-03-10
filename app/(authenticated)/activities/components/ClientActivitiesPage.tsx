"use client";

import { useState, useEffect } from "react";
import { RefinementPanel } from "./RefinementPanel";
import { ActivityCard } from "./ActivityCard";
import { ActivityDetailDrawer } from "./ActivityDetailDrawer";
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
import { differenceInYears, differenceInMonths } from "date-fns";

type Environment = "indoor" | "outdoor" | "both";

interface ClientActivitiesPageProps {
  familyMembers: typeof familyMembers.$inferSelect[];
  focusAreas: Array<FocusArea & {
    familyMemberName: string | null;
  }>;
  resources: typeof resources.$inferSelect[];
}

const STORAGE_KEY = 'kindo-generated-activities';

interface Age {
  years: number;
  months: number;
}

function getAge(dateOfBirth: string | null): Age | null {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  const years = differenceInYears(today, birthDate);
  const totalMonths = differenceInMonths(today, birthDate);
  const months = totalMonths % 12;
  
  return { years, months };
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
  const [storedActivities, setStoredActivities] = useState<z.infer<typeof activitySchema>[]>([]);

  const { object, isLoading, error, submit, stop } = useObject({
    api: '/api/activities-generation',
    schema: z.array(activitySchema),
  });

  // Load activities from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedActivities = JSON.parse(stored);
      setStoredActivities(parsedActivities);
    }
  }, []);

  // Save activities to local storage whenever new ones are generated
  useEffect(() => {
    if (object && object.length > 0) {
      // When new activities are generated, append them to existing ones
      const validActivities = object.filter((activity): activity is Activity => 
        activity !== undefined && 
        activity !== null &&
        typeof activity === 'object' &&
        'title' in activity
      );
      
      if (validActivities.length > 0) {
        // Filter out any activities that already exist in storedActivities
        const newActivities = validActivities.filter(
          newActivity => !storedActivities.some(
            existingActivity => existingActivity.title === newActivity.title
          )
        );

        if (newActivities.length > 0) {
          const updatedActivities = [...storedActivities, ...newActivities];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedActivities));
          setStoredActivities(updatedActivities);
        }
      }
    }
  }, [object, storedActivities]);

  // Combine stored and newly generated activities for display
  const displayedActivities = storedActivities;

  // Calculate how many skeletons to show based on current loading state
  const getSkeletonCount = () => {
    if (!isLoading) return 0;
    // If object exists, show remaining loaders (3 - loaded items)
    if (object) {
      const remainingLoaders = 3 - object.length;
      return Math.max(0, remainingLoaders);
    }
    // If no object yet, show all 3 loaders
    return 3;
  };

  const generateActivities = () => {
    const selectedMemberObjects = selectedMembers
      .map(id => familyMembers.find(m => m.id.toString() === id))
      .filter((member): member is NonNullable<typeof member> => member !== undefined);
    
    if (selectedMemberObjects.length === 0) {
      toast.error('Please select at least one family member');
      return;
    }

    // Get previous activity titles from all current activities
    const previousActivityTitles = storedActivities.map(activity => activity?.title).filter((title): title is string => !!title);
    
    // Filter focus areas and include family member names
    const focusAreasWithNames = focusAreas
      .filter(area => !area.familyMemberId || selectedMembers.includes(area.familyMemberId.toString()))
      .map(area => ({
        id: area.id,
        title: area.title,
        description: area.description,
        familyMemberId: area.familyMemberId?.toString() || null,
        familyMemberName: area.familyMemberName || null
      }));
    
    const requestData = {
      environment,
      selectedMembers: selectedMemberObjects.map(({ id, name, role, dateOfBirth }) => ({ 
        id: id.toString(), 
        name, 
        role,
        age: getAge(dateOfBirth)
      })),
      focusAreas: focusAreasWithNames,
      resources: resources.filter(resource => 
        environment === "both" || resource.environment === (environment as typeof environmentEnum.enumValues[number])
      ),
      previousActivityTitles,
    };

    submit(requestData);
  };

  const handleGenerateActivities = () => {
    setStoredActivities([]); // Clear existing activities when generating new ones
    generateActivities();
  };

  const handleGenerateMore = () => {
    generateActivities();
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

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Render activities using the combined displayedActivities */}
          {displayedActivities?.map((activity, index) => (
            activity && (
              <ActivityCard
                key={`${activity.title}-${index}`}
                activity={activity as Activity}
                onSelect={handleSelectActivity}
              />
            )
          ))}

          {/* Show skeletons for remaining activities while loading */}
          {Array.from({ length: getSkeletonCount() }).map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          ))}
        </div>

        {/* Show error state if there's an error */}
        {error && (
          <div className="col-span-full p-4 text-center text-red-500">
            Error generating activities. Please try again.
          </div>
        )}

        {/* Show empty state when no activities and not loading */}
        {!isLoading && !error && (!displayedActivities || displayedActivities.length === 0) && (
          <div className="col-span-full p-4 text-center text-muted-foreground">
            Click the button above to generate activities.
          </div>
        )}

        {/* Generate More button */}
        {!isLoading && displayedActivities && displayedActivities.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateMore}
              variant="outline"
              className="w-full max-w-sm"
            >
              Generate More Activities
            </Button>
          </div>
        )}
      </div>

      <ActivityDetailDrawer
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