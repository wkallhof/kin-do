"use client";

import { useState, useCallback, useEffect, useRef } from "react";
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
  const isInitialLoadRef = useRef(true);

  // Load favorites on initial render
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error('Failed to load favorites');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        console.error('Error loading favorites:', err);
      }
    };

    loadFavorites();
  }, []);

  // Filter resources based on selected environment
  const filteredResources = resources.filter(
    resource => environment === "both" || resource.environment === (environment as typeof environmentEnum.enumValues[number])
  );

  // Filter focus areas based on selected family members
  const filteredFocusAreas = focusAreas.filter(
    area => !area.familyMemberId || selectedMembers.includes(area.familyMemberId.toString())
  );

  const generateActivities = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Map selectedMembers to actual member objects, filtering out any undefined values
      const selectedMemberObjects = selectedMembers
        .map(id => familyMembers.find(m => m.id.toString() === id))
        .filter(member => member !== undefined);
      
      // If no members are selected, don't make the API call
      if (selectedMemberObjects.length === 0) {
        setActivities([]);
        setIsLoading(false);
        return;
      }
      
      const requestData = {
        environment,
        selectedMembers: selectedMemberObjects.map(member => ({
          id: member?.id,
          name: member?.name,
          role: member?.role,
        })),
        focusAreas: filteredFocusAreas.map(area => ({
          id: area.id,
          title: area.title,
          category: area.category,
          familyMemberId: area.familyMemberId,
          familyMemberName: area.familyMemberName
        })),
        resources: filteredResources.map(resource => ({
          id: resource.id,
          name: resource.name,
          environment: resource.environment
        }))
      };
      
      const requestBody = JSON.stringify(requestData);
      if (!requestBody || requestBody === '{}' || requestBody === '[]') {
        setError('Unable to prepare request data. Please try again.');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/activities-generation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: requestBody
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected an array');
      }
      
      setActivities(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate activities');
    } finally {
      setIsLoading(false);
    }
  };

  // Combined effect for initial load and refinement changes
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
    }
    setActivities([]); // Clear current activities
    generateActivities();
  }, [environment, selectedMembers, familyMembers.length, focusAreas.length, resources.length]);
  
  const handleRefresh = useCallback(() => {
    setActivities([]); // Clear activities immediately
    generateActivities();
  }, []);
  
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
          {isLoading && !activities.length ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-[200px] w-full rounded-lg" />
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