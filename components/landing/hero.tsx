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
  const [showParticles, setShowParticles] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const steps = [
    {
      text: "Paste a job offer.",
      animation: brainAnimation,
      color: "from-blue-600 via-cyan-400 to-indigo-600",
      glowColor: "rgba(59, 130, 246, 0.6)",
      lightColor: "rgb(147, 197, 253)",
      particleColor: "#60A5FA"
    },
    {
      text: "Upload your resume.",
      animation: sparklesAnimation,
      color: "from-purple-600 via-pink-400 to-violet-600",
      glowColor: "rgba(168, 85, 247, 0.6)",
      lightColor: "rgb(196, 181, 253)",
      particleColor: "#C084FC"
    },
    {
      text: "Face our AI recruiter.",
      animation: robotAnimation,
      color: "from-orange-600 via-amber-400 to-red-600",
      glowColor: "rgba(251, 146, 60, 0.6)",
      lightColor: "rgb(253, 186, 116)",
      particleColor: "#FB923C"
    },
    {
      text: "Get the call.",
      animation: coolAnimation,
      color: "from-emerald-600 via-teal-400 to-green-600",
      glowColor: "rgba(52, 211, 153, 0.6)",
      lightColor: "rgb(110, 231, 183)",
      particleColor: "#34D399"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const animateStep = async () => {
      while (true) {
        for (let i = 0; i < steps.length; i++) {
          setCurrentStep(i);
          setTypedText("");
          setIsTyping(true);

          // Type out text with variable speed
          for (let j = 0; j <= steps[i].text.length; j++) {
            setTypedText(steps[i].text.slice(0, j));
            await new Promise(resolve => setTimeout(resolve, 40 + Math.random() * 30));
          }

          setIsTyping(false);
          await new Promise(resolve => setTimeout(resolve, 2500));
        }
      }
    };

    animateStep();
    setShowParticles(true);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Epic Background Layers */}
      <div className="absolute inset-0">
        {/* Deep space background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-black to-gray-900" />
        
        {/* Cinematic gradient overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${steps[currentStep].color} opacity-20`}
          animate={{
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Animated neural network grid */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <motion.circle
                cx="50"
                cy="50"
                r="1"
                fill={steps[currentStep].particleColor}
                animate={{
                  r: [1, 2, 1],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Epic light rays */}
        <motion.div
          className="absolute top-0 left-1/2 w-[1600px] h-[800px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: `radial-gradient(ellipse at center, ${steps[currentStep].glowColor} 0%, transparent 60%)`,
            filter: "blur(80px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Cinematic lens flare */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            x: "-50%",
            y: "-50%",
          }}
        >
          <div 
            className="w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, ${steps[currentStep].glowColor} 0%, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
        </motion.div>
      </div>

      {/* Premium Particle System */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Energy orbs */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`energy-${i}`}
              className="absolute"
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
              }}
            >
              <motion.div
                className="relative"
                animate={{
                  x: [0, Math.random() * 200 - 100, 0],
                  y: [0, Math.random() * 200 - 100, 0],
                }}
                transition={{
                  duration: Math.random() * 15 + 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5,
                }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${steps[currentStep].lightColor} 0%, ${steps[currentStep].particleColor} 50%, transparent 70%)`,
                    boxShadow: `0 0 40px ${steps[currentStep].glowColor}, 0 0 80px ${steps[currentStep].glowColor}`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* Trailing glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${steps[currentStep].glowColor} 0%, transparent 50%)`,
                    filter: "blur(20px)",
                  }}
                  animate={{
                    scale: [1.5, 2.5, 1.5],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>
          ))}

          {/* Constellation lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.svg
              key={`line-${i}`}
              className="absolute w-full h-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            >
              <motion.line
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke={steps[currentStep].particleColor}
                strokeWidth="1"
                strokeOpacity="0.3"
                animate={{
                  pathLength: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.svg>
          ))}

          {/* Cinematic dust particles */}
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: steps[currentStep].lightColor,
                boxShadow: `0 0 10px ${steps[currentStep].glowColor}`,
              }}
              initial={{
                x: `${Math.random() * 100}%`,
                y: `${120 + Math.random() * 20}%`,
                scale: 0,
              }}
              animate={{
                y: "-20%",
                scale: [0, 1, 0.5, 0],
                opacity: [0, 1, 0.5, 0],
                x: `${Math.random() * 100}%`,
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                delay: Math.random() * 20,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      <div className="container relative z-10 px-4 mx-auto">
        <motion.div 
          className="text-center space-y-20"
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1200,
          }}
        >
          {/* Epic Main Animation Section */}
          <div className="relative h-[300px] sm:h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ 
                  opacity: 0, 
                  scale: 0.5,
                  rotateY: -180,
                  filter: "blur(20px)"
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotateY: 0,
                  filter: "blur(0px)"
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.5,
                  rotateY: 180,
                  filter: "blur(20px)"
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                className="absolute flex flex-col items-center gap-12"
              >
                {/* Cinematic Animation Container */}
                <motion.div
                  className="relative group"
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80">
                    {/* Multiple rotating rings */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(from 0deg, transparent, ${steps[currentStep].lightColor}, ${steps[currentStep].particleColor}, transparent)`,
                        filter: "blur(2px)",
                      }}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    <motion.div
                      className="absolute inset-4 rounded-full"
                      style={{
                        background: `conic-gradient(from 180deg, transparent, ${steps[currentStep].particleColor}, transparent)`,
                        filter: "blur(1px)",
                      }}
                      animate={{
                        rotate: [360, 0],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    
                    {/* Epic inner sphere */}
                    <motion.div 
                      className="absolute inset-8 bg-black/80 backdrop-blur-2xl rounded-full shadow-2xl overflow-hidden"
                      style={{
                        boxShadow: `0 0 100px ${steps[currentStep].glowColor}, inset 0 0 50px ${steps[currentStep].glowColor}`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50" />
                      <motion.div
                        className="absolute inset-0 opacity-50"
                        style={{
                          background: `radial-gradient(circle at 30% 30%, ${steps[currentStep].lightColor}, transparent)`,
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      <div className="relative p-8 h-full flex items-center justify-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 4,
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
                      </div>
                    </motion.div>

                    {/* Energy pulses */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.8, 0, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                      style={{
                        border: `2px solid ${steps[currentStep].particleColor}`,
                        boxShadow: `0 0 50px ${steps[currentStep].glowColor}`,
                      }}
                    />
                  </div>
                </motion.div>
                
                {/* Epic Typography */}
                <div className="relative">
                  <motion.h1 
                    className="text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter"
                    animate={{
                      textShadow: [
                        `0 0 60px ${steps[currentStep].glowColor}`,
                        `0 0 120px ${steps[currentStep].glowColor}`,
                        `0 0 60px ${steps[currentStep].glowColor}`,
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <span className="relative inline-block">
                      <motion.span
                        className={`bg-gradient-to-r ${steps[currentStep].color} bg-clip-text text-transparent`}
                        style={{
                          filter: `drop-shadow(0 4px 20px ${steps[currentStep].glowColor})`,
                        }}
                      >
                        {typedText}
                      </motion.span>
                      {isTyping && (
                        <motion.span
                          className="absolute -right-4 top-0 w-1 h-full"
                          style={{
                            background: `linear-gradient(to bottom, ${steps[currentStep].lightColor}, ${steps[currentStep].particleColor})`,
                            boxShadow: `0 0 30px ${steps[currentStep].glowColor}, 0 0 60px ${steps[currentStep].glowColor}`,
                          }}
                          animate={{ 
                            opacity: [1, 0, 1],
                            scaleY: [1, 0.5, 1]
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                      )}
                    </span>
                  </motion.h1>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Legendary CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="relative group"
          >
            <Link href="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                {/* Button aura */}
                <motion.div
                  className="absolute -inset-4 rounded-full opacity-80"
                  style={{
                    background: `radial-gradient(circle, ${steps[currentStep].glowColor} 0%, transparent 70%)`,
                    filter: "blur(30px)",
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.8, 0.6],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                <Button
                  size="lg"
                  className="relative px-16 py-10 text-3xl font-black rounded-full overflow-hidden bg-white/10 backdrop-blur-xl text-white shadow-2xl transition-all duration-700 border border-white/20 group"
                  style={{
                    boxShadow: `0 30px 100px ${steps[currentStep].glowColor}, inset 0 0 60px rgba(255,255,255,0.1)`,
                  }}
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${steps[currentStep].color})`,
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Epic shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                    animate={{
                      x: ["-200%", "200%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      repeatDelay: 1,
                    }}
                  />
                  
                  {/* Multi-layer pulse effect */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 rounded-full border"
                      style={{
                        borderColor: steps[currentStep].lightColor,
                      }}
                      animate={{
                        scale: [1, 1.5 + i * 0.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                  
                  <span className="relative z-10 flex items-center gap-4 text-white font-black tracking-wider">
                    <motion.span
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      START YOUR JOURNEY
                    </motion.span>
                    <motion.span
                      animate={{
                        x: [0, 10, 0],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-4xl"
                    >
                      ⚡
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Cinematic Subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="relative"
          >
            <motion.p 
              className="text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Experience the future of AI-powered interview preparation
            </motion.p>
            <motion.div 
              className="absolute inset-x-0 -bottom-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                scaleX: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}