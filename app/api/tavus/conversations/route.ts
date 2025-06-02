import { NextResponse } from 'next/server';

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const TAVUS_RECRUITER_REPLICA_ID = process.env.TAVUS_RECRUITER_REPLICA_ID;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { interview_id, job_title, company, cv_path } = body;

    // Create a Tavus conversation with the recruiter persona
    const response = await fetch('https://api.tavus.io/v2/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': TAVUS_API_KEY!,
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
      throw new Error('Failed to create Tavus conversation');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}