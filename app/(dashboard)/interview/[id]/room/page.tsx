"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Camera, CameraOff, Loader2, Mic, MicOff } from "lucide-react";
import { 
  DailyProvider, 
  useCallObject, 
  useLocalParticipant,
  useParticipantIds,
  useMeetingState,
  DailyAudio,
  DailyVideo,
  useDevices
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

// Composant principal qui utilise les hooks Daily
function InterviewRoom() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Hooks Daily React
  const callObject = useCallObject();
  const localParticipant = useLocalParticipant();
  const participantIds = useParticipantIds();
  const meetingState = useMeetingState();
  const { microphones, cameras } = useDevices();

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

  // Timer pour le temps écoulé
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (meetingState === 'joined-meeting') {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [meetingState]);

  const startInterview = async () => {
    if (isStarting) return;
    setIsStarting(true);

    try {
      // Créer la conversation Tavus
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

      // Rejoindre avec Daily
      await callObject?.join({ 
        url: data.conversation_url,
        userName: 'Candidate'
      });

      toast.success("Interview started successfully!");
    } catch (error: any) {
      console.error("Failed to start interview:", error);
      toast.error(error.message);
    } finally {
      setIsStarting(false);
    }
  };

  const finishInterview = async () => {
    setIsFinishing(true);
    try {
      await callObject?.leave();
      router.push('/dashboard');
      toast.success("Interview ended successfully");
    } catch (error: any) {
      console.error("Failed to end interview:", error);
      toast.error("Failed to end interview");
    } finally {
      setIsFinishing(false);
    }
  };

  const toggleCamera = () => {
    callObject?.setLocalVideo(!localParticipant?.video);
  };

  const toggleMic = () => {
    callObject?.setLocalAudio(!localParticipant?.audio);
  };

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
              {/* Audio pour tous les participants distants */}
              <DailyAudio />
              
              {/* Vidéos des participants distants */}
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
              
              {/* Vidéo locale (participant) */}
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
            <CardHeader>
              <CardTitle>Interview Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
              <CardDescription>Remember these points during your interview</CardDescription>
            </CardHeader>
            <CardContent>
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

// Composant wrapper avec DailyProvider
export default function InterviewRoomPage() {
  const callObject = useCallObject();

  return (
    <DailyProvider callObject={callObject}>
      <InterviewRoom />
    </DailyProvider>
  );
}