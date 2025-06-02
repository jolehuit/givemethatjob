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
      timeout = setTimeout(() => setCurrentIndex(0), 1000);
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
          await new Promise((resolve) => setTimeout(resolve, 100));
          setDisplayText(company.name.slice(0, i));
        }
        setIsTyping(false);
        await new Promise((resolve) => setTimeout(resolve, 500));
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
        }, 2000);
      }
    };
    if (!showFinal) animateText();
    return () => clearTimeout(timeout);
  }, [currentIndex, showFinal]);

  return (
    <div className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl
                       flex flex-col items-center text-center" // MODIFIED: Simpler H1 container
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Line 1 Wrapper: Fixed height, content centered */}
            <span className="grid min-h-[5rem] w-full place-items-center sm:min-h-15">
              <span>Master Your Job Interviews</span>
            </span>

            {/* Line 2 Wrapper: Fixed height, content centered */}
            <span className="grid min-h-[5rem] w-full place-items-center sm:min-h-15">
              {/* Content of Line 2, allows wrapping */}
              <span className="flex flex-wrap items-baseline justify-center gap-x-2">
                <span>with</span>
                {/* Animated part: has fixed height of 1 line */}
                <span className="relative inline-flex h-10 items-center justify-center sm:h-15">
                  <AnimatePresence mode="wait">
                    {!showFinal ? (
                      <motion.span
                        key={currentIndex}
                        className="relative inline-flex h-full items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="inline-flex items-center">
                          {displayText || <>&nbsp;</>}
                          {isTyping && (
                            <motion.span
                              className="ml-[2px] inline-block h-[1em] w-[2px] animate-pulse bg-primary align-baseline"
                              animate={{ opacity: [1, 0] }}
                              transition={{
                                duration: 0.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          )}
                        </span>
                        {showTooltip &&
                          currentIndex >= 0 &&
                          currentIndex < companies.length &&
                          companies[currentIndex]?.tooltip && (
                            <>
                              <motion.div
                                className="absolute left-0 right-0 top-1/2 h-[3px] bg-destructive"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                              />
                              <motion.div
                                className="absolute left-1/2 top-[calc(100%+0.5em)] z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-3 py-1 text-sm text-popover-foreground shadow-lg"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                {companies[currentIndex]?.tooltip}
                              </motion.div>
                            </>
                          )}
                      </motion.span>
                    ) : (
                      <motion.span
                        key="ai"
                        className="relative inline-flex h-full items-center justify-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                      >
                        <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                          AI
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
                <span>Recruiters</span>
              </span>
            </span>
          </motion.h1>

          <motion.p
            className="mt-16 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Practice with ultra-realistic AI interviewers that give you
            personalized feedback based on real job descriptions and your CV.
            Land your dream job faster.
          </motion.p>

          <motion.div
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8">
                Try for free
              </Button>
            </Link>
            <Link
              href="#features"
              className="text-sm font-semibold leading-6 text-foreground"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="mt-16 flow-root sm:mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="relative -m-4 rounded-xl bg-gray-900 p-2 ring-1 ring-white/10 lg:rounded-2xl lg:p-4">
            <div className="relative aspect-video rounded-md bg-gray-800 shadow-2xl ring-1 ring-white/10">
              <div className="absolute inset-0 flex items-center justify-center text-lg text-white/80">
                <div className="max-w-sm text-center">
                  <p>Interactive interview simulation preview</p>
                  <Button variant="secondary" size="sm" className="mt-4">
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}