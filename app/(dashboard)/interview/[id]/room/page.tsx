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
  useCallObject,
} from '@daily-co/daily-react';
import type { DailyCall } from "@daily-co/daily-react";

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

  // Timer for elapsed time
  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Only start a new timer if we're in a meeting
    if (meetingState === 'joined-meeting') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [meetingState]);

  const startInterview = useCallback(async () => {
    if (isStarting || !callObject) return;
    setIsStarting(true);
    
    try {
      // Create the Tavus conversation
      const response = await fetch('/api/tavus/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interview_id: id,
          job_title: interview?.job_title,
          company: interview?.company,
          cv_path: interview?.cv_path,
          language: interview?.language,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Join with Daily
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
  }, [callObject, id, interview, isStarting]);

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
              {/* Audio for all remote participants */}
              <DailyAudio />
              
              {/* Videos of remote participants */}
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
              
              {/* Local video (participant) */}
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
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleCamera}
                  disabled={!callObject}
                >
                  {localParticipant?.video ? 
                    <Camera className="h-4 w-4" /> : 
                    <CameraOff className="h-4 w-4" />
                  }
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMic}
                  disabled={!callObject}
                >
                  {localParticipant?.audio ? 
                    <Mic className="h-4 w-4" /> : 
                    <MicOff className="h-4 w-4" />
                  }
                </Button>
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
                  <Button variant="outline" size="sm">1 min</Button>
                  <Button variant="outline" size="sm">5 min</Button>
                  <Button variant="outline" size="sm">10 min</Button>
                  <Button variant="outline" size="sm">15 min</Button>
                  <Button variant="outline" size="sm">30 min</Button>
                  <Button variant="outline" size="sm">45 min</Button>
                </div>
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

// Wrapper component with DailyProvider
export default function InterviewRoomPage() {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);
  
  useEffect(() => {
    // Create the call object only once using the useCallObject hook
    const co = useCallObject();
    setCallObject(co);
    
    // Clean up function
    return () => {
      co?.destroy().catch(console.error);
    };
  }, []);
  
  if (!callObject) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <DailyProvider callObject={callObject}>
      <InterviewRoom />
    </DailyProvider>
  );
}