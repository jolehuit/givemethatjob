"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const companies = [
  { name: "Amazon", tooltip: "Wrong..." },
  { name: "Meta", tooltip: "Another time..." },
  { name: "Google", tooltip: "Still not that..." },
  { name: "OpenAI", tooltip: "It's getting embarrassing..." },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [displayText, setDisplayText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const startSequence = () => {
      timeout = setTimeout(() => setCurrentIndex(0), 1500);
    };
    startSequence();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const animateText = async () => {
      if (currentIndex >= 0 && currentIndex < companies.length && !showFinal) {
        const company = companies[currentIndex];
        setIsTyping(true);
        setShowTooltip(false);
        
        for (let i = 0; i <= company.name.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 80));
          setDisplayText(company.name.slice(0, i));
        }
        
        setIsTyping(false);
        await new Promise((resolve) => setTimeout(resolve, 600));
        
        if (currentIndex < companies.length && !showFinal) {
          setShowTooltip(true);
        }
        
        timeout = setTimeout(() => {
          setShowTooltip(false);
          setCurrentIndex((prev) => {
            if (prev === companies.length - 1) {
              setShowFinal(true);
              setDisplayText("");
              return prev;
            }
            return prev + 1;
          });
        }, 2200);
      }
    };
    
    if (!showFinal) animateText();
    return () => clearTimeout(timeout);
  }, [currentIndex, showFinal]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl">
          {/* Main Heading */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-bold tracking-tight text-foreground">
              {/* Container with consistent spacing */}
              <div className="space-y-2 sm:space-y-4">
                {/* First Line */}
                <motion.div
                  className="flex min-h-[3rem] items-center justify-center text-3xl sm:min-h-[4rem] sm:text-5xl lg:min-h-[5rem] lg:text-6xl xl:text-7xl"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                    Master Your Job Interviews
                  </span>
                </motion.div>

                {/* Second Line with Animation */}
                <div className="flex min-h-[3rem] items-center justify-center text-3xl sm:min-h-[4rem] sm:text-5xl lg:min-h-[5rem] lg:text-6xl xl:text-7xl">
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 lg:gap-x-4">
                    <motion.span
                      className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      with
                    </motion.span>

                    {/* Animated Company/AI Section */}
                    <div className="relative">
                      <div className="flex min-h-[3rem] min-w-[8rem] items-center justify-center sm:min-h-[4rem] sm:min-w-[12rem] lg:min-h-[5rem] lg:min-w-[16rem]">
                        <AnimatePresence mode="wait">
                          {!showFinal ? (
                            <motion.div
                              key={`company-${currentIndex}`}
                              className="relative flex items-center justify-center"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ 
                                duration: 0.3,
                                ease: "easeInOut"
                              }}
                            >
                              <span className="relative bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                                {displayText || "\u00A0"}
                                {isTyping && (
                                  <motion.span
                                    className="ml-1 inline-block h-[0.8em] w-[3px] bg-gradient-to-b from-red-500 to-orange-500"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{
                                      duration: 0.6,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }}
                                  />
                                )}
                              </span>

                              {/* Strikethrough Effect */}
                              {showTooltip && (
                                <motion.div
                                  className="absolute inset-x-0 top-1/2 h-[3px] bg-gradient-to-r from-red-500 to-orange-500"
                                  initial={{ scaleX: 0 }}
                                  animate={{ scaleX: 1 }}
                                  transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                              )}

                              {/* Tooltip */}
                              {showTooltip && currentIndex >= 0 && currentIndex < companies.length && (
                                <motion.div
                                  className="absolute left-1/2 top-full z-20 mt-4 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover/95 px-4 py-2 text-sm text-popover-foreground shadow-xl backdrop-blur-sm ring-1 ring-border/50 sm:text-base"
                                  initial={{ opacity: 0, y: -10, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{ 
                                    duration: 0.3,
                                    ease: "easeOut"
                                  }}
                                >
                                  {companies[currentIndex]?.tooltip}
                                  <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-popover ring-1 ring-border/50" />
                                </motion.div>
                              )}
                            </motion.div>
                          ) : (
                            <motion.div
                              key="ai-final"
                              className="relative flex items-center justify-center"
                              initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
                              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                                duration: 0.8
                              }}
                            >
                              <span className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-purple-400 bg-clip-text text-transparent">
                                AI
                                {/* Glow Effect */}
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-400/20 blur-xl"
                                  animate={{ 
                                    opacity: [0.5, 1, 0.5],
                                    scale: [1, 1.1, 1]
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                  }}
                                />
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <motion.span
                      className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      Recruiters
                    </motion.span>
                  </div>
                </div>
              </div>
            </h1>

            {/* Subtitle */}
            <motion.p
              className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-12 sm:text-lg sm:leading-8 lg:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Practice with ultra-realistic AI interviewers that give you
              personalized feedback based on real job descriptions and your CV.
              Land your dream job faster.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Link href="/register">
                <Button 
                  size="lg" 
                  className="group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-3 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl sm:w-auto sm:text-lg"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Try for free
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      →
                    </motion.span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </Button>
              </Link>
              
              <Link
                href="#features"
                className="group flex items-center gap-2 text-base font-semibold text-foreground transition-colors duration-300 hover:text-purple-600 sm:text-lg"
              >
                Learn more
                <motion.span
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Demo Section */}
          <motion.div
            className="mt-16 sm:mt-20 lg:mt-24"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 shadow-2xl ring-1 ring-white/10 lg:rounded-3xl lg:p-4">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-inner ring-1 ring-white/10 lg:rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
                <div className="relative flex h-full items-center justify-center">
                  <div className="max-w-sm text-center">
                    <motion.div
                      className="mb-4 text-lg text-white/90 sm:text-xl"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      Interactive interview simulation preview
                    </motion.div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-105"
                    >
                      <span className="flex items-center gap-2">
                        Watch Demo
                        <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}