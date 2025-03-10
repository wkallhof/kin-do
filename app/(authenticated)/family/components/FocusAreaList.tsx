'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { FocusArea } from '@/lib/db/schema/focus-areas';
import { FocusAreaDetailDrawer } from './FocusAreaDetailDrawer';

interface FocusAreaListProps {
  memberId?: number;
  familyId?: number;
  focusAreas: FocusArea[];
}

type FocusAreaWithCategory = Omit<FocusArea, 'category'> & {
  category: 'physical' | 'educational' | 'creative' | 'social' | 'life_skills';
};

export function FocusAreaList({ memberId, familyId, focusAreas }: FocusAreaListProps) {
  const [selectedArea, setSelectedArea] = useState<FocusAreaWithCategory | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get display text for a category
  const getCategoryDisplay = (category: string) => {
    switch(category) {
      case 'physical':
        return 'Physical';
      case 'educational':
        return 'Educational';
      case 'creative':
        return 'Creative';
      case 'social':
        return 'Social';
      case 'life_skills':
        return 'Life Skills';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };
  
  // Get color for category badge
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'physical':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'educational':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      case 'creative':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-800 dark:text-pink-100';
      case 'social':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'life_skills':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  const handleAreaClick = (area: FocusArea) => {
    // Cast the area to FocusAreaWithCategory since we know the category is one of the valid values
    setSelectedArea(area as unknown as FocusAreaWithCategory);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedArea(undefined);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {memberId ? 'Member Focus Areas' : 'Family Focus Areas'}
        </h3>
      </div>
      
      <div className="space-y-3">
        {focusAreas.map((area) => (
          <div 
            key={area.id} 
            className="p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => handleAreaClick(area)}
          >
            <div className="flex flex-col gap-1">
              <div>
                <span className="font-medium">{area.title}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={getCategoryColor(area.category)}>
                  {getCategoryDisplay(area.category)}
                </Badge>
                {area.priority && area.priority > 2 && (
                  <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100">
                    Priority {area.priority}
                  </Badge>
                )}
              </div>
              {area.description && (
                <p className="text-sm text-muted-foreground">{area.description}</p>
              )}
            </div>
          </div>
        ))}

        <div 
          className="flex items-center justify-center p-3 border-2 border-dashed rounded-md hover:border-primary hover:bg-accent transition-colors cursor-pointer"
          onClick={handleAddClick}
        >
          <div className="flex flex-col items-center justify-center text-muted-foreground hover:text-primary">
            <PlusCircle className="h-8 w-8 mb-2" />
            <span className="font-medium">Add Focus Area</span>
          </div>
        </div>
      </div>

      <FocusAreaDetailDrawer
        area={selectedArea}
        familyId={familyId}
        familyMemberId={memberId}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}