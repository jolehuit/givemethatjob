import { NextResponse } from 'next/server';

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const TAVUS_RECRUITER_REPLICA_ID = process.env.TAVUS_RECRUITER_REPLICA_ID;

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!TAVUS_API_KEY || !TAVUS_RECRUITER_REPLICA_ID) {
      throw new Error('Missing required Tavus configuration');
    }

    const body = await request.json();
    const { interview_id, job_title, company, cv_path } = body;

    // Validate required request data
    if (!job_title || !company) {
      throw new Error('Missing required interview information');
    }

    // Create a Tavus conversation with the recruiter persona
    const response = await fetch('https://api.tavus.io/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY,
      },
      body: JSON.stringify({
        replica_id: TAVUS_RECRUITER_REPLICA_ID,
        conversation_name: `Interview for ${job_title} at ${company}`,
        conversational_context: `This is an interview for the ${job_title} position at ${company}. ${
          cv_path ? 'The candidate has provided their CV.' : ''
        }`,
        properties: {
          max_call_duration: 3600, // 1 hour
          enable_recording: true,
          language: 'en',
        },
      }),
    });

    if (!response.ok) {
      // Get detailed error information
      const errorText = await response.text();
      console.error('Tavus API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      throw new Error(`Tavus API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate response data
    if (!data.conversation_id || !data.conversation_url) {
      throw new Error('Invalid response from Tavus API');
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Tavus conversation creation error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to create Tavus conversation',
        details: error.stack
      },
      { status: 500 }
    );
  }
}