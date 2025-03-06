import { OpenAI } from 'openai';
import { NextRequest } from 'next/server';
import { type FocusArea } from '@/lib/db/schema/focus-areas';
import { resources } from '@/lib/db/schema/resources';
import { familyMembers } from '@/lib/db/schema/families';
import { auth } from '@/lib/auth';

// Create an OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RequestBody {
  environment: 'indoor' | 'outdoor' | 'both';
  selectedMembers: typeof familyMembers.$inferSelect[];
  focusAreas: FocusArea[];
  resources: typeof resources.$inferSelect[];
}

export async function POST(req: NextRequest) {
  const session = await auth();

  // Check if the user is authenticated
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Clone the request to read it multiple ways if needed
    const clonedReq = req.clone();

    // Try to read as JSON directly first
    let requestData;
    try {
      requestData = await req.json();
    } catch {
      // Fallback to reading as text if JSON parse fails
      try {
        const text = await clonedReq.text();
        
        if (!text || text.trim() === '') {
          return new Response(JSON.stringify({ error: 'Empty request body' }), { 
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        
        requestData = JSON.parse(text);
      } catch {
        return new Response(JSON.stringify({ error: 'Failed to read request body' }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    // Validate the request data
    const { environment, selectedMembers, focusAreas, resources } = requestData as RequestBody;
    
    if (!environment || !selectedMembers || !Array.isArray(selectedMembers) || selectedMembers.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing required fields in request' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create the prompt for OpenAI
    const prompt = `
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
      
      Return the data as a JSON array of activities with the following structure:
      [
        {
          "title": "Activity Title",
          "description": "Brief description",
          "instructions": "Step-by-step instructions in markdown",
          "environment": "indoor",
          "requiredResources": [
            { "id": "resource-id", "name": "Resource Name", "type": "resource-type", "environment": "indoor" }
          ],
          "focusAreas": [
            { "id": "focus-area-id", "title": "Focus Area Title", "category": "category", "familyMemberName": "Child Name" }
          ]
        }
      ]
      
      Make sure the JSON is valid and properly formatted. Do not include any explanatory text before or after the JSON.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that generates family activities based on specific criteria. You always respond with valid JSON only, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    // Get the response content
    const responseContent = completion.choices[0].message.content;
    
    // Clean up and validate the response content
    let jsonResponse;
    try {
      // Trim any whitespace and make sure it's valid JSON
      const cleanJsonText = responseContent ? responseContent.trim() : '';
      jsonResponse = JSON.parse(cleanJsonText);
      
      // Ensure it's an array
      if (!Array.isArray(jsonResponse)) {
        jsonResponse = []; // Default to empty array if not array
      }
      
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid response from activity generation' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Return the validated JSON response
    return new Response(JSON.stringify(jsonResponse), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error generating activities' }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 