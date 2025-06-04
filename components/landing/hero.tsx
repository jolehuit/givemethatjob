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
      color: "from-blue-400 via-cyan-300 to-indigo-500",
      glowColor: "rgba(59, 130, 246, 0.4)",
      lightColor: "rgb(147, 197, 253)"
    },
    {
      text: "Upload your resume.",
      animation: sparklesAnimation,
      color: "from-purple-400 via-pink-300 to-violet-500",
      glowColor: "rgba(168, 85, 247, 0.4)",
      lightColor: "rgb(196, 181, 253)"
    },
    {
      text: "Face our AI recruiter.",
      animation: robotAnimation,
      color: "from-orange-400 via-amber-300 to-red-500",
      glowColor: "rgba(251, 146, 60, 0.4)",
      lightColor: "rgb(253, 186, 116)"
    },
    {
      text: "Get the call.",
      animation: coolAnimation,
      color: "from-emerald-400 via-teal-300 to-green-500",
      glowColor: "rgba(52, 211, 153, 0.4)",
      lightColor: "rgb(110, 231, 183)"
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
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0">
        {/* Dynamic mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${steps[currentStep].color} opacity-20 blur-3xl`}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Animated grid system */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(var(--foreground)/0.02)_50%,transparent_100%)] bg-[size:60px_60px]"
            animate={{
              x: [0, 60],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(var(--foreground)/0.02)_50%,transparent_100%)] bg-[size:60px_60px]"
            animate={{
              y: [0, 60],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        {/* Spotlight effects */}
        <motion.div
          className="absolute top-0 left-1/2 w-[800px] h-[400px] -translate-x-1/2"
          style={{
            background: `radial-gradient(ellipse at center, ${steps[currentStep].glowColor} 0%, transparent 70%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Premium Floating Elements */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Ethereal orbs */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute w-4 h-4 rounded-full opacity-40"
              style={{
                background: `radial-gradient(circle, ${steps[currentStep].lightColor}, transparent)`,
                boxShadow: `0 0 20px ${steps[currentStep].glowColor}`,
              }}
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}

          {/* Micro particles */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-foreground/20 rounded-full"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                scale: 0,
              }}
              animate={{
                y: [null, "-100vh"],
                scale: [0, 1, 0.5, 0],
                opacity: [0, 1, 0.5, 0],
              }}
              transition={{
                duration: Math.random() * 15 + 15,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center space-y-16">
          {/* Cinematic Main Section */}
          <div className="relative h-[200px] sm:h-[240px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ 
                  opacity: 0, 
                  y: 50, 
                  scale: 0.8,
                  filter: "blur(10px)"
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  opacity: 0, 
                  y: -50, 
                  scale: 0.8,
                  filter: "blur(10px)"
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                className="absolute flex flex-col items-center gap-8"
              >
                {/* Premium Animation Container */}
                <motion.div
                  className="relative group"
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48">
                    {/* Outer glow ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-50"
                      style={{
                        background: `conic-gradient(from 0deg, transparent, ${steps[currentStep].lightColor}, transparent)`,
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    {/* Inner container */}
                    <div className="absolute inset-2 bg-background/90 backdrop-blur-xl rounded-full border border-border/30 shadow-2xl">
                      <div className="absolute inset-0 rounded-full opacity-20"
                        style={{
                          background: `radial-gradient(circle, ${steps[currentStep].glowColor}, transparent)`,
                        }}
                      />
                      <div className="relative p-6 h-full flex items-center justify-center">
                        <Lottie
                          animationData={steps[currentStep].animation}
                          loop={true}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Cinematic Typography */}
                <div className="relative">
                  <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight">
                    <span className="relative inline-block">
                      <motion.span
                        className={`bg-gradient-to-r ${steps[currentStep].color} bg-clip-text text-transparent`}
                        style={{
                          filter: `drop-shadow(0 0 30px ${steps[currentStep].glowColor})`,
                        }}
                        animate={{
                          filter: [
                            `drop-shadow(0 0 30px ${steps[currentStep].glowColor})`,
                            `drop-shadow(0 0 50px ${steps[currentStep].glowColor})`,
                            `drop-shadow(0 0 30px ${steps[currentStep].glowColor})`,
                          ]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        {typedText}
                      </motion.span>
                      {isTyping && (
                        <motion.span
                          className="absolute -right-3 top-0 w-1 h-full rounded-full"
                          style={{
                            background: `linear-gradient(to bottom, ${steps[currentStep].lightColor}, transparent)`,
                            boxShadow: `0 0 20px ${steps[currentStep].glowColor}`,
                          }}
                          animate={{ 
                            opacity: [1, 0.3, 1],
                            scaleY: [1, 0.8, 1]
                          }}
                          transition={{
                            duration: 0.8,
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

          {/* Epic CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative group"
          >
            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <Button
                  size="lg"
                  className="relative px-12 py-8 text-2xl font-bold rounded-3xl overflow-hidden bg-primary text-primary-foreground shadow-2xl transition-all duration-500 border-0"
                  style={{
                    boxShadow: `0 20px 60px ${steps[currentStep].glowColor}, 0 0 0 1px rgba(255,255,255,0.1)`,
                  }}
                >
                  {/* Animated background layers */}
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: `linear-gradient(45deg, ${steps[currentStep].color})`,
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    animate={{
                      x: ["-200%", "200%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                  
                  {/* Pulse ring effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    animate={{
                      boxShadow: [
                        `0 0 0 0px ${steps[currentStep].glowColor}`,
                        `0 0 0 30px transparent`,
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                  
                  <span className="relative z-10 flex items-center gap-3">
                    Start Your Journey
                    <motion.span
                      animate={{
                        x: [0, 6, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-3xl"
                    >
                      →
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Elegant Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="relative"
          >
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Transform your career with AI-powered interview preparation
            </p>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}