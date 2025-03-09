import { NextRequest } from 'next/server';
import { type FocusArea } from '@/lib/db/schema/focus-areas';
import { resources } from '@/lib/db/schema/resources';
import { familyMembers } from '@/lib/db/schema/families';
import { auth } from '@/lib/auth';
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { activitySchema } from './schema';

interface RequestBody {
  environment: 'indoor' | 'outdoor' | 'both';
  selectedMembers: typeof familyMembers.$inferSelect[];
  focusAreas: FocusArea[];
  resources: typeof resources.$inferSelect[];
}

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const session = await auth();

  // Check if the user is authenticated
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const requestData = await req.json();

    //console.log(requestData);
    
    // Validate the request data
    const { environment, selectedMembers, focusAreas, resources } = requestData as RequestBody;
    
    if (!environment || !selectedMembers || !Array.isArray(selectedMembers) || selectedMembers.length === 0) {
        console.log("Missing required fields in request");
      return new Response(JSON.stringify({ error: 'Missing required fields in request' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add debug logging
    console.log("Starting activity generation...");

    const result = streamObject({
      model: openai('gpt-4o-mini'),
      schema: activitySchema,
      output: 'array',
      prompt: `
        Generate 3 family activities based on the following criteria:
        - Environment: ${environment}
        - Family members: ${selectedMembers.map(member => member?.name).filter(Boolean).join(", ")}
        - Focus areas: ${focusAreas.map(area => area.title).join(", ")}
        - Available resources: ${resources.map(resource => resource.name).join(", ")}
        
        Each activity should include:
        - A title
        - A brief description
        - Step-by-step instructions in markdown format
        - Estimated duration in minutes
        - Required resources from the available list
        - Which focus areas it addresses (with specific mentions of which family member it helps if applicable)
        - Appropriate age range
        - Physical and educational engagement levels (1-5)
        - Supervision requirements
      `,
    });

    // Let's verify we're getting the stream
    const response = result.toTextStreamResponse();
    console.log("Stream response created");
    return response;
  } catch (error) {
    console.error("Error in activity generation:", error);
    return new Response(JSON.stringify({ error: 'Error generating activities' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 