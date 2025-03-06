import { type FocusArea as DbFocusArea } from "@/lib/db/schema/focus-areas";
import { type ActivityData } from "@/lib/db/schema/activities";
import { resources, environmentEnum } from "@/lib/db/schema/resources";
import { familyMembers } from "@/lib/db/schema/families";

export type FamilyMember = typeof familyMembers.$inferSelect;
export type Resource = typeof resources.$inferSelect;

export interface FocusArea extends DbFocusArea {
  familyMemberName?: string | null;
}

export interface Activity extends ActivityData {
  id?: string;
  environment: typeof environmentEnum.enumValues[number] | "both";
  requiredResources?: Resource[];
  focusAreas?: FocusArea[];
  weatherRequirements?: WeatherRequirements;
}

export interface WeatherRequirements {
  temperature?: {
    min?: number;
    max?: number;
  };
  conditions?: Array<'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy'>;
  avoidConditions?: Array<'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy'>;
}

export interface ActivitiesFilter {
  environment: typeof environmentEnum.enumValues[number] | "both";
  familyMemberIds: string[];
  noiseLevel?: 'quiet' | 'medium' | 'loud';
  healthStatus?: 'healthy' | 'sick';
  energyLevel?: 'low' | 'medium' | 'high';
  duration?: 'short' | 'medium' | 'long';
} 