"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  BarChart, 
  Briefcase, 
  Clock, 
  Trophy, 
  BookOpen, 
  PlusCircle, 
  Calendar,
  Target,
  Award,
  TrendingUp,
  Users,
  Share2
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { InterviewList } from "@/components/dashboard/interview-list";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  interviews_completed: number;
  average_score: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  progress: number;
  total: number;
  unlocked: boolean;
}

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: Date;
}

const BADGES = {
  BEGINNER: { color: "bg-bronze-500", label: "Bronze" },
  INTERMEDIATE: { color: "bg-silver-500", label: "Silver" },
  EXPERT: { color: "bg-gold-500", label: "Gold" },
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please sign in to view your dashboard");
          router.push('/login');
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('id, name, email, interviews_completed, average_score')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        if (!data) throw new Error("Profile not found");
        
        setProfile(data);

        // Fetch progress data
        const { data: interviews } = await supabase
          .from('interviews')
          .select('created_at, score')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (interviews) {
          const formattedData = interviews.map(interview => ({
            date: format(new Date(interview.created_at), 'MMM dd'),
            score: interview.score
          }));
          setProgressData(formattedData);
        }

        // Set achievements
        setAchievements([
          {
            id: '1',
            title: 'First Interview',
            description: 'Complete your first practice interview',
            icon: Briefcase,
            progress: data.interviews_completed,
            total: 1,
            unlocked: data.interviews_completed >= 1
          },
          {
            id: '2',
            title: 'Perfect Score',
            description: 'Achieve a 100% score in an interview',
            icon: Trophy,
            progress: Math.max(...(interviews?.map(i => i.score) || [0])),
            total: 100,
            unlocked: Math.max(...(interviews?.map(i => i.score) || [0])) === 100
          },
          {
            id: '3',
            title: 'Interview Master',
            description: 'Complete 10 interviews',
            icon: Award,
            progress: data.interviews_completed,
            total: 10,
            unlocked: data.interviews_completed >= 10
          }
        ]);

        // Set goals
        setGoals([
          {
            id: '1',
            title: 'Complete 5 Technical Interviews',
            target: 5,
            current: 3,
            deadline: new Date('2024-12-31')
          },
          {
            id: '2',
            title: 'Achieve 90%+ Score',
            target: 90,
            current: data.average_score,
            deadline: new Date('2024-12-31')
          }
        ]);

        // Fetch leaderboard data
        const { data: leaderboardData } = await supabase
          .from('profiles')
          .select('name, interviews_completed, average_score')
          .order('average_score', { ascending: false })
          .limit(5);

        if (leaderboardData) {
          setLeaderboard(leaderboardData);
        }

      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const shareProgress = async () => {
    try {
      await navigator.share({
        title: 'My Interview Progress',
        text: `I've completed ${profile?.interviews_completed} interviews with an average score of ${profile?.average_score}%!`,
        url: window.location.href
      });
    } catch (error) {
      toast.error("Failed to share progress");
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative space-y-8">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Track your interview progress and performance
          </p>
        </motion.div>
        <motion.div 
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button variant="outline" onClick={shareProgress}>
            <Share2 className="mr-2 h-4 w-4" /> Share Progress
          </Button>
          <Link href="/interview/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> New Interview
            </Button>
          </Link>
        </motion.div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Interviews",
            value: profile?.interviews_completed || 0,
            change: `+${Math.floor(Math.random() * 5)} this week`,
            icon: Briefcase,
            color: "from-blue-500 to-cyan-500",
            glow: "rgba(59, 130, 246, 0.5)"
          },
          {
            title: "Average Score",
            value: `${profile?.average_score || 0}%`,
            progress: profile?.average_score || 0,
            icon: Trophy,
            color: "from-purple-500 to-pink-500",
            glow: "rgba(168, 85, 247, 0.5)"
          },
          {
            title: "Current Rank",
            value: profile?.average_score >= 80 ? '#12' : '#24',
            subtitle: `Top ${profile?.average_score >= 80 ? '5%' : '10%'} of users`,
            icon: Award,
            color: "from-orange-500 to-amber-500",
            glow: "rgba(251, 146, 60, 0.5)"
          },
          {
            title: "Next Goal",
            value: "90%",
            subtitle: `${Math.round(90 - (profile?.average_score || 0))}% to reach target`,
            icon: Target,
            color: "from-emerald-500 to-teal-500",
            glow: "rgba(52, 211, 153, 0.5)"
          }
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative"
          >
            {/* Card glow effect */}
            <motion.div
              className="absolute -inset-2 rounded-xl opacity-0"
              style={{
                background: `radial-gradient(circle at center, ${card.glow} 0%, transparent 60%)`,
                filter: "blur(20px)",
              }}
              animate={{
                opacity: hoveredIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
            
            <Card className="relative transition-all duration-300 hover:border-border/80 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <motion.div
                className={`p-2 rounded-lg bg-gradient-to-br ${card.color} opacity-10`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <card.icon className="h-4 w-4 text-foreground" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.value}
              </div>
              {card.change && (
                <div className="text-xs text-muted-foreground mt-1">
                  {card.change}
                </div>
              )}
              {card.progress && (
                <div className="mt-2">
                  <Progress value={card.progress} />
                </div>
              )}
              {card.subtitle && (
                <div className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </div>
              )}
            </CardContent>
          </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="h-full transition-all duration-300 hover:border-border/80 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>
              Your interview performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="score" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#score)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="h-full transition-all duration-300 hover:border-border/80 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>
              Your earned badges and milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border ${
                      achievement.unlocked ? 'bg-primary/5' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${
                        achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
                      }`}>
                        <achievement.icon className={`h-4 w-4 ${
                          achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{achievement.title}</p>
                          {achievement.unlocked && (
                            <Badge variant="secondary">Unlocked</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {achievement.description}
                        </p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span>{achievement.progress}/{achievement.total}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.total) * 100} 
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="h-full transition-all duration-300 hover:border-border/80 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Interviews</CardTitle>
            <CardDescription>
              Your recent practice interviews and their scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InterviewList />
          </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          className="col-span-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="h-full transition-all duration-300 hover:border-border/80 hover:shadow-lg">
          <CardHeader>
            <CardTitle>Monthly Leaderboard</CardTitle>
            <CardDescription>
              Top performers this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6">
                      {index === 0 ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <span className="text-muted-foreground font-medium">
                          #{index + 1}
                        </span>
                      )}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.interviews_completed} interviews
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {user.average_score}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}