"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const companies = [
  { name: "Amazon", color: "#FF9900" },
  { name: "Meta", color: "#0668E1" },
  { name: "Google", color: "#4285F4" },
  { name: "OpenAI", color: "#74AA9C" },
];

export function Hero() {
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(-1);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showScribble, setShowScribble] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Animation principale
  useEffect(() => {
    const runAnimation = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));

      while (true) {
        for (let i = 0; i < companies.length; i++) {
          // Commencer la transition
          setIsTransitioning(false);
          setCurrentCompanyIndex(i);
          setCurrentText("");
          setShowScribble(false);
          setIsTyping(true);

          // Attendre un peu pour que l'état se stabilise
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Taper le nom lettre par lettre
          for (let j = 0; j <= companies[i].name.length; j++) {
            setCurrentText(companies[i].name.slice(0, j));
            await new Promise((resolve) => setTimeout(resolve, 80));
          }

          setIsTyping(false);
          await new Promise((resolve) => setTimeout(resolve, 400));

          // Animer le gribouillage
          setShowScribble(true);
          await new Promise((resolve) => setTimeout(resolve, 1200));

          // Commencer la transition de sortie
          setIsTransitioning(true);
          await new Promise((resolve) => setTimeout(resolve, 200));

          // Réinitialiser tout
          setCurrentCompanyIndex(-1);
          setCurrentText("");
          setShowScribble(false);
          setIsTransitioning(false);
          await new Promise((resolve) => setTimeout(resolve, 400));
        }

        // Montrer AI
        setShowAI(true);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        setShowAI(false);
        await new Promise((resolve) => setTimeout(resolve, 400));
      }
    };

    runAnimation();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Gradient animé de fond - violet en haut, transparent en bas */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/8 via-violet-500/4 to-transparent dark:from-violet-600/12 dark:via-violet-500/6 dark:to-transparent" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-violet-500/4 via-violet-600/6 to-transparent dark:from-violet-500/8 dark:via-violet-600/10 dark:to-transparent"
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
        {/* Dégradé de fondu vers le bas pour transition parfaite */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Particules flottantes */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-violet-500/20 dark:bg-violet-500/30"
            initial={{
              x: `${particle.x}%`,
              y: `${particle.y}%`,
            }}
            animate={{
              y: [`${particle.y}%`, `${particle.y - 100}%`],
              opacity: [0, 0.6, 0],
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
      <div className="absolute inset-0 overflow-hidden opacity-[0.01] dark:opacity-[0.02]">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 49%, rgba(139, 92, 246, 0.05) 50%, transparent 51%),
              linear-gradient(0deg, transparent 49%, rgba(139, 92, 246, 0.05) 50%, transparent 51%)
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
              className="absolute -inset-4 bg-violet-600/10 blur-3xl"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative px-6 py-2 bg-card/50 backdrop-blur-sm border border-violet-500/20 rounded-full">
              <span className="text-sm font-medium bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
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
            {/* CONTENEUR FIXE pour éviter les changements de hauteur */}
            <span className="relative inline-block h-[1.2em] min-w-[8ch]">
              <AnimatePresence mode="wait">
                {showAI ? (
                  <motion.span
                    key="ai"
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
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
                        className="absolute w-2 h-2 bg-gradient-to-r from-violet-400 to-violet-600 rounded-full"
                        initial={{ scale: 0, x: 0, y: 0 }}
                        animate={{
                          scale: [0, 1, 0],
                          x: Math.cos((i * Math.PI * 2) / 12) * 80,
                          y: Math.sin((i * Math.PI * 2) / 12) * 80,
                          opacity: [1, 0],
                        }}
                        transition={{
                          duration: 1,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                      />
                    ))}

                    {/* Texte AI avec effet néon */}
                    <span className="relative font-black">
                      <motion.span
                        className="absolute inset-0 bg-gradient-to-r from-violet-500 to-violet-700 bg-clip-text text-transparent blur-sm"
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
                      <span className="relative bg-gradient-to-r from-violet-400 via-violet-600 to-violet-400 bg-clip-text text-transparent">
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
                      <div className="absolute top-1/2 left-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent transform -translate-x-1/2 -translate-y-1/2" />
                      <div className="absolute top-1/2 left-1/2 w-0.5 h-32 bg-gradient-to-b from-transparent via-violet-600/30 to-transparent transform -translate-x-1/2 -translate-y-1/2" />
                    </motion.div>
                  </motion.span>
                ) : currentCompanyIndex >= 0 && !isTransitioning ? (
                  <motion.span
                    key={`company-${currentCompanyIndex}`}
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                  >
                    <span className="relative inline-flex items-center">
                      <span
                        className="font-bold relative"
                        style={{
                          color: companies[currentCompanyIndex].color,
                          textShadow: `0 0 30px ${companies[currentCompanyIndex].color}40`,
                        }}
                      >
                        {currentText}

                        {/* Animation de gribouillage au feutre rouge - VERSION SIMPLE QUI MARCHE */}
                        {showScribble && (
                          <motion.div
                            className="absolute top-1/2 left-0 right-0 pointer-events-none"
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{ transformOrigin: "left center" }}
                          >
                            {/* Trait principal de gribouillage */}
                            <motion.div
                              className="h-1 bg-red-500 rounded-full relative"
                              style={{
                                background: "linear-gradient(90deg, #ef4444, #dc2626, #ef4444)",
                                filter: "drop-shadow(0 0 4px rgba(239, 68, 68, 0.5))",
                                transform: "rotate(-2deg) scaleY(0.8)",
                              }}
                              animate={{
                                rotate: [-2, 1, -1, 2, -2],
                              }}
                              transition={{
                                duration: 0.8,
                                ease: "easeInOut",
                                repeat: 1,
                              }}
                            />
                            
                            {/* Trait secondaire pour effet plus réaliste */}
                            <motion.div
                              className="absolute top-0.5 left-2 right-4 h-0.5 bg-red-400/70 rounded-full"
                              style={{
                                transform: "rotate(1deg)",
                                filter: "blur(0.5px)",
                              }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ duration: 0.7, delay: 0.1 }}
                            />

                            {/* Petites particules de feutre */}
                            {Array.from({ length: 4 }).map((_, i) => (
                              <motion.div
                                key={`dot-${i}`}
                                className="absolute w-1 h-1 bg-red-500 rounded-full"
                                style={{
                                  left: `${20 + i * 25}%`,
                                  top: Math.random() > 0.5 ? "-2px" : "4px",
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ 
                                  scale: [0, 1.2, 0.8], 
                                  opacity: [0, 0.8, 0.4] 
                                }}
                                transition={{
                                  duration: 0.5,
                                  delay: 0.2 + i * 0.1,
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </span>

                      {isTyping && (
                        <motion.span
                          className="inline-block w-1 h-[1.2em] ml-1 rounded-full"
                          style={{
                            backgroundColor: companies[currentCompanyIndex].color,
                            boxShadow: `0 0 20px ${companies[currentCompanyIndex].color}`,
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
                  </motion.span>
                ) : (
                  <span key="empty">&nbsp;</span>
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
                className="group relative px-8 py-6 text-lg font-semibold rounded-full overflow-hidden bg-primary hover:bg-primary/90"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-600/0 via-white/20 to-violet-600/0"
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
              className="absolute -inset-20 bg-gradient-to-r from-violet-600/8 via-violet-500/8 to-violet-600/8 blur-3xl"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative rounded-2xl bg-gradient-to-b from-card/80 to-card/40 p-1 backdrop-blur-xl">
              <div className="relative aspect-video rounded-xl bg-card shadow-2xl overflow-hidden border border-border">
                <div className="relative h-full flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-violet-500 to-violet-700 mb-6"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <svg
                        className="w-10 h-10 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </motion.div>
                    <p className="text-xl text-muted-foreground mb-4">
                      Interactive interview simulation
                    </p>
                    <Button variant="secondary" size="lg">
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