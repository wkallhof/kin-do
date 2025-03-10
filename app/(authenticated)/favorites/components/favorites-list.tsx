"use client";

import { useState, useEffect } from "react";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ActivityCard } from "./activity-card";
import { toast } from "sonner";
import { ActivityDetailDrawer } from "../../activities/components/ActivityDetailDrawer";
import { type Activity } from "@/app/(authenticated)/activities/types";

interface FavoriteActivity {
  id: number;
  activityData: Activity;
}

export function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Load favorites on initial render
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) {
          throw new Error('Failed to load favorites');
        }
        const data = await response.json();
        setFavorites(data);
      } catch (err) {
        console.error('Error loading favorites:', err);
        toast.error('Failed to load favorites');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const handleSelectActivity = (activity: Activity, favoriteId: number) => {
    setSelectedActivity(activity);
    setSelectedFavoriteId(favoriteId);
    setIsDetailOpen(true);
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
      setIsDetailOpen(false);
    } catch (err) {
      console.error('Error removing favorite:', err);
      toast.error('Failed to remove favorite');
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[200px] w-full rounded-lg border animate-pulse bg-muted/10" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyPlaceholder>
        <EmptyPlaceholder.Icon name="Heart" />
        <EmptyPlaceholder.Title>No favorite activities</EmptyPlaceholder.Title>
        <EmptyPlaceholder.Description>
          Save activities you love to find them here later.
        </EmptyPlaceholder.Description>
        <Button asChild>
          <Link href="/activities">Find Activities</Link>
        </Button>
      </EmptyPlaceholder>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.filter(favorite => favorite.activityData).map((favorite) => (
          <ActivityCard
            key={favorite.id}
            activity={favorite.activityData}
            isFavorite={true}
            onClick={() => handleSelectActivity(favorite.activityData, favorite.id)}
          />
        ))}
      </div>

      <ActivityDetailDrawer
        activity={selectedActivity}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onSaveAsFavorite={() => {}} // Not needed for favorites page
        isFavorite={true}
        favoriteId={selectedFavoriteId || undefined}
        onRemoveFavorite={handleRemoveFavorite}
      />
    </>
  );
} 