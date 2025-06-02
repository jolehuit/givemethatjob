"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const companies = [
  { name: "Amazon", tooltip: "Wrong..." },
  { name: "Meta", tooltip: "Another time..." },
  { name: "Google", tooltip: "It's getting embarrassing..." },
  { name: "Microsoft", tooltip: "Still not it..." },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [displayText, setDisplayText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const startSequence = async () => {
      timeout = setTimeout(() => {
        setCurrentIndex(0);
      }, 1000);
    };

    startSequence();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const animateText = async () => {
      if (currentIndex >= 0 && currentIndex < companies.length) {
        const company = companies[currentIndex];
        setIsTyping(true);
        setShowTooltip(false); // Hide tooltip when new text starts typing

        // Type out the text
        for (let i = 0; i <= company.name.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          setDisplayText(company.name.slice(0, i));
        }

        setIsTyping(false);

        // Show tooltip after typing
        await new Promise((resolve) => setTimeout(resolve, 500));
        // Ensure we are still on the same company before showing tooltip
        if (!showFinal) { // Only show tooltip if not transitioning to "AI"
            setShowTooltip(true);
        }


        // Move to next company or show final
        timeout = setTimeout(() => {
          setShowTooltip(false); // Hide tooltip before changing text
          setCurrentIndex((prev) => {
            if (prev === companies.length - 1) {
              setShowFinal(true);
              return prev;
            }
            return prev + 1;
          });
        }, 2000);
      }
    };

    animateText();
    return () => clearTimeout(timeout);
  }, [currentIndex, showFinal]); // Added showFinal to dependencies to handle tooltip correctly

  return (
    <div className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Master Your Job Interviews with{" "}
            <span className="relative inline-flex items-center min-h-10 sm:min-h-15 align-bottom">
              <AnimatePresence mode="wait">
                {!showFinal ? (
                  <motion.span
                    key={currentIndex} // Use currentIndex for a more reliable key
                    className="relative inline-block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }} // Faster exit
                  >
                    {/* Use &nbsp; if displayText is empty to maintain height */}
                    {displayText || <>&nbsp;</>}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-[2px] h-[1em] bg-primary ml-[2px] align-baseline" // MODIFIED: h-[1em] and align-baseline
                        animate={{ opacity: [1, 0] }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    {showTooltip &&
                      currentIndex >= 0 && // Check currentIndex validity
                      currentIndex < companies.length &&
                      companies[currentIndex]?.tooltip && ( // Check tooltip existence
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
                            className="absolute whitespace-nowrap top-[calc(100%+1rem)] left-1/2 -translate-x-1/2 px-3 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-lg z-10"
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
                    className="relative inline-block px-1"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                  >
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
                      AI
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>{" "}
            Recruiters
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
          <div className="relative rounded-xl bg-gray-900 p-2 ring-1 ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="relative aspect-video rounded-md bg-gray-800 shadow-2xl ring-1 ring-white/10">
              <div className="absolute inset-0 flex items-center justify-center text-white/80 text-lg">
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