"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { 
  Camera, 
  CameraOff, 
  Loader2, 
  Mic, 
  MicOff, 
  User 
} from "lucide-react";
import DailyIframe from '@daily-co/daily-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface TavusConversation {
  conversation_id: string;
  conversation_url: string;
}

const getOrCreateCallObject = () => {
  if (typeof window === 'undefined') return null;
  if (!window._dailyCallObject) {
    window._dailyCallObject = DailyIframe.createCallObject({
      audioSource: true,
      videoSource: true,
      dailyConfig: {
        experimentalChromeVideoOptimization: true,
      },
    });
  }
  return window._dailyCallObject;
};

export default function InterviewRoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [interviewProgress, setInterviewProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const [tavusConversation, setTavusConversation] = useState<TavusConversation | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  const [remoteParticipants, setRemoteParticipants] = useState<Record<string, any>>({});
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const callRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();

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
        console.log("Interview data loaded:", data);
      } catch (error: any) {
        console.error("Failed to load interview:", error);
        toast.error(error.message || "Failed to load interview");
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterview();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (callRef.current) {
        callRef.current.leave();
      }
    };
  }, [id, router]);

  const setupCamera = async () => {
    try {
      console.log("Setting up camera...");
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: true
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play();
      }
      
      setIsCameraReady(true);
      setIsCameraEnabled(true);
      setIsMicEnabled(true);
      console.log("Camera setup successful");
      toast.success("Camera and microphone are ready");
    } catch (error: any) {
      console.error("Camera setup error:", error);
      toast.error("Failed to access camera and microphone. Please ensure you've granted permission.");
    }
  };

  const toggleCamera = () => {
    if (!isCameraReady || !streamRef.current) return;
    
    streamRef.current.getVideoTracks().forEach(track => {
      track.enabled = !isCameraEnabled;
    });
    
    setIsCameraEnabled(!isCameraEnabled);
  };

  const toggleMic = () => {
    if (!isCameraReady || !streamRef.current) return;
    
    streamRef.current.getAudioTracks().forEach(track => {
      track.enabled = !isMicEnabled;
    });
    
    setIsMicEnabled(!isMicEnabled);
  };

  const startInterview = async () => {
    if (!isCameraReady) {
      toast.error("Please enable your camera and microphone first");
      return;
    }

    if (isStarting) return;

    setIsStarting(true);
    console.log("Starting interview...");

    try {
      const response = await fetch('/api/tavus/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interview_id: id,
          job_title: interview?.job_title,
          company: interview?.company,
          cv_path: interview?.cv_path,
          language: interview?.language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Tavus conversation');
      }

      console.log("Tavus conversation created:", data);
      setTavusConversation(data);

      // Initialize Daily call
      const call = getOrCreateCallObject();
      if (!call) throw new Error("Failed to initialize video call");
      
      callRef.current = call;

      // Handle remote participants
      const updateRemoteParticipants = () => {
        const participants = call.participants();
        const remotes = {};
        Object.entries(participants).forEach(([id, p]) => {
          if (id !== 'local') remotes[id] = p;
        });
        setRemoteParticipants(remotes);
      };

      call.on('participant-joined', updateRemoteParticipants);
      call.on('participant-updated', updateRemoteParticipants);
      call.on('participant-left', updateRemoteParticipants);

      // Join the call
      await call.join({ url: data.conversation_url });

      // Enable noise cancellation
      await call.updateInputSettings({
        audio: {
          processor: {
            type: 'noise-cancellation',
          },
        },
      });
      
      setIsInterviewStarted(true);
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      setInterval(async () => {
        await saveInterviewProgress();
      }, 5 * 60 * 1000);

      toast.success("Interview started successfully!");
    } catch (error: any) {
      console.error("Failed to start interview:", error);
      toast.error(error.message);
    } finally {
      setIsStarting(false);
    }
  };

  const saveInterviewProgress = async () => {
    try {
      console.log("Saving interview progress...");
      const { error } = await supabase
        .from('interviews')
        .update({
          status: 'in_progress',
          last_saved_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      console.log("Progress saved successfully");
    } catch (error: any) {
      console.error('Failed to save progress:', error);
    }
  };

  const finishInterview = async () => {
    setIsFinishing(true);
    
    try {
      console.log("Finishing interview...");
      
      if (tavusConversation) {
        await fetch(`/api/tavus/conversations/${tavusConversation.conversation_id}/end`, {
          method: 'POST',
        });
      }

      // Delete any existing feedback
      const { error: deleteError } = await supabase
        .from('feedback')
        .delete()
        .eq('interview_id', id);

      if (deleteError) throw deleteError;

      // Reset interview status
      const { error: updateError } = await supabase
        .from('interviews')
        .update({
          status: 'in_progress',
          score: 0,
          completed_at: null
        })
        .eq('id', id);
        
      if (updateError) throw updateError;
      
      console.log("Interview reset successfully");
      toast.success("Interview cancelled. You can try again when ready.");
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      if (callRef.current) {
        callRef.current.leave();
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error("Failed to reset interview:", error);
      toast.error(error.message || "Failed to reset interview");
    } finally {
      setIsFinishing(false);
    }
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
              {/* Remote Participants */}
              {isInterviewStarted && Object.entries(remoteParticipants).map(([id, participant]) => (
                <div key={id} className="absolute inset-0">
                  <video
                    id={`remote-video-${id}`}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <audio id={`remote-audio-${id}`} autoPlay playsInline />
                </div>
              ))}
              
              {/* User's Camera */}
              <div className="absolute bottom-4 right-4 w-48 aspect-video bg-black rounded-lg overflow-hidden">
                {!isCameraReady ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-4">
                    <User className="h-8 w-8" />
                    <Button onClick={setupCamera} size="sm">
                      Enable Camera
                    </Button>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className={`w-full h-full object-cover ${!isCameraEnabled ? 'hidden' : ''}`}
                    />
                    {!isCameraEnabled && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleCamera}
                  disabled={!isCameraReady}
                >
                  {isCameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMic}
                  disabled={!isCameraReady}
                >
                  {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                {isInterviewStarted && (
                  <span className="text-sm font-medium ml-2">
                    {formatTime(elapsedTime)}
                  </span>
                )}
              </div>
              
              {!isInterviewStarted ? (
                <Button 
                  onClick={startInterview} 
                  disabled={!isCameraReady || isStarting}
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
                      Cancelling...
                    </>
                  ) : (
                    "Cancel Interview"
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
                <h4 className="text-sm font-medium text-muted-foreground">Interview Type</h4>
                <p className="capitalize">{interview?.interview_type?.replace("_", " ")}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Language</h4>
                <p>{interview?.language}</p>
              </div>
              
              {isInterviewStarted && (
                <>
                  <div className="border-t my-4" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">Auto-save</h4>
                      <span className="text-sm text-muted-foreground">Every 5 minutes</span>
                    </div>
                    <Progress value={interviewProgress} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
              <CardDescription>
                Remember these points during your interview
              </CardDescription>
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
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <span className="block h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span>Take a moment to think before answering</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}