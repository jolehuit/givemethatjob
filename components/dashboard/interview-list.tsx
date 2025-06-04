"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, 
  Clock, 
  TrendingUp, 
  Award,
  ArrowRight,
  Sparkles
} from "lucide-react";

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
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-500";
    if (score >= 60) return "from-amber-500 to-yellow-500";
    return "from-red-500 to-rose-500";
  };

  const getScoreGlow = (score: number) => {
    if (score >= 80) return "rgba(52, 211, 153, 0.4)";
    if (score >= 60) return "rgba(251, 191, 36, 0.4)";
    return "rgba(239, 68, 68, 0.4)";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return Award;
    if (score >= 60) return TrendingUp;
    return BarChart3;
  };
  
  if (isLoading) {
    return (
      <div className="space-items">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="card-dashboard">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
  
  if (interviews.length === 0) {
    return (
      <motion.div
        className="card-dashboard text-center py-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-3">
            <Sparkles className="icon-md text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">Aucun entretien pour le moment</p>
          <Link href="/interview/new">
            <motion.button
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Créer votre premier entretien
              <ArrowRight className="icon-sm" />
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <div className="space-items">
      <AnimatePresence>
        {interviews.map((interview) => {
          const ScoreIcon = getScoreIcon(interview.score);
          
          return (
            <motion.div
              key={interview.id}
              onMouseEnter={() => setHoveredId(interview.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative"
            >
              <Link
                href={`/interview/${interview.id}/${interview.status === "completed" ? "feedback" : "room"}`}
                className="block"
              >
                <motion.div
                  className="card-dashboard group"
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Fixed icon visibility */}
                      <div className={`p-2 rounded-md bg-gradient-to-br ${
                        interview.status === "completed"
                          ? getScoreColor(interview.score)
                          : "from-blue-500 to-cyan-500"
                      } relative`}>
                        {interview.status === "completed" ? (
                          <ScoreIcon className="icon-sm text-white" />
                        ) : (
                          <Clock className="icon-sm text-white" />
                        )}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm flex items-center gap-2 truncate">
                          {interview.job_title}
                          {hoveredId === interview.id && (
                            <motion.span
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-primary"
                            >
                              <ArrowRight className="icon-sm" />
                            </motion.span>
                          )}
                        </h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <span className="truncate">{interview.company}</span>
                          <span>•</span>
                          <span>
                            {formatDistanceToNow(new Date(interview.created_at), { addSuffix: true })}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {interview.status === "completed" ? (
                        <Badge
                          variant="outline"
                          className={`px-2 py-1 text-xs bg-gradient-to-r ${getScoreColor(interview.score)} text-white border-0`}
                        >
                          {interview.score}%
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="px-2 py-1 text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
                        >
                          <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
                            En cours
                          </div>
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}