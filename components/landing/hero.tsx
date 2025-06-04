"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  const steps = [
    {
      text: "Paste a job offer.",
      animation: brainAnimation,
      color: "from-blue-500 via-cyan-400 to-blue-600",
      glowColor: "rgba(59, 130, 246, 0.5)",
      lightColor: "rgb(147, 197, 253)",
      particleColor: "#3B82F6"
    },
    {
      text: "Upload your resume.",
      animation: sparklesAnimation,
      color: "from-purple-500 via-pink-400 to-purple-600",
      glowColor: "rgba(168, 85, 247, 0.5)",
      lightColor: "rgb(196, 181, 253)",
      particleColor: "#A855F7"
    },
    {
      text: "Face our AI recruiter.",
      animation: robotAnimation,
      color: "from-orange-500 via-amber-400 to-orange-600",
      glowColor: "rgba(251, 146, 60, 0.5)",
      lightColor: "rgb(253, 186, 116)",
      particleColor: "#F97316"
    },
    {
      text: "Get the call.",
      animation: coolAnimation,
      color: "from-emerald-500 via-teal-400 to-emerald-600",
      glowColor: "rgba(52, 211, 153, 0.5)",
      lightColor: "rgb(110, 231, 183)",
      particleColor: "#10B981"
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLargeScreen(window.innerWidth > 768);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    if (isLargeScreen) {
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseX, mouseY]);

  useEffect(() => {
    const animateStep = async () => {
      while (true) {
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(i);
          setTypedText("");
          setIsTyping(true);

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
    setTimeout(() => setShowParticles(true), 500);
  }, []);

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${steps[currentStep].color}`}
          animate={{
            opacity: [0.02, 0.05, 0.02],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:60px_60px]"
            animate={{
              opacity: [0.3, 0.4, 0.3]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Spotlight */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] max-w-[90vw] max-h-[90vh]"
          style={{
            background: `radial-gradient(circle, ${steps[currentStep].glowColor} 0%, transparent 50%)`,
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Animated gradient rings */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute top-1/2 left-1/2 rounded-full border border-primary/10"
              style={{
                width: `${(i + 1) * 40}%`,
                height: `${(i + 1) * 40}%`,
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "linear",
                scale: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              }}
            />
          ))}
        </div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <motion.div 
            className="text-center space-y-8 sm:space-y-12"
            style={{
              rotateX: isLargeScreen ? rotateX : 0,
              rotateY: isLargeScreen ? rotateY : 0,
              transformPerspective: 1000,
            }}
          >
            {/* Main Animation Section */}
            <div className="relative hero-animation flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ 
                    opacity: 0, 
                    y: 30,
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
                    y: -30,
                    scale: 0.8,
                    filter: "blur(10px)"
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  className="absolute flex flex-col items-center gap-6 sm:gap-10"
                >
                  {/* Animation Container */}
                  <motion.div
                    className="relative"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <div className="relative w-24 h-24 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48">
                      {/* Glow ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(from 0deg, transparent, ${steps[currentStep].lightColor}, transparent)`,
                          filter: "blur(8px)",
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
                      
                      {/* Inner sphere */}
                      <motion.div 
                        className="absolute inset-4 bg-background/80 backdrop-blur-xl rounded-full border border-border/50 shadow-2xl overflow-hidden"
                        style={{
                          boxShadow: `0 0 40px ${steps[currentStep].glowColor}`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
                        <motion.div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: `radial-gradient(circle at 30% 30%, ${steps[currentStep].lightColor}, transparent)`,
                          }}
                        />
                        <div className="relative p-4 sm:p-6 h-full flex items-center justify-center">
                          <Lottie
                            animationData={steps[currentStep].animation}
                            loop={true}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                      </motion.div>

                      {/* Pulse effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full border"
                        style={{
                          borderColor: steps[currentStep].particleColor,
                        }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeOut"
                        }}
                      />
                    </div>
                  </motion.div>
                  
                  {/* Typography */}
                  <div className="relative">
                    <h1 className="hero-title">
                      <motion.span
                        className={`bg-gradient-to-r ${steps[currentStep].color} bg-clip-text text-transparent`}
                        style={{
                          filter: `drop-shadow(0 2px 10px ${steps[currentStep].glowColor})`,
                        }}
                      >
                        {typedText}
                      </motion.span>
                      {isTyping && (
                        <motion.span
                          className="inline-block ml-1 w-1 h-[1.2em] align-middle"
                          style={{
                            background: `linear-gradient(to bottom, ${steps[currentStep].lightColor}, ${steps[currentStep].particleColor})`,
                            boxShadow: `0 0 20px ${steps[currentStep].glowColor}`,
                          }}
                          animate={{ 
                            opacity: [1, 0, 1],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </h1>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="relative mt-8 sm:mt-12"
            >
              <Link href="/register">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative inline-block"
                >
                  {/* Button glow */}
                  <motion.div
                    className="absolute -inset-2 rounded-2xl opacity-60"
                    style={{
                      background: `radial-gradient(circle, ${steps[currentStep].glowColor} 0%, transparent 60%)`,
                      filter: "blur(20px)",
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
                  
                  <Button
                    className="hero-button relative rounded-2xl bg-primary text-primary-foreground shadow-lg transition-all duration-300 border-0"
                    style={{
                      boxShadow: `0 10px 40px ${steps[currentStep].glowColor}`,
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Start Your Journey
                      <motion.span
                        animate={{
                          x: [0, 5, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="text-xl"
                      >
                        →
                      </motion.span>
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="relative mt-6 sm:mt-8"
            >
              <p className="hero-subtitle">
                Transform your career with AI-powered interview preparation
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}