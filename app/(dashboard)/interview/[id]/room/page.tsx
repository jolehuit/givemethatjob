"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Camera, CameraOff, Loader2, Mic, MicOff } from "lucide-react";
import {
  DailyProvider,
  useLocalParticipant,
  useParticipantIds,
  useMeetingState,
  DailyAudio,
  DailyVideo,
  useDevices,
  useDaily,
} from '@daily-co/daily-react';

interface InterviewData {
  id: string;
  job_title: string;
  company: string;
  interview_type: string;
  cv_path: string | null;
  language: string;
  status: string;
}

// Main component that uses Daily hooks
function InterviewRoom() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  
  // Daily React hooks
  const callObject = useDaily();
  const localParticipant = useLocalParticipant();
  const participantIds = useParticipantIds();
  const meetingState = useMeetingState();
  const { microphones, cameras } = useDevices();

  // Refs to prevent memory leaks
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const { data, error } = await supabase
          .from('interviews')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setInterview(data);
      } catch (error: any) {
        console.error("Failed to load interview:", error);
        toast.error(error.message || "Failed to load interview");
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterview();
  }, [id, router]);
  
  // Set initial duration from interview data
  useEffect(() => {
    if (interview?.duration_minutes) {
      setSelectedDuration(interview.duration_minutes);
    }
  }, [interview]);

  const startInterview = useCallback(async () => {
    if (isStarting || !callObject) return;
    setIsStarting(true);
    
    try {
      const { data: updateData, error: updateError } = await supabase
        .from('interviews')
        .update({ duration_minutes: selectedDuration })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      const response = await fetch('/api/tavus/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interview_id: id,
          job_title: interview?.job_title,
          company: interview?.company,
          cv_path: interview?.cv_path,
          duration_minutes: selectedDuration,
          language: interview?.language,
          properties: {
            enable_recording: true,
            recording_s3_bucket_name: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
            recording_s3_bucket_region: process.env.NEXT_PUBLIC_AWS_REGION,
            callback_url: `${window.location.origin}/api/tavus/recordings`
          }
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Store Tavus conversation ID
      await supabase
        .from('interviews')
        .update({ tavus_conversation_id: data.conversation_id })
        .eq('id', id);

      // Join the call
      await callObject.join({ 
        url: data.conversation_url,
        userName: 'Candidate'
      });

      toast.success("Interview started successfully!");
    } catch (error: any) {
      console.error("Failed to start interview:", error);
      toast.error(error.message || "Failed to start interview");
    } finally {
      setIsStarting(false);
    }
  }, [callObject, id, interview, isStarting, selectedDuration]);

  const finishInterview = useCallback(async () => {
    if (!callObject) return;
    setIsFinishing(true);
    try {
      await callObject.leave();
      router.push('/dashboard');
      toast.success("Interview ended successfully");
    } catch (error: any) {
      console.error("Failed to end interview:", error);
      toast.error("Failed to end interview");
    } finally {
      setIsFinishing(false);
    }
  }, [callObject, router]);

  // Timer and auto-end logic
  useEffect(() => {
    if (meetingState !== 'joined-meeting') {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        // Check duration limit
        if (selectedDuration && newTime >= selectedDuration * 60) {
          finishInterview();
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [meetingState, selectedDuration, finishInterview]);

  const toggleCamera = useCallback(() => {
    if (!callObject) return;
    callObject.setLocalVideo(!localParticipant?.video);
  }, [callObject, localParticipant?.video]);

  const toggleMic = useCallback(() => {
    if (!callObject) return;
    callObject.setLocalAudio(!localParticipant?.audio);
  }, [callObject, localParticipant?.audio]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Interview Room</h2>
        <p className="text-muted-foreground">
          {interview?.job_title} at {interview?.company}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-4">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-black rounded-t-lg relative">
              <DailyAudio />
              
              {participantIds
                .filter(id => id !== localParticipant?.session_id)
                .map(participantId => (
                  <DailyVideo
                    key={participantId}
                    sessionId={participantId}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ))}
              
              {localParticipant && (
                <div className="absolute bottom-4 right-4 w-48 aspect-video bg-black rounded-lg overflow-hidden">
                  <DailyVideo
                    sessionId={localParticipant.session_id}
                    automirror
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div>
                {meetingState === 'joined-meeting' && (
                  <span className="text-sm font-medium ml-2">
                    {formatTime(elapsedTime)}
                  </span>
                )}
              </div>
              
              {meetingState !== 'joined-meeting' ? (
                <Button 
                  onClick={startInterview} 
                  disabled={isStarting}
                >
                  {isStarting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={finishInterview} 
                  disabled={isFinishing}
                  variant="destructive"
                >
                  {isFinishing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ending...
                    </>
                  ) : (
                    "End Interview"
                  )}
                </Button>
              )}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Position</h4>
                <p>{interview?.job_title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Company</h4>
                <p>{interview?.company}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                <p className="capitalize">{interview?.interview_type?.replace("_", " ")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Language</h4>
                <p>{interview?.language}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <p className="capitalize">{meetingState?.replace("-", " ")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Duration</h4>
                <div className="flex gap-2 mt-1">
                  {[1, 5, 10, 15, 30, 45].map((duration) => (
                    <Button
                      key={duration}
                      variant={selectedDuration === duration ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setSelectedDuration(duration)}
                      disabled={meetingState === 'joined-meeting'}
                    >
                      {duration} min
                    </Button>
                  ))}
                </div>
                {selectedDuration && meetingState === 'joined-meeting' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Interview will end automatically after {selectedDuration} minutes
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Tips</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <span className="block h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Maintain eye contact with the camera</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <span className="block h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Speak clearly and at a moderate pace</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <span className="block h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Use the STAR method for behavioral questions</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Wrapper component with DailyProvider - simplified
export default function InterviewRoomPage() {
  return (
    <DailyProvider>
      <InterviewRoom />
    </DailyProvider>
  );
}