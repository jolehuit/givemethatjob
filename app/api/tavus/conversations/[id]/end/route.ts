import { NextResponse } from 'next/server';

const TAVUS_API_KEY = process.env.TAVUS_API_KEY;

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

async function fetchWithRetry(url: string, options: RequestInit, retryCount = 0): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

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

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!TAVUS_API_KEY) {
      throw new Error('Missing Tavus API key');
    }

    const response = await fetchWithRetry(
      `https://api.tavus.io/v2/conversations/${params.id}/end`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': TAVUS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tavus API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      // Return a more specific error message based on the status code
      const errorMessage = response.status === 522 
        ? 'Tavus API is currently unavailable. Please try again in a few minutes.'
        : `Failed to end Tavus conversation: ${response.status} ${response.statusText}`;

      throw new Error(errorMessage);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error ending Tavus conversation:', error);

    // Provide a user-friendly error message
    const errorMessage = error.message === 'Request timeout'
      ? 'Connection to Tavus timed out. Please try again.'
      : error.message || 'Failed to end Tavus conversation';
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.message.includes('timeout') ? 504 : 500 }
    );
  }
}