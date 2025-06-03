'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";

export function Hero() {
  const lines = [
    "Paste a job offer.",
    "Upload your resume.",
    "Face our AI recruiter.",
    "Get the call.",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Gradient background */}
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
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            className="relative inline-block mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
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

          <div className="space-y-8">
            {lines.map((line, index) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.6,
                  ease: "easeOut",
                }}
                className="relative"
              >
                <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                  {line}
                  {index === lines.length - 1 && (
                    <motion.span
                      className="inline-block ml-4"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.6, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Phone className="inline-block h-12 w-12 text-primary" />
                    </motion.span>
                  )}
                </h2>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: lines.length * 0.6 }}
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
      </div>
    </div>
  );
}