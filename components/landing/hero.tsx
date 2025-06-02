"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

export function Hero() {
  const [currentCompany, setCurrentCompany] = useState(0);
  const companies = [
    { name: "Amazon", tooltip: "Wrong..." },
    { name: "Meta", tooltip: "Another time..." },
    { name: "Google", tooltip: "It's getting embarrassing..." },
    { name: "Microsoft", tooltip: "Not quite..." },
    { name: "AI", tooltip: null }
  ];

  useEffect(() => {
    if (currentCompany < companies.length - 1) {
      const timer = setTimeout(() => {
        setCurrentCompany(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentCompany]);

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
            <span className="relative inline-block">
              <AnimatePresence mode="wait">
                {companies.map((company, index) => (
                  index === currentCompany && (
                    <TooltipProvider key={company.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.span
                            className={`inline-block ${
                              company.name === "AI" 
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text border-2 border-purple-500 rounded-lg px-2"
                                : ""
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                          >
                            {company.name}
                          </motion.span>
                        </TooltipTrigger>
                        {company.tooltip && (
                          <TooltipContent>
                            <p>{company.tooltip}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  )
                ))}
              </AnimatePresence>
              {currentCompany < companies.length - 1 && (
                <motion.div
                  className="absolute top-1/2 -right-2 w-0 h-1 bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "120%", x: "100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 1.5 }}
                />
              )}
            </span>
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