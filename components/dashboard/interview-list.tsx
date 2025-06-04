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
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div 
            key={i} 
            className="relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-center justify-between p-6 border rounded-xl backdrop-blur-sm bg-background/50">
              <div className="space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
  
  if (interviews.length === 0) {
    return (
      <motion.div 
        className="relative text-center py-16 px-8 border-2 border-dashed border-border/50 rounded-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 60%)",
            filter: "blur(40px)",
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10"
        >
          <motion.div
            className="inline-flex p-4 rounded-full bg-primary/10 mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>
          <p className="text-lg text-muted-foreground mb-4">No interviews yet. Start practicing!</p>
          <Link href="/interview/new">
            <motion.button
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create your first interview
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-4">
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
              {/* Background glow on hover */}
              <motion.div
                className="absolute -inset-2 rounded-2xl opacity-0"
                style={{
                  background: interview.status === "completed" 
                    ? `radial-gradient(circle at left, ${getScoreGlow(interview.score)} 0%, transparent 60%)`
                    : "radial-gradient(circle at left, rgba(59, 130, 246, 0.3) 0%, transparent 60%)",
                  filter: "blur(20px)",
                }}
                animate={{
                  opacity: hoveredId === interview.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              
              <Link
                href={`/interview/${interview.id}/${interview.status === "completed" ? "feedback" : "room"}`}
                className="block"
              >
                <motion.div 
                  className="relative flex items-center justify-between p-4 border rounded-lg bg-background/80 backdrop-blur-sm transition-all hover:border-border/80 hover:shadow-sm"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon with gradient */}
                    <motion.div
                      className="relative mt-1"
                      animate={hoveredId === interview.id ? {
                        rotate: [0, 5, -5, 0],
                      } : {}}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${
                        interview.status === "completed" 
                          ? getScoreColor(interview.score)
                          : "from-blue-500 to-cyan-500"
                      } opacity-10`} />
                      {interview.status === "completed" ? (
                        <ScoreIcon className="absolute inset-2 h-5 w-5 text-foreground" />
                      ) : (
                        <Clock className="absolute inset-2 h-5 w-5 text-foreground animate-pulse" />
                      )}
                    </motion.div>
                    
                    <div>
                      <h4 className="font-medium text-base flex items-center gap-2">
                        {interview.job_title}
                        {hoveredId === interview.id && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-primary"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </motion.span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        <span>{interview.company}</span>
                        <span className="text-xs">•</span>
                        <span className="text-xs">
                          {formatDistanceToNow(new Date(interview.created_at), { addSuffix: true })}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {interview.status === "completed" ? (
                      <motion.div
                        className="relative"
                        animate={hoveredId === interview.id ? {
                          scale: [1, 1.1, 1],
                        } : {}}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        <Badge 
                          variant="outline" 
                          className={`relative px-4 py-1.5 font-semibold bg-gradient-to-r ${getScoreColor(interview.score)} text-white border-0`}
                          style={{
                            boxShadow: `0 4px 20px ${getScoreGlow(interview.score)}`,
                          }}
                        >
                          <motion.span
                            className="relative z-10"
                            animate={{
                              textShadow: hoveredId === interview.id 
                                ? `0 0 20px rgba(255,255,255,0.8)`
                                : `0 0 0px rgba(255,255,255,0)`,
                            }}
                          >
                            {interview.score}%
                          </motion.span>
                          
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 rounded-md"
                            animate={{
                              x: hoveredId === interview.id ? ["-200%", "200%"] : "-200%",
                            }}
                            transition={{
                              duration: 1,
                              ease: "easeInOut",
                            }}
                          />
                        </Badge>
                      </motion.div>
                    ) : (
                      <Badge 
                        variant="outline" 
                        className="relative px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 animate-pulse"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 bg-white rounded-full"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [1, 0.5, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />
                          In Progress
                        </span>
                      </Badge>
                    )}
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