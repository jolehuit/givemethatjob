"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Quote, Star, Sparkles } from "lucide-react";

const testimonials = [
  {
    content:
      "I was nervous about my tech interview, but after practicing with GiveMeThatJob, I felt so much more confident. The AI asked me the exact type of questions I got in my real interview. I got the job!",
    author: "Sarah Johnson",
    role: "Software Engineer at Google",
    rating: 5,
    color: "from-blue-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  {
    content:
      "The feedback I received was incredibly detailed. It pointed out speech patterns I wasn't aware of and helped me refine my answers. Worth every penny.",
    author: "Mark Thompson",
    role: "Product Manager at Microsoft",
    rating: 5,
    color: "from-purple-500 to-pink-500",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  {
    content:
      "As someone with interview anxiety, this tool was a game-changer. Being able to practice with an AI that feels so real helped me overcome my nervousness.",
    author: "Jessica Chen",
    role: "Marketing Director at Adobe",
    rating: 5,
    color: "from-orange-500 to-amber-500",
    glow: "rgba(251, 146, 60, 0.4)",
  },
  {
    content:
      "Our HR team uses the Team plan to pre-screen candidates and help them prepare. It's improved our hiring process and candidate experience dramatically.",
    author: "Robert Garcia",
    role: "Head of Talent at Spotify",
    rating: 5,
    color: "from-emerald-500 to-teal-500",
    glow: "rgba(52, 211, 153, 0.4)",
  },
];

export function Testimonials() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div id="testimonials" className="relative bg-background py-24 sm:py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:100px_100px]" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px]"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px]"
          style={{
            background: "radial-gradient(circle, rgba(52, 211, 153, 0.1) 0%, transparent 50%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 10
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8" ref={ref}>
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-lg font-semibold leading-8 tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 100%",
            }}
          >
            Testimonials
          </motion.h2>
          <motion.p 
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Hear from our successful users
          </motion.p>
        </motion.div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative"
            >
              {/* Card glow effect */}
              <motion.div
                className="absolute -inset-4 rounded-2xl opacity-0"
                style={{
                  background: `radial-gradient(circle at center, ${testimonial.glow} 0%, transparent 60%)`,
                  filter: "blur(30px)",
                }}
                animate={{
                  opacity: hoveredIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              
              <Card className="relative h-full shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-sm border-border/50 hover:border-border">
                {/* Gradient border on hover */}
                <motion.div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-br ${testimonial.color} opacity-0`}
                  animate={{
                    opacity: hoveredIndex === index ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <CardContent className="relative p-6 flex flex-col justify-between h-full">
                  <div>
                    {/* Quote icon with animation */}
                    <motion.div
                      className="mb-4"
                      animate={hoveredIndex === index ? {
                        rotate: [0, 10, -10, 0],
                      } : {}}
                      transition={{
                        duration: 0.5,
                        ease: "easeInOut"
                      }}
                    >
                      <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${testimonial.color} opacity-10`}>
                        <Quote className="h-6 w-6 text-foreground" />
                      </div>
                    </motion.div>
                    
                    {/* Star rating */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ 
                            duration: 0.5, 
                            delay: 0.5 + index * 0.1 + i * 0.05,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <Star className="h-4 w-4 fill-primary text-primary" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <p className="text-foreground leading-relaxed">"{testimonial.content}"</p>
                  </div>
                  
                  <motion.div 
                    className="mt-6 border-t border-border pt-4"
                    animate={{
                      borderColor: hoveredIndex === index 
                        ? "hsl(var(--primary) / 0.3)" 
                        : "hsl(var(--border))",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-x-4">
                      <motion.div 
                        className={`relative h-12 w-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-semibold`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {testimonial.author.charAt(0)}
                        
                        {/* Pulse effect on hover */}
                        {hoveredIndex === index && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: `radial-gradient(circle, ${testimonial.glow} 0%, transparent 70%)`,
                            }}
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 0, 0.5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeOut"
                            }}
                          />
                        )}
                      </motion.div>
                      
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          {testimonial.author}
                          {hoveredIndex === index && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <Sparkles className="h-4 w-4 text-primary" />
                            </motion.span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}