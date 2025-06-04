import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verify Tavus webhook signature
    const signature = headers().get('x-tavus-signature');
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }
    
    // Extract data from webhook
    const { conversation_id, recording_url } = body;
    
    // Store recording URL
    const { data: interview, error: fetchError } = await supabase
      .from('interviews')
      .select('id')
      .eq('tavus_conversation_id', conversation_id)
      .single();
      
    if (fetchError) throw fetchError;
    
    const { error: insertError } = await supabase
      .from('video_recordings')
      .insert({
        interview_id: interview.id,
        recording_url: recording_url
      });
      
    if (insertError) throw insertError;
    
    // Start video analysis with Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Analyze this interview recording and provide scores for: verbal communication, non-verbal communication, content quality, and question understanding. Also list strengths and areas for improvement."
          }, {
            fileData: {
              fileUri: recording_url,
              mimeType: "video/mp4"
            }
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze video');
    }

    const analysisResult = await response.json();
    
    // Update recording with analysis
    const { error: updateError } = await supabase
      .from('video_recordings')
      .update({
        analysis_status: 'completed',
        analysis_result: analysisResult
      })
      .eq('interview_id', interview.id);
      
    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing recording:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}