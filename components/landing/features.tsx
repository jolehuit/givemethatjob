"use client";

import {
  BadgeCheck,
  Brain,
  FileVideo,
  BarChart3,
  Upload,
  Mic,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const features = [
  {
    name: "Personalized Interviews",
    description:
      "AI generates questions based on the specific job description and your CV for a tailored experience.",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.5)",
  },
  {
    name: "Video Interviews",
    description:
      "Practice with realistic AI avatar interviewers that respond to your answers in real-time.",
    icon: FileVideo,
    color: "from-purple-500 to-pink-500",
    glow: "rgba(168, 85, 247, 0.5)",
  },
  {
    name: "Detailed Feedback",
    description:
      "Receive comprehensive feedback on your performance, with specific tips for improvement.",
    icon: BarChart3,
    color: "from-orange-500 to-amber-500",
    glow: "rgba(251, 146, 60, 0.5)",
  },
  {
    name: "One-Click Setup",
    description:
      "Just paste a job URL and upload your CV to start practicing immediately.",
    icon: Upload,
    color: "from-emerald-500 to-teal-500",
    glow: "rgba(52, 211, 153, 0.5)",
  },
  {
    name: "Natural Voice Interaction",
    description:
      "AI interviewers use natural-sounding voices that make the experience feel real.",
    icon: Mic,
    color: "from-red-500 to-rose-500",
    glow: "rgba(239, 68, 68, 0.5)",
  },
  {
    name: "Unlimited Practice",
    description:
      "Practice as many times as you need to perfect your interview skills.",
    icon: Clock,
    color: "from-indigo-500 to-violet-500",
    glow: "rgba(99, 102, 241, 0.5)",
  },
];

export function Features() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div id="features" className="relative py-24 bg-background sm:py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            filter: "blur(100px)",
          }}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl lg:text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-base font-semibold leading-7 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 100%",
            }}
          >
            Better Preparation
          </motion.h2>
          <motion.p 
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Everything you need to ace your next interview
          </motion.p>
          <motion.p 
            className="mt-6 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Our AI-powered platform helps you prepare for interviews with realistic practice sessions, personalized feedback, and targeted improvement suggestions.
          </motion.p>
        </motion.div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2 lg:gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Card Glow Effect */}
                <motion.div
                  className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at center, ${feature.glow} 0%, transparent 60%)`,
                    filter: "blur(40px)",
                  }}
                  animate={hoveredIndex === index ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:border-border hover:shadow-lg">
                  <dt className="flex items-center gap-4">
                    <motion.div 
                      className="relative flex h-12 w-12 items-center justify-center rounded-xl overflow-hidden"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {/* Icon Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-90`} />
                      
                      {/* Icon Shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                        animate={hoveredIndex === index ? {
                          x: ["-200%", "200%"],
                        } : {}}
                        transition={{
                          duration: 1,
                          ease: "easeInOut",
                        }}
                      />
                      
                      <feature.icon className="relative h-6 w-6 text-white" aria-hidden="true" />
                    </motion.div>
                    
                    <span className="text-lg font-semibold text-foreground">
                      {feature.name}
                    </span>
                  </dt>
                  
                  <dd className="mt-4 text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </dd>
                  
                  {/* Bottom gradient line */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl`}
                    initial={{ scaleX: 0 }}
                    animate={hoveredIndex === index ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}