"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Interview {
  id: string;
  created_at: string;
  job_title: string;
  company: string;
  score: number;
  status: "completed" | "in_progress";
}

export function InterviewList() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase
          .from('interviews')
          .select('id, created_at, job_title, company, score, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (error) throw error;
        
        setInterviews(data || []);
      } catch (error: any) {
        console.error("Error fetching interviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInterviews();
  }, []);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-md">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    );
  }
  
  if (interviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No interviews yet. Start practicing!</p>
        <Link href="/interview/new" className="text-primary hover:underline mt-2 block">
          Create your first interview
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {interviews.map((interview) => (
        <Link
          key={interview.id}
          href={`/interview/${interview.id}/${interview.status === "completed" ? "feedback" : "room"}`}
          className="block"
        >
          <div className="flex items-center justify-between p-4 border rounded-md hover:bg-muted/50 transition-colors">
            <div>
              <h4 className="font-medium">{interview.job_title}</h4>
              <p className="text-sm text-muted-foreground">
                {interview.company} • {formatDistanceToNow(new Date(interview.created_at), { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {interview.status === "completed" ? (
                <Badge 
                  variant="outline" 
                  className={
                    interview.score >= 80 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                    interview.score >= 60 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" :
                    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }
                >
                  {interview.score}%
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  In Progress
                </Badge>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}