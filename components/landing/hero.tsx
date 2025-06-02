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
    <div className="relative overflow-hidden bg-background">
      {/* Container principal avec padding responsive intelligent */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section hero avec padding top responsive */}
        <div className="pb-12 pt-16 sm:pb-16 sm:pt-20 md:pb-20 md:pt-24 lg:pb-24 lg:pt-28">
          {/* Container du contenu avec max-width adaptatif */}
          <div className="mx-auto max-w-4xl text-center">
            {/* Titre principal avec espacement optimisé */}
            <motion.div
              className="mb-8 sm:mb-12 md:mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {/* Première ligne - hauteur fixe pour éviter les sauts */}
                <div className="mb-2 sm:mb-3 md:mb-4">
                  <div className="flex h-12 items-center justify-center sm:h-14 md:h-16 lg:h-20 xl:h-24">
                    <span className="leading-none">Master Your Job Interviews</span>
                  </div>
                </div>

                {/* Deuxième ligne avec animation - hauteur fixe */}
                <div className="relative">
                  <div className="flex h-12 items-center justify-center gap-2 sm:h-14 sm:gap-3 md:h-16 md:gap-4 lg:h-20 lg:gap-5 xl:h-24">
                    <span className="leading-none">with</span>

                    {/* Container de l'animation avec largeur minimum */}
                    <div className="relative flex min-w-[120px] items-center justify-center sm:min-w-[140px] md:min-w-[160px] lg:min-w-[180px]">
                      <AnimatePresence mode="wait">
                        {!showFinal ? (
                          <motion.div
                            key={currentIndex}
                            className="relative flex items-center justify-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <span className="relative inline-flex items-center leading-none">
                              {displayText || <span className="opacity-0">A</span>}
                              {isTyping && (
                                <motion.span
                                  className="ml-1 inline-block h-[0.8em] w-[2px] bg-primary"
                                  animate={{ opacity: [1, 0, 1] }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                  }}
                                />
                              )}
                            </span>

                            {/* Ligne de barré et tooltip */}
                            {showTooltip &&
                              currentIndex >= 0 &&
                              currentIndex < companies.length && (
                                <>
                                  <motion.div
                                    className="absolute inset-x-0 top-1/2 h-[2px] bg-destructive sm:h-[3px]"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                  />
                                  <motion.div
                                    className="absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded-lg bg-popover px-3 py-2 text-xs font-medium text-popover-foreground shadow-xl ring-1 ring-border sm:mt-4 sm:px-4 sm:py-2 sm:text-sm md:text-base"
                                    initial={{ opacity: 0, y: -8, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                      duration: 0.4,
                                      ease: "easeOut",
                                    }}
                                  >
                                    {companies[currentIndex]?.tooltip}
                                    {/* Petite flèche pointant vers le haut */}
                                    <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-popover ring-1 ring-border"></div>
                                  </motion.div>
                                </>
                              )}
                          </motion.div>
                        ) : (
                          <motion.div
                            key="ai"
                            className="flex items-center justify-center"
                            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                              duration: 0.8,
                            }}
                          >
                            <span className="bg-gradient-to-r from-purple-600 via-purple-400 to-indigo-500 bg-clip-text font-bold leading-none text-transparent">
                              AI
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <span className="leading-none">Recruiters</span>
                  </div>
                </div>
              </h1>
            </motion.div>

            {/* Description avec typographie responsive */}
            <motion.p
              className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 md:text-xl md:leading-9 lg:max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              Practice with ultra-realistic AI interviewers that give you
              personalized feedback based on real job descriptions and your CV.
              Land your dream job faster.
            </motion.p>

            {/* Boutons d'action avec espacement optimisé */}
            <motion.div
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-6 md:mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="w-full rounded-full px-8 py-3 text-base font-semibold sm:w-auto sm:px-10 sm:py-4 sm:text-lg md:px-12 md:py-5"
                >
                  Try for free
                </Button>
              </Link>
              <Link
                href="#features"
                className="group inline-flex items-center text-sm font-semibold leading-6 text-foreground transition-colors hover:text-primary sm:text-base"
              >
                Learn more
                <span
                  aria-hidden="true"
                  className="ml-2 transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Aperçu de démonstration avec design moderne */}
        <motion.div
          className="relative mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 ring-1 ring-white/10 sm:rounded-3xl sm:p-4 md:p-6 lg:p-8">
            <div className="relative overflow-hidden rounded-xl bg-gray-900/50 shadow-2xl ring-1 ring-white/5 sm:rounded-2xl">
              <div className="aspect-[16/10] bg-gradient-to-br from-gray-800 via-gray-900 to-black sm:aspect-video">
                <div className="flex h-full items-center justify-center p-6 sm:p-8 md:p-12">
                  <div className="max-w-md text-center">
                    <div className="mb-4 sm:mb-6">
                      <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-4 sm:h-20 sm:w-20">
                        <svg
                          className="h-full w-full text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
                        Interactive Interview Simulation
                      </h3>
                      <p className="mt-2 text-sm text-gray-300 sm:text-base">
                        Experience realistic AI-powered interviews
                      </p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/10 font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 sm:size-default"
                    >
                      Watch Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}