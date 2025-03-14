import { z } from 'zod';

export const activitySchema = z.object({
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  environment: z.enum(['indoor', 'outdoor', 'both']),
  icon: z.string(),
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