"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Activity, FocusArea } from "../types";
import { RefinementPanel } from "./RefinementPanel";
import { ActivityCard } from "./ActivityCard";
import { ActivityDetailDialog } from "./ActivityDetailDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { resources, environmentEnum } from "@/lib/db/schema/resources";
import { familyMembers } from "@/lib/db/schema/families";
import { PullToRefresh } from "./PullToRefresh";
import { toast } from "sonner";

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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Array<{ id: number; activityData: Activity }>>([]);
  
  // Filter resources and focus areas based on current selections
  const filteredResources = useMemo(() => 
    resources.filter(resource => 
      environment === "both" || resource.environment === (environment as typeof environmentEnum.enumValues[number])
    ), [environment, resources]);

  const filteredFocusAreas = useMemo(() => 
    focusAreas.filter(area => 
      !area.familyMemberId || selectedMembers.includes(area.familyMemberId.toString())
    ), [focusAreas, selectedMembers]);

  const generateActivities = useCallback(async (abortSignal?: AbortSignal) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const selectedMemberObjects = selectedMembers
        .map(id => familyMembers.find(m => m.id.toString() === id))
        .filter((member): member is NonNullable<typeof member> => member !== undefined);
      
      if (selectedMemberObjects.length === 0) {
        setActivities([]);
        return;
      }
      
      const requestData = {
        environment,
        selectedMembers: selectedMemberObjects.map(({ id, name, role }) => ({ id, name, role })),
        focusAreas: filteredFocusAreas.map(({ id, title, category, familyMemberId, familyMemberName }) => 
          ({ id, title, category, familyMemberId, familyMemberName })),
        resources: filteredResources.map(({ id, name, environment }) => ({ id, name, environment }))
      };

      const response = await fetch('/api/activities-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        body: JSON.stringify(requestData),
        signal: abortSignal
      });

      if (!response.ok) {
        throw new Error('Failed to generate activities');
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      
      if (!abortSignal?.aborted) {
        setActivities(data);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Ignore abort errors
      }
      setError(err instanceof Error ? err.message : 'Failed to generate activities');
    } finally {
      setIsLoading(false);
    }
  }, [environment, selectedMembers, familyMembers, filteredFocusAreas, filteredResources]);

  // Load favorites once on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) throw new Error('Failed to load favorites');
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };
    loadFavorites();
  }, []);

  // Generate activities when refinements change
  useEffect(() => {
    const abortController = new AbortController();
    generateActivities(abortController.signal);
    return () => abortController.abort();
  }, [generateActivities]);

  const handleRefresh = useCallback(() => {
    generateActivities();
  }, [generateActivities]);
  
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
      
      // Don't close the dialog automatically
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
      
      // Don't close the dialog automatically
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
        onRefresh={handleRefresh}
        isLoading={isLoading}
      />

      <PullToRefresh onRefresh={handleRefresh} isLoading={isLoading}>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            // Show 3 skeleton cards while loading
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full p-4 text-center text-red-500">
              Error generating activities: {error}. Please try again.
            </div>
          ) : activities.length === 0 ? (
            <div className="col-span-full p-4 text-center text-muted-foreground">
              No activities found. Try adjusting your filters or refreshing.
            </div>
          ) : (
            activities.map((activity, index) => (
              <ActivityCard
                key={activity.id || index}
                activity={activity}
                onSelect={handleSelectActivity}
              />
            ))
          )}
        </div>
      </PullToRefresh>

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