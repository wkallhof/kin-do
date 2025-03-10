import { NextRequest } from 'next/server';
import { resources } from '@/lib/db/schema/resources';
import { auth } from '@/lib/auth';
import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { activitySchema } from './schema';

interface RequestBody {
  environment: 'indoor' | 'outdoor' | 'both';
  selectedMembers: Array<{
    id: string;
    name: string;
    role: string;
    age: { years: number; months: number; } | null;
  }>;
  focusAreas: Array<{
    id: string;
    title: string;
    description: string | null;
    familyMemberId: string | null;
    familyMemberName: string | null;
  }>;
  resources: typeof resources.$inferSelect[];
  previousActivityTitles: string[];
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

    // Validate the request data
    const { environment, selectedMembers, focusAreas, resources, previousActivityTitles = [] } = requestData as RequestBody;
    
    if (!environment || !selectedMembers || !Array.isArray(selectedMembers) || selectedMembers.length === 0) {
        console.log("Missing required fields in request");
      return new Response(JSON.stringify({ error: 'Missing required fields in request' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `
      You are a creative family activity generator that specializes in designing engaging activities for families.
      
      You will be given:
      - An environment preference (indoor/outdoor/both)
        Note: When "both" is specified, you must choose either indoor or outdoor for each activity - do not return "both" as an environment
      - Family member details including names, roles, and ages
      - Focus areas for development with descriptions and target family members
      - Available resources/materials
      - Previously generated activities to avoid repetition
      
      For each activity you generate, you must include:
      - A descriptive title
      - A brief but engaging description
      - Clear step-by-step instructions in markdown format
      - The appropriate environment setting (must be either "indoor" or "outdoor", never "both")
      - Required resources from the provided list only
      - Targeted focus areas with specific mentions of which family members benefit
      
      Important guidelines:
      - Activities should be age-appropriate and safe
      - Use focus area descriptions to tailor activities to specific needs
      - Adapt complexity based on participating family members' ages
      - Ensure activities are unique and different from previous ones
      - Make activities engaging and fun while meeting developmental goals
      - When environment preference is "both", freely choose between indoor and outdoor for each activity
    `;

    const userPrompt = `
      Generate 3 unique and creative family activities based on the following criteria:
      
      Environment: ${environment}
      ${environment === 'both' ? '(Note: Choose either indoor or outdoor for each activity)' : ''}
      
      Family Members:
      ${selectedMembers.map(member => {
        let ageInfo = '';
        if (member.age) {
          const { years, months } = member.age;
          const yearText = years === 1 ? 'year' : 'years';
          const monthText = months === 1 ? 'month' : 'months';
          
          if (years === 0) {
            ageInfo = ` (${months} ${monthText} old)`;
          } else if (months === 0) {
            ageInfo = ` (${years} ${yearText} old)`;
          } else {
            ageInfo = ` (${years} ${yearText}, ${months} ${monthText} old)`;
          }
        }
        return `- ${member.name} - ${member.role}${ageInfo}`;
      }).join("\n")}
      
      Focus Areas:
      ${focusAreas.map(area => {
        const assignedTo = area.familyMemberName ? `for ${area.familyMemberName}` : 'for whole family';
        const description = area.description ? `\n   Description: ${area.description}` : '';
        return `- ${area.title} (${assignedTo})${description}`;
      }).join("\n\n")}
      
      Available Resources:
      ${resources.map(resource => resource.name).join(", ")}
      
      ${previousActivityTitles.length > 0 ? `
      Previously Generated Activities (please avoid similar ones):
      ${previousActivityTitles.join(", ")}
      ` : ''}
    `;

    const result = streamObject({
      model: openai('gpt-4o-mini'),
      schema: activitySchema,
      output: 'array',
      system: systemPrompt,
      prompt: userPrompt,
    });

    // Let's verify we're getting the stream
    return result.toTextStreamResponse();
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