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
      color: "from-blue-500 to-cyan-500"
    },
    {
      text: "Upload your resume.",
      animation: sparklesAnimation,
      color: "from-purple-500 to-pink-500"
    },
    {
      text: "Face our AI recruiter.",
      animation: robotAnimation,
      color: "from-orange-500 to-red-500"
    },
    {
      text: "Get the call.",
      animation: coolAnimation,
      color: "from-green-500 to-emerald-500"
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
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      </div>

      {/* Floating particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
                scale: 0
              }}
              animate={{
                y: [null, "-100%"],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      <div className="container relative z-10 px-4 mx-auto">
        <div className="text-center space-y-8">
          {/* Main heading with step animation */}
          <div className="relative h-[160px] sm:h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="absolute"
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    className={`w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-clip-text text-transparent bg-gradient-to-r ${steps[currentStep].color}`}
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Lottie
                      animationData={steps[currentStep].animation}
                      loop={true}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </motion.div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                    <span className="relative">
                      {typedText}
                      {isTyping && (
                        <motion.span
                          className="absolute -right-4 top-0 w-[2px] h-full bg-primary"
                          animate={{ opacity: [1, 0] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      )}
                    </span>
                  </h1>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground blur-lg opacity-30" />
            <Link href="/register">
              <Button
                size="lg"
                className="relative px-8 py-6 text-lg font-semibold rounded-full overflow-hidden bg-primary hover:bg-primary/90"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{
                    x: ["-200%", "200%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative z-10">Start Your Journey</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}