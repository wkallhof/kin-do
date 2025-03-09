import { z } from 'zod';

// Update the schema to allow 'both'
const activityEnvironmentEnum = z.enum(['indoor', 'outdoor', 'both']);

export const activitySchema = z.object({
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  environment: activityEnvironmentEnum, // Use the updated enum
  requiredResources: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    environment: z.string(),
  })),
  focusAreas: z.array(z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    familyMemberName: z.string(),
  })),
});