'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";

export function Hero() {
  const lines = [
    { text: "Paste a job offer.", color: "from-blue-400 via-indigo-500 to-purple-600" },
    { text: "Upload your resume.", color: "from-emerald-400 via-teal-500 to-cyan-600" },
    { text: "Face our AI recruiter.", color: "from-fuchsia-400 via-purple-500 to-indigo-600" },
    { text: "Get the call.", color: "from-rose-400 via-pink-500 to-purple-600" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Cinematic background effects */}
      <div className="absolute inset-0">
        {/* Dynamic particles */}
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: 0,
            }}
            animate={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Cinematic light rays */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/2 to-transparent"
          initial={{ opacity: 0 }}
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

        {/* Dramatic spotlight effect */}
        <motion.div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Badge with dramatic reveal */}
          <motion.div
            className="relative mx-auto w-fit mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <motion.div
              className="absolute -inset-6 bg-gradient-to-r from-violet-600/30 to-primary/30 rounded-2xl blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative px-8 py-3 bg-background/50 backdrop-blur-xl border border-primary/20 rounded-xl">
              <span className="text-base font-medium bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">
                ✨ Next-Gen Interview Preparation
              </span>
            </div>
          </motion.div>

          {/* Dramatic text reveal */}
          <div className="space-y-6 sm:space-y-8">
            <AnimatePresence>
              {lines.map(({ text, color }, index) => (
                <motion.div
                  key={text}
                  className="overflow-hidden"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.4,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  <h2 className="relative text-center text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight">
                    {/* Text gradient animation */}
                    <motion.span
                      className={`inline-block bg-gradient-to-r ${color} bg-clip-text text-transparent`}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      {text}
                    </motion.span>
                    
                    {/* Animated phone icon for last line */}
                    {index === lines.length - 1 && (
                      <motion.span
                        className="inline-flex ml-4"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 10,
                          delay: lines.length * 0.4,
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, 0, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Phone className="h-12 w-12 md:h-16 md:w-16 text-primary" />
                        </motion.div>
                      </motion.span>
                    )}
                  </h2>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* CTA section with dramatic reveal */}
          <motion.div
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: lines.length * 0.4 + 0.5 }}
          >
            <Link href="/register">
              <Button
                size="lg"
                className="group relative px-8 py-6 text-lg font-semibold rounded-full overflow-hidden bg-primary hover:bg-primary/90"
              >
                {/* Shimmering effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ["-200%", "200%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.span
                  className="relative z-10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Try for free
                </motion.span>
              </Button>
            </Link>

            <Link
              href="#features"
              className="group text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-2"
            >
              <motion.span
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                Learn more
              </motion.span>
              <motion.span
                className="inline-block"
                animate={{ x: [0, 5, 0] }}
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
      </div>
    </div>
  );
}