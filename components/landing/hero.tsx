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

// Chemins de gribouillage pour chaque entreprise (comme tracé à la main)
const scribblePaths = {
  Amazon: [
    "M8 12 Q25 8, 45 15 T85 12 Q110 18, 135 14 T175 16 Q190 20, 200 18",
    "M5 16 Q30 22, 50 18 T90 16 Q115 12, 140 19 T180 15 Q195 13, 205 17",
    "M10 14 Q35 10, 55 17 T95 14 Q120 20, 145 16 T185 18",
  ],
  Meta: [
    "M5 14 Q20 10, 35 16 T65 13 Q80 18, 95 15 T125 17",
    "M8 17 Q25 22, 40 18 T70 16 Q85 12, 100 19 T130 15",
    "M6 15 Q22 8, 38 14 T68 17 Q83 21, 98 16 T128 19",
  ],
  Google: [
    "M5 15 Q25 11, 45 17 T85 14 Q110 19, 135 15 T175 18 Q190 12, 205 16",
    "M8 18 Q30 24, 50 20 T90 17 Q115 13, 140 20 T180 16 Q195 14, 210 18",
    "M7 16 Q28 9, 48 15 T88 18 Q113 22, 138 17 T178 14 Q193 19, 208 17",
  ],
  OpenAI: [
    "M5 16 Q30 12, 55 18 T105 15 Q135 20, 165 16 T205 19 Q220 15, 235 17",
    "M8 19 Q35 25, 60 21 T110 18 Q140 14, 170 20 T210 17 Q225 13, 240 16",
    "M6 17 Q32 10, 57 16 T107 19 Q137 23, 167 18 T207 15 Q222 20, 237 18",
  ],
};

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
            <span className="relative inline-block h-[1.2em]">
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

                        {/* Animation de gribouillage au feutre rouge */}
                        {showScribble && (
                          <div className="absolute inset-0 pointer-events-none">
                            <svg
                              className="absolute inset-0 w-full h-full"
                              style={{
                                left: "-10%",
                                right: "-10%",
                                top: "-20%",
                                bottom: "-20%",
                                width: "120%",
                                height: "140%",
                              }}
                              viewBox="0 0 250 40"
                            >
                              {scribblePaths[
                                companies[currentCompanyIndex]
                                  .name as keyof typeof scribblePaths
                              ].map((path, index) => (
                                <motion.path
                                  key={index}
                                  d={path}
                                  stroke="#ef4444"
                                  strokeWidth={index === 0 ? "3" : "2"}
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  opacity={index === 0 ? 0.9 : 0.6}
                                  style={{
                                    filter: `drop-shadow(0 0 8px #ef444440)`,
                                    strokeDasharray: 1000,
                                    strokeDashoffset: 1000,
                                  }}
                                  animate={{
                                    strokeDashoffset: 0,
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    delay: index * 0.1,
                                    ease: "easeOut",
                                  }}
                                />
                              ))}

                              {/* Effet de particules de feutre */}
                              {Array.from({ length: 6 }).map((_, i) => (
                                <motion.circle
                                  key={`particle-${i}`}
                                  r="1"
                                  fill="#ef4444"
                                  opacity="0.6"
                                  initial={{
                                    cx: 20 + Math.random() * 200,
                                    cy: 15 + Math.random() * 10,
                                    scale: 0,
                                  }}
                                  animate={{
                                    scale: [0, 1, 0],
                                    cy: [
                                      15 + Math.random() * 10,
                                      15 + Math.random() * 10 + 5,
                                    ],
                                  }}
                                  transition={{
                                    duration: 1,
                                    delay: 0.3 + i * 0.1,
                                    ease: "easeOut",
                                  }}
                                />
                              ))}
                            </svg>
                          </div>
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