"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import brainAnimation from "@/public/lottie-animations/brain.json";
import sparklesAnimation from "@/public/lottie-animations/sparkles.json";
import robotAnimation from "@/public/lottie-animations/robot.json";
import coolAnimation from "@/public/lottie-animations/cool.json";

export function Hero() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showParticles, setShowParticles] = useState(false);

  const steps = [
    {
      text: "Paste a job offer.",
      animation: brainAnimation,
      color: "from-blue-400 via-cyan-400 to-blue-600",
      shadow: "shadow-blue-500/25"
    },
    {
      text: "Upload your resume.",
      animation: sparklesAnimation,
      color: "from-purple-400 via-pink-400 to-purple-600",
      shadow: "shadow-purple-500/25"
    },
    {
      text: "Face our AI recruiter.",
      animation: robotAnimation,
      color: "from-orange-400 via-red-400 to-orange-600",
      shadow: "shadow-orange-500/25"
    },
    {
      text: "Get the call.",
      animation: coolAnimation,
      color: "from-emerald-400 via-green-400 to-emerald-600",
      shadow: "shadow-emerald-500/25"
    }
  ];

  useEffect(() => {
    const animateStep = async () => {
      while (true) {
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(i);
          setTypedText("");
          setIsTyping(true);

          // Type out text
          for (let j = 0; j <= steps[i].text.length; j++) {
            setTypedText(steps[i].text.slice(0, j));
            await new Promise(resolve => setTimeout(resolve, 50));
          }

          setIsTyping(false);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    };

    animateStep();
    setShowParticles(true);
  }, []);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background grids */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--foreground)/0.03),transparent)] bg-[size:50px_50px]" />
        <motion.div 
          className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(var(--foreground)/0.01),transparent)] bg-[size:100px_100%]"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Enhanced floating particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                i % 3 === 0 
                  ? "w-1 h-1 bg-foreground/20" 
                  : i % 3 === 1 
                  ? "w-0.5 h-0.5 bg-primary/30"
                  : "w-1.5 h-1.5 bg-muted-foreground/15"
              }`}
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: 0,
                opacity: 0
              }}
              animate={{
                y: [null, "-120%"],
                scale: [0, 1, 0.5, 0],
                opacity: [0, 1, 0.8, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Ambient light orbs */}
      <div className="absolute inset-0">
        <motion.div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r ${steps[currentStep].color} opacity-5 blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-l ${steps[currentStep].color} opacity-5 blur-3xl`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.05, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center space-y-12">
          {/* Main heading with step animation */}
          <div className="relative h-[180px] sm:h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ 
                  opacity: 0, 
                  y: 30, 
                  scale: 0.8,
                  rotateX: -15
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  rotateX: 0
                }}
                exit={{ 
                  opacity: 0, 
                  y: -30, 
                  scale: 0.8,
                  rotateX: 15
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="absolute"
              >
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    className={`relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 ${steps[currentStep].shadow} shadow-2xl rounded-2xl`}
                    animate={{
                      scale: [1, 1.05, 1],
                      rotateY: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${steps[currentStep].color} rounded-2xl opacity-10 blur-sm`} />
                    <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-4 border border-border/50 shadow-lg">
                      <Lottie
                        animationData={steps[currentStep].animation}
                        loop={true}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  </motion.div>
                  
                  <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                    <span className="relative inline-block">
                      <span className={`bg-gradient-to-r ${steps[currentStep].color} bg-clip-text text-transparent drop-shadow-sm`}>
                        {typedText}
                      </span>
                      {isTyping && (
                        <motion.span
                          className={`absolute -right-2 top-0 w-[3px] h-full bg-gradient-to-b ${steps[currentStep].color} rounded-full`}
                          animate={{ 
                            opacity: [1, 0],
                            scaleY: [1, 0.8, 1]
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </span>
                  </h1>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Enhanced CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="relative group"
          >
            <Link href="/register">
              <Button
                size="lg"
                className="relative px-10 py-7 text-xl font-bold rounded-2xl overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-2xl hover:shadow-primary/20 hover:scale-105 border border-primary/20"
              >
                {/* Animated background shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent skew-x-12"
                  animate={{
                    x: ["-200%", "200%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Ripple effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  whileHover={{
                    boxShadow: [
                      "0 0 0 0 rgba(var(--primary), 0.4)",
                      "0 0 0 20px rgba(var(--primary), 0)",
                    ],
                  }}
                  transition={{ duration: 0.6 }}
                />
                
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Journey
                  <motion.span
                    animate={{
                      x: [0, 4, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Subtle subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed"
          >
            Transform your career with AI-powered interview preparation
          </motion.p>
        </div>
      </div>
    </div>
  );
}