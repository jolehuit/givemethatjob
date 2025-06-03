"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function Hero() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showParticles, setShowParticles] = useState(false);

  const steps = [
    {
      text: "Paste a job offer.",
      icon: "📋",
      color: "from-blue-500 to-cyan-500"
    },
    {
      text: "Upload your resume.",
      icon: "📄",
      color: "from-purple-500 to-pink-500"
    },
    {
      text: "Face our AI recruiter.",
      icon: "🤖",
      color: "from-orange-500 to-red-500"
    },
    {
      text: "Get the call.",
      icon: "📞",
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
    <div className="relative min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
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
                    className={`text-6xl sm:text-8xl lg:text-9xl bg-clip-text text-transparent bg-gradient-to-r ${steps[currentStep].color}`}
                    animate={{
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {steps[currentStep].icon}
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
                            ease: "steps(2)"
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
                    repeatDelay: 1,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative z-10">Start Your Journey</span>
              </Button>
            </Link>
          </motion.div>

          {/* Features grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16"
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-primary-foreground rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000" />
                <div className="relative p-4 bg-card rounded-lg border border-border">
                  <div className="text-2xl mb-2">{step.icon}</div>
                  <p className="text-sm text-muted-foreground">{step.text}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}