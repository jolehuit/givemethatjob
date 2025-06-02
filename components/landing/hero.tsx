"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, Sparkles } from "lucide-react";

const companies = ["Amazon", "Meta", "Google"];
const tooltips = [
  "Wrong...",
  "You still don't get it...",
  "It's getting long...",
];

export default function Hero() {
  const [currentCompany, setCurrentCompany] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [text, setText] = useState("");
  const [showStrike, setShowStrike] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const animateText = async () => {
      // Type out company name
      const company = companies[currentCompany];
      for (let i = 0; i <= company.length; i++) {
        setText(company.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Show strike-through and tooltip
      setShowStrike(true);
      setShowTooltip(true);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowTooltip(false);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Move to next company or show AI
      if (currentCompany < companies.length - 1) {
        setShowStrike(false);
        setText("");
        setCurrentCompany(prev => prev + 1);
      } else {
        await new Promise(resolve => setTimeout(resolve, 300));
        setShowAI(true);
      }
    };

    if (isTyping && !showAI) {
      timeout = setTimeout(animateText, 300);
    }

    return () => clearTimeout(timeout);
  }, [currentCompany, isTyping, showAI]);

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-1/2 -right-1/2 w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full rounded-full bg-gradient-to-tr from-secondary/20 to-transparent blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-6 py-32 md:py-40 lg:py-48">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8 inline-block"
          >
            <Sparkles className="h-8 w-8 text-primary" />
          </motion.div>

          <motion.h1 
            className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Master Your Job Interviews with{" "}
            <TooltipProvider>
              <Tooltip open={showTooltip}>
                <TooltipTrigger asChild>
                  <span className="relative inline-flex min-w-[120px] justify-center">
                    {!showAI ? (
                      <motion.span 
                        className="relative"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span>{text}</span>
                        <AnimatePresence>
                          {showStrike && (
                            <motion.div
                              className="absolute inset-0 border-t-2 border-primary"
                              initial={{ scaleX: 0, opacity: 0 }}
                              animate={{ scaleX: 1, opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              style={{ top: "50%" }}
                            />
                          )}
                        </AnimatePresence>
                      </motion.span>
                    ) : (
                      <motion.span
                        className="relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent font-bold">
                          AI
                        </span>
                        <motion.div
                          className="absolute -inset-2 border-2 border-purple-400 rounded-lg"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ 
                            scale: [0.8, 1, 0.95, 1],
                            opacity: 1 
                          }}
                          transition={{ 
                            duration: 0.6,
                            ease: "easeOut",
                            times: [0, 0.5, 0.8, 1]
                          }}
                        />
                      </motion.span>
                    )}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  {showAI ? "Really?!" : tooltips[currentCompany]}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {" "}Recruiters
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-lg leading-8 text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Practice with ultra-realistic AI interviewers that give you personalized feedback based on real job descriptions and your CV. Land your dream job faster.
          </motion.p>
          
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 h-12 text-lg">
                Try for free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors">
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
          <div className="relative rounded-xl bg-card/50 backdrop-blur-sm p-2 ring-1 ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <div className="relative aspect-video rounded-md bg-muted/50 shadow-2xl ring-1 ring-white/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-sm text-center">
                  <h3 className="text-xl font-semibold mb-4">Watch Demo</h3>
                  <Button variant="secondary" size="lg" className="rounded-full">
                    Play Video
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