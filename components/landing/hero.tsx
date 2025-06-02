"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const companies = [
  { name: "Amazon", tooltip: "Wrong...", color: "#FF9900" },
  { name: "Meta", tooltip: "Another time...", color: "#0668E1" },
  { name: "Google", tooltip: "Still not that...", color: "#4285F4" },
  { name: "OpenAI", tooltip: "It's getting embarrassing...", color: "#74AA9C" },
];

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [displayText, setDisplayText] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [particles, setParticles] = useState([]);

  // Générer des particules flottantes
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const startSequence = async () => {
      timeout = setTimeout(() => {
        setCurrentIndex(0);
      }, 500);
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

        // Animation de frappe plus dynamique
        for (let i = 0; i <= company.name.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 40));
          setDisplayText(company.name.slice(0, i));
        }

        setIsTyping(false);

        await new Promise((resolve) => setTimeout(resolve, 200));
        if (currentIndex < companies.length && !showFinal) {
          setShowTooltip(true);
        }

        timeout = setTimeout(() => {
          setShowTooltip(false);
          setCurrentIndex((prev) => {
            if (prev === companies.length - 1) {
              setShowFinal(true);
              setDisplayText("");
              
              setTimeout(() => {
                setShowFinal(false);
                setCurrentIndex(0);
              }, 6000);
              
              return prev;
            }
            return prev + 1;
          });
        }, 1200);
      }
    };

    if (!showFinal) {
      animateText();
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, showFinal]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Gradient animé de fond */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-pink-500/10" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/20 dark:bg-primary/30"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              y: [`${particle.y}%`, `${particle.y - 100}%`],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
            style={{
              width: particle.size,
              height: particle.size,
              filter: "blur(1px)",
            }}
          />
        ))}
      </div>

      {/* Lignes de grille animées */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 49%, currentColor 50%, transparent 51%),
              linear-gradient(0deg, transparent 49%, currentColor 50%, transparent 51%)
            `,
            backgroundSize: "50px 50px",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "50px 50px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            className="relative inline-block mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge lumineux */}
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-pink-500/20 blur-3xl"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative px-6 py-2 bg-card/50 backdrop-blur-sm border border-border rounded-full">
              <span className="text-sm font-medium bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
                ✨ Next-Gen Interview Preparation
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="block mb-4">Master Your Job</span>
            <span className="block mb-4">Interviews with</span>
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                {!showFinal ? (
                  <motion.span
                    key={currentIndex}
                    className="relative inline-flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    transition={{ 
                      duration: 0.3,
                      type: "spring",
                      stiffness: 200
                    }}
                  >
                    {/* Glow effect pour le texte actuel */}
                    {currentIndex >= 0 && currentIndex < companies.length && (
                      <motion.div
                        className="absolute -inset-8 blur-2xl opacity-60"
                        style={{
                          background: `radial-gradient(circle, ${companies[currentIndex].color}30 0%, transparent 70%)`,
                        }}
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    
                    <span className="relative inline-flex items-center">
                      <span
                        className="font-bold relative"
                        style={{
                          color: currentIndex >= 0 && currentIndex < companies.length 
                            ? companies[currentIndex].color 
                            : "currentColor",
                          textShadow: `0 0 30px ${currentIndex >= 0 && currentIndex < companies.length ? companies[currentIndex].color : "currentColor"}40`,
                        }}
                      >
                        {displayText || <>&nbsp;</>}
                        
                        {/* Ligne de barrage directement sur le texte */}
                        {showTooltip && currentIndex >= 0 && currentIndex < companies.length && (
                          <motion.div
                            className="absolute left-0 right-0 top-1/2 h-[3px] bg-destructive"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: 0.2,
                              ease: "easeOut",
                            }}
                          />
                        )}
                      </span>
                      
                      {isTyping && (
                        <motion.span
                          className="inline-block w-1 h-[1.2em] ml-1 rounded-full"
                          style={{
                            backgroundColor: currentIndex >= 0 && currentIndex < companies.length 
                              ? companies[currentIndex].color 
                              : "currentColor",
                            boxShadow: `0 0 20px ${currentIndex >= 0 && currentIndex < companies.length ? companies[currentIndex].color : "currentColor"}`,
                          }}
                          animate={{ opacity: [1, 0.2] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </span>

                    {/* Tooltip repositionné */}
                    {showTooltip && currentIndex >= 0 && currentIndex < companies.length && (
                      <motion.div
                        className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+0.5rem)] z-50"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="relative">
                          <motion.div
                            className="absolute inset-0 bg-destructive/20 blur-xl"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <div className="relative px-4 py-2 bg-destructive/10 dark:bg-destructive/20 backdrop-blur-sm border border-destructive/50 rounded-lg">
                            <motion.p
                              className="text-sm font-medium text-destructive-foreground dark:text-destructive whitespace-nowrap"
                              animate={{
                                x: [0, -1, 1, -1, 0],
                              }}
                              transition={{
                                duration: 0.2,
                                repeat: 2,
                              }}
                            >
                              {companies[currentIndex].tooltip}
                            </motion.p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.span>
                ) : (
                  <motion.span
                    key="ai"
                    className="relative inline-flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 150,
                      damping: 12,
                      duration: 0.8,
                    }}
                  >
                    {/* Effet de particules explosives */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-primary to-pink-500 rounded-full"
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i * Math.PI * 2) / 12) * 100,
                          y: Math.sin((i * Math.PI * 2) / 12) * 100,
                          opacity: [1, 0],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                      />
                    ))}

                    {/* Effet de halo pulsant */}
                    <motion.div
                      className="absolute -inset-16 rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)",
                      }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Texte AI avec effet néon */}
                    <span className="relative font-black text-8xl">
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent blur-sm"
                        animate={{
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        AI
                      </motion.span>
                      <span className="relative bg-gradient-to-r from-primary via-pink-500 to-primary bg-clip-text text-transparent">
                        AI
                      </span>
                    </span>

                    {/* Effet de lumière tournante */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div className="absolute top-1/2 left-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-primary to-transparent transform -translate-x-1/2 -translate-y-1/2 opacity-50" />
                      <div className="absolute top-1/2 left-1/2 w-1 h-40 bg-gradient-to-b from-transparent via-pink-500 to-transparent transform -translate-x-1/2 -translate-y-1/2 opacity-50" />
                    </motion.div>
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span className="block mt-4">Recruiters</span>
          </motion.h1>

          <motion.p
            className="mt-12 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Practice with ultra-realistic AI interviewers that give you
            personalized feedback based on real job descriptions and your CV.
            Land your dream job faster.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/register">
              <Button 
                size="lg" 
                className="group relative px-8 py-6 text-lg font-semibold rounded-full overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-pink-500/20"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut",
                  }}
                />
                <span className="relative z-10">Try for free</span>
              </Button>
            </Link>
            
            <Link
              href="#features"
              className="group text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2"
            >
              Learn more 
              <motion.span 
                className="inline-block"
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Section vidéo avec effet de profondeur */}
        <motion.div
          className="mt-20 flow-root"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative">
            {/* Effet de lumière derrière la vidéo */}
            <motion.div
              className="absolute -inset-20 bg-gradient-to-r from-primary/20 via-pink-500/20 to-primary/20 blur-3xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative rounded-2xl bg-gradient-to-b from-muted/80 to-muted/40 p-1 backdrop-blur-xl">
              <div className="relative aspect-video rounded-xl bg-card shadow-2xl overflow-hidden border border-border">
                {/* Effet de scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.05]">
                  <motion.div
                    className="h-full w-full"
                    style={{
                      backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)",
                    }}
                    animate={{
                      backgroundPosition: ["0px 0px", "0px 4px"],
                    }}
                    transition={{
                      duration: 0.1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </div>

                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary to-pink-500 mb-6"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </motion.div>
                    <p className="text-xl text-muted-foreground mb-4">Interactive interview simulation</p>
                    <Button 
                      variant="secondary" 
                      size="lg"
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