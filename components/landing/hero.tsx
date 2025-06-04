"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import brainAnimation from "@/public/lottie-animations/brain.json";
import sparklesAnimation from "@/public/lottie-animations/sparkles.json";
import robotAnimation from "@/public/lottie-animations/robot.json";
import coolAnimation from "@/public/lottie-animations/cool.json";

export function Hero() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [2, -2]);
  const rotateY = useTransform(mouseX, [-300, 300], [-2, 2]);

  const steps = [
    {
      text: "Paste a job offer.",
      animation: brainAnimation,
      glow: "rgba(0, 0, 0, 0.1)",
      isButton: false
    },
    {
      text: "Upload your resume.",
      animation: sparklesAnimation,
      glow: "rgba(0, 0, 0, 0.1)",
      isButton: false
    },
    {
      text: "Face our AI recruiter.",
      animation: robotAnimation,
      glow: "rgba(0, 0, 0, 0.1)",
      isButton: false
    },
    {
      text: "Get the call.",
      animation: coolAnimation,
      glow: "rgba(0, 0, 0, 0.1)",
      isButton: false
    },
    {
      text: "Start Your Journey",
      animation: sparklesAnimation,
      glow: "rgba(0, 0, 0, 0.2)",
      isButton: true
    }
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 1024);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
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
  }, [mouseX, mouseY, isLargeScreen]);

  useEffect(() => {
    const animateStep = async () => {
      while (true) {
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(i);
          setTypedText("");
          setIsTyping(true);

          if (steps[i].isButton) {
            setTypedText(steps[i].text);
            setIsTyping(false);
            await new Promise(resolve => setTimeout(resolve, 2800));
          } else {
            for (let j = 0; j <= steps[i].text.length; j++) {
              setTypedText(steps[i].text.slice(0, j));
              await new Promise(resolve => setTimeout(resolve, 50));
            }
            setIsTyping(false);
            await new Promise(resolve => setTimeout(resolve, 1400));
          }
        }
      }
    };

    animateStep();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle Background */}
      <div className="absolute inset-0">
        {/* Gradient de fond très subtil */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/5" />
        
        {/* Grille minimaliste */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.03)_1px,transparent_1px)] bg-[size:120px_120px]" />
        
        {/* Cercle de lumière très subtil */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary)/0.03) 0%, transparent 50%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div className="container relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center min-h-[100dvh]">
          <motion.div 
            className="w-full"
            style={{
              rotateX: isLargeScreen ? rotateX : 0,
              rotateY: isLargeScreen ? rotateY : 0,
              transformPerspective: 1200,
            }}
          >
            {/* Main Content */}
            <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ 
                opacity: 0, 
                y: 10,
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
              }}
              exit={{ 
                opacity: 0, 
                y: -10,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}
              {!steps[currentStep].isButton && (
                <motion.div
                  className="mb-4 flex justify-center"
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="relative w-11 h-11">
                    <div className="relative bg-muted/20 backdrop-blur-sm rounded-lg p-2.5 h-full">
                      <Lottie
                        animationData={steps[currentStep].animation}
                        loop={true}
                        style={{ width: "100%", height: "100%", opacity: 0.7 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Text/Button */}
              {steps[currentStep].isButton ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  className="mt-4 flex justify-center"
                >
                  <Link href="/register">
                    <Button
                      variant="default"
                      size="lg"
                      className="text-sm font-medium"
                    >
                      <span className="flex items-center gap-2">
                        {typedText}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-70"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto px-4 sm:px-0">
                  <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-medium tracking-tight leading-[1.2] text-center">
                    {typedText}
                    {isTyping && (
                      <motion.span
                        className="inline-block ml-0.5 w-[2px] h-[0.85em] bg-foreground/40 align-middle"
                        animate={{ 
                          opacity: [1, 0.3, 1],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </h1>
                  
                  {currentStep < 4 && (
                    <motion.p 
                      className="text-[13px] sm:text-sm text-muted-foreground/60 font-normal text-center"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      AI-powered interview preparation
                    </motion.p>
                  )}
                </div>
              )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}