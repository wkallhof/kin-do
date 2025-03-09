import { type ActivityData } from "@/lib/db/schema/activities";
import { environmentEnum } from "@/lib/db/schema/resources";

export interface Activity extends ActivityData {
  environment: typeof environmentEnum.enumValues[number];
  requiredResources: Array<{
    id: string;
    name: string;
    type: string;
    environment: string;
  }>;
  focusAreas: Array<{
    id: string;
    title: string;
    category: string;
    familyMemberName: string;
  }>;
} 