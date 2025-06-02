import { NextResponse } from 'next/server';

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;
const TAVUS_RECRUITER_REPLICA_ID = process.env.TAVUS_RECRUITER_REPLICA_ID;

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, options: RequestInit, retryCount = 0): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If we get a 522 or other 5xx error, retry
    if (response.status >= 500 && retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retryCount + 1);
    }

    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}

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
    const response = await fetchWithRetry(
      'https://api.tavus.io/v2/conversations',
      {
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
      }
    );

    if (!response.ok) {
      // Get detailed error information
      const errorText = await response.text();
      console.error('Tavus API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      // Return a more specific error message based on the status code
      const errorMessage = response.status === 522 
        ? 'Tavus API is currently unavailable. Please try again in a few minutes.'
        : `Tavus API error: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Validate response data
    if (!data.conversation_id || !data.conversation_url) {
      throw new Error('Invalid response from Tavus API');
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Tavus conversation creation error:', error);
    
    // Provide a user-friendly error message
    const errorMessage = error.message === 'Request timeout'
      ? 'Connection to Tavus timed out. Please try again.'
      : error.message || 'Failed to create Tavus conversation';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.message.includes('timeout') ? 504 : 500 }
    );
  }
}