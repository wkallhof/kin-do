"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart } from "lucide-react";
import { Activity } from "../types";
import ReactMarkdown from 'react-markdown';
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ActivityDetailDialogProps {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveAsFavorite: (activity: Activity) => void;
  isFavorite?: boolean;
  favoriteId?: number;
  onRemoveFavorite?: (favoriteId: number) => void;
}

export function ActivityDetailDialog({
  activity,
  open,
  onOpenChange,
  onSaveAsFavorite,
  isFavorite = false,
  favoriteId,
  onRemoveFavorite,
}: ActivityDetailDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!activity) return null;

  const {
    title,
    description,
    instructions,
    requiredResources,
    focusAreas,
    environment,
  } = activity;

  const handleFavoriteToggle = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      if (isFavorite && favoriteId && onRemoveFavorite) {
        // Remove from favorites
        await onRemoveFavorite(favoriteId);
        toast.success("Removed from favorites", {
          description: "Activity has been removed from your favorites",
        });
      } else {
        // Add to favorites
        await onSaveAsFavorite(activity);
        toast.success("Added to favorites", {
          description: "Activity has been added to your favorites",
        });
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
      toast.error("Error", {
        description: "Failed to update favorites",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-[10px] border-t-0 max-w-2xl mx-auto pt-8"
      >
        <SheetHeader>
          <div className="flex items-center gap-2">
            <SheetTitle className="text-xl">{title}</SheetTitle>
            <SheetDescription className="sr-only">
              Activity detail dialog for Kin•Do
            </SheetDescription>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteToggle}
              className="h-9 w-9 shrink-0"
              disabled={isSubmitting}
            >
              <Heart 
                className={cn(
                  "h-5 w-5",
                  isFavorite ? "fill-current text-red-500" : ""
                )} 
              />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 mt-6">
          <div className="space-y-6 pr-4">
            {environment && (
              <div className="flex items-center">
                <Badge 
                  variant={environment === "indoor" ? "default" : "secondary"}
                  className="w-fit"
                >
                  {environment === "indoor" ? "Indoor" : environment === "outdoor" ? "Outdoor" : "Both"}
                </Badge>
              </div>
            )}

            {description && (
              <div>
                <h3 className="font-medium mb-2">Overview</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            )}

            {requiredResources && requiredResources.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Required Resources</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  {requiredResources.map((resource, index) => (
                    <li key={index}>{resource.name}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {instructions && (
              <div>
                <h3 className="font-medium mb-2">Instructions</h3>
                <div className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{instructions}</ReactMarkdown>
                </div>
              </div>
            )}
            
            {focusAreas && focusAreas.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {focusAreas.map((area, index) => (
                    <Badge key={index} variant="outline">
                      {area.title}
                      {area.familyMemberName && (
                        <span className="text-xs ml-1">({area.familyMemberName})</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
} 