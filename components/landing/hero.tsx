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

const companies = ["Amazon", "Meta", "Google"];
const tooltips = [
  "Wrong...",
  "You still don't get it...",
  "It's getting long...",
];

export function Hero() {
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
        await new Promise(resolve => setTimeout(resolve, 50)); // Faster typing
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
                        <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
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
            className="mt-6 text-lg leading-8 text-muted-foreground"
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
              <Button size="lg" className="rounded-full px-8">
                Try for free
              </Button>
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-foreground">
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