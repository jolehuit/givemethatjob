"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  BarChart3, 
  CheckCircle2, 
  Download, 
  Frown, 
  Loader2, 
  Meh, 
  Share2, 
  SmilePlus,
  MessageSquare,
  Brain,
  UserCheck,
  Star
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

interface FeedbackData {
  id: string;
  interview_id: string;
  overall_score: number;
  strengths: string[];
  weaknesses: string[];
  verbal_communication: number;
  non_verbal_communication: number;
  content_quality: number;
  question_understanding: number;
  improvement_suggestions: string;
}

interface InterviewData {
  id: string;
  job_title: string;
  company: string;
  interview_type: string;
  score: number;
}

export default function FeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  const [interview, setInterview] = useState<InterviewData | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [averageScore, setAverageScore] = useState(0);
  
  useEffect(() => {
    const fetchInterviewAndFeedback = async () => {
      try {
        // Get interview data
        const { data: interviewData, error: interviewError } = await supabase
          .from('interviews')
          .select('*')
          .eq('id', id)
          .single();
          
        if (interviewError) throw interviewError;
        setInterview(interviewData);
        
        // Get feedback data
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('feedback')
          .select('*')
          .eq('interview_id', id)
          .single();
          
        if (feedbackError) throw feedbackError;
        setFeedback(feedbackData);

        // Get average score from all completed interviews
        const { data: avgData, error: avgError } = await supabase
          .from('interviews')
          .select('score')
          .eq('status', 'completed');

        if (avgError) throw avgError;
        const avg = avgData.reduce((acc, curr) => acc + curr.score, 0) / avgData.length;
        setAverageScore(avg);
      } catch (error: any) {
        toast.error(error.message || "Failed to load feedback");
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterviewAndFeedback();
  }, [id, router]);
  
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <SmilePlus className="h-8 w-8 text-green-500" />;
    if (score >= 60) return <Meh className="h-8 w-8 text-yellow-500" />;
    return <Frown className="h-8 w-8 text-red-500" />;
  };
  
  const getScoreText = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Improvement";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
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
        <h2 className="text-3xl font-bold tracking-tight">Interview Feedback</h2>
        <p className="text-muted-foreground">
          {interview?.job_title} at {interview?.company}
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-2 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              Overall Score
              {getScoreIcon(interview?.score || 0)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="8"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className={`${getScoreColor(interview?.score || 0)} stroke-current`}
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="transparent"
                    r="56"
                    cx="64"
                    cy="64"
                    strokeDasharray={`${((interview?.score || 0) / 100) * 351.8584}, 351.8584`}
                    transform="rotate(-90, 64, 64)"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold">{interview?.score}%</span>
                  <span className="text-sm text-muted-foreground">
                    {getScoreText(interview?.score || 0)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span>Average Score</span>
                <span>{Math.round(averageScore)}%</span>
              </div>
              <Progress value={averageScore} />
              <p className="text-xs text-muted-foreground text-center">
                Based on all completed interviews
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Verbal Communication</span>
                  <span>{feedback?.verbal_communication}%</span>
                </div>
                <Progress value={feedback?.verbal_communication} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Non-verbal Communication</span>
                  <span>{feedback?.non_verbal_communication}%</span>
                </div>
                <Progress value={feedback?.non_verbal_communication} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Content Quality</span>
                  <span>{feedback?.content_quality}%</span>
                </div>
                <Progress value={feedback?.content_quality} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Question Understanding</span>
                  <span>{feedback?.question_understanding}%</span>
                </div>
                <Progress value={feedback?.question_understanding} className="h-2" />
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline" size="sm" className="w-full">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Download className="h-4 w-4 mr-2" /> Download
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {feedback?.verbal_communication}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Clear and effective communication
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Understanding
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {feedback?.question_understanding}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Question comprehension
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Presence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {feedback?.non_verbal_communication}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Professional demeanor
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {feedback?.content_quality}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Answer quality
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="improvements">Improvements</TabsTrigger>
              <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>
                    Overall assessment of your interview performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Your interview performance was <span className="font-medium">{getScoreText(interview?.score || 0).toLowerCase()}</span>.
                    You demonstrated strong communication skills and provided relevant examples.
                    Focus on the suggested improvements to enhance your future interviews.
                  </p>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Key Strengths</h4>
                      <ul className="space-y-2">
                        {feedback?.strengths.slice(0, 3).map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-1" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Areas to Improve</h4>
                      <ul className="space-y-2">
                        {feedback?.weaknesses.slice(0, 3).map((weakness, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <div className="h-4 w-4 rounded-full bg-yellow-500/20 flex items-center justify-center mt-1">
                              <span className="text-yellow-500 text-xs">!</span>
                            </div>
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="strengths">
              <Card>
                <CardHeader>
                  <CardTitle>Your Strengths</CardTitle>
                  <CardDescription>
                    Areas where you performed well during the interview
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {feedback?.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium">{strength}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Continue to leverage this strength in future interviews.
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="improvements">
              <Card>
                <CardHeader>
                  <CardTitle>Areas for Improvement</CardTitle>
                  <CardDescription>
                    Specific aspects to focus on for better performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <ul className="space-y-4">
                      {feedback?.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="rounded-full h-5 w-5 bg-yellow-500/20 flex items-center justify-center mt-0.5">
                            <span className="text-yellow-500 text-xs font-bold">!</span>
                          </div>
                          <div>
                            <p className="font-medium">{weakness}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Focus on improving this aspect in your next practice session.
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div>
                      <h4 className="font-medium mb-2">Improvement Suggestions</h4>
                      <p className="text-sm text-muted-foreground">
                        {feedback?.improvement_suggestions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="action-plan">
              <Card>
                <CardHeader>
                  <CardTitle>Your Action Plan</CardTitle>
                  <CardDescription>
                    Concrete steps to improve your interview performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Priority Actions</h4>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Practice STAR Method</p>
                          <p className="text-sm text-muted-foreground">
                            Structure your answers using Situation, Task, Action, and Result format.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <MessageSquare className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Record Practice Sessions</p>
                          <p className="text-sm text-muted-foreground">
                            Record yourself answering common interview questions to improve delivery.
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Research Common Questions</p>
                          <p className="text-sm text-muted-foreground">
                            Prepare and practice answers for frequently asked questions in your field.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Recommended Resources</h4>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Interview Guide</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Comprehensive guide with tips and best practices.
                          </p>
                          <Button variant="link" className="px-0 mt-2">
                            Download PDF
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Practice Questions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Collection of common interview questions with sample answers.
                          </p>
                          <Button variant="link" className="px-0 mt-2">
                            View Questions
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/interview/${id}/room`} className="flex-1">
              <Button variant="default" className="w-full">
                Retry Interview
              </Button>
            </Link>
            <Link href="/interview/new" className="flex-1">
              <Button variant="outline" className="w-full">
                Try Different Position
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}