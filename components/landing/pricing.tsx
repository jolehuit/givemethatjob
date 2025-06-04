'use client';

import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const tiers = [
  {
    name: "Free",
    id: "tier-free",
    monthlyPrice: "0€",
    annualPrice: "0€",
    description: "Basic interview practice to get started.",
    features: [
      "2 practice interviews per month",
      "Basic interview feedback",
      "General AI avatars",
      "Standard question library",
    ],
    mostPopular: false,
    color: "from-gray-500 to-gray-600",
    glow: "rgba(107, 114, 128, 0.5)",
  },
  {
    name: "Pro",
    id: "tier-pro",
    monthlyPrice: "9.99€",
    annualPrice: "95.88€",
    description: "For serious job seekers who want to stand out.",
    features: [
      "Unlimited interviews",
      "Detailed performance analytics",
      "Personalized question generation",
      "Multiple AI interviewer personas",
      "Interview recording and playback",
      "Tailored improvement plan"
    ],
    mostPopular: true,
    color: "from-purple-500 to-pink-500",
    glow: "rgba(168, 85, 247, 0.5)",
  },
  {
    name: "Team",
    id: "tier-team",
    monthlyPrice: "99€",
    annualPrice: "950.40€",
    description: "For career coaches and HR teams.",
    features: [
      "Everything in Pro",
      "Up to 20 user accounts",
      "Team performance analytics",
      "Custom interview templates",
      "API access",
      "White-label option",
      "Dedicated support"
    ],
    mostPopular: false,
    color: "from-blue-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.5)",
  },
];

export function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true);
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  return (
    <div id="pricing" className="relative py-24 bg-secondary/50 sm:py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.2)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.2)_1px,transparent_1px)] bg-[size:80px_80px]" />
        
        <motion.div
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px]"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px]"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -100, 0],
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

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl sm:text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the plan that works best for your needs. All plans include access to our AI interview platform.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex rounded-full bg-muted/50 backdrop-blur-sm p-1 border border-border/50">
            <motion.div
              className="absolute rounded-full"
              initial={false}
              animate={{
                x: annualBilling ? "100%" : "0%",
                width: annualBilling ? "58%" : "42%",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{
                height: "calc(100% - 8px)",
                top: "4px",
                left: "4px",
                background: "linear-gradient(to right, var(--primary), var(--primary))",
                opacity: 0.1,
              }}
            />
            <button
              type="button"
              className={`relative rounded-full py-2 px-6 text-sm font-semibold transition-all ${
                !annualBilling 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setAnnualBilling(false)}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`relative rounded-full py-2 px-6 text-sm font-semibold transition-all ${
                annualBilling 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setAnnualBilling(true)}
            >
              Annually <span className="text-primary">-20%</span>
            </button>
          </div>
        </motion.div>
        
        <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              onMouseEnter={() => setHoveredTier(tier.id)}
              onMouseLeave={() => setHoveredTier(null)}
              className="relative"
            >
              {/* Card Glow */}
              <motion.div
                className="absolute -inset-4 rounded-2xl opacity-0"
                style={{
                  background: `radial-gradient(circle at center, ${tier.glow} 0%, transparent 60%)`,
                  filter: "blur(40px)",
                }}
                animate={{
                  opacity: hoveredTier === tier.id ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
              
              <Card 
                className={`relative flex flex-col justify-between h-full backdrop-blur-sm border transition-all duration-300 ${
                  tier.mostPopular 
                    ? "border-primary shadow-xl scale-105" 
                    : "border-border/50 hover:border-border"
                } ${hoveredTier === tier.id ? "translate-y-[-4px]" : ""}`}
                style={{
                  background: tier.mostPopular 
                    ? "linear-gradient(to bottom, hsl(var(--background)/0.95), hsl(var(--background)/0.98))"
                    : "hsl(var(--background)/0.8)",
                }}
              >
                {tier.mostPopular && (
                  <motion.div 
                    className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                    <Sparkles className="w-3 h-3" />
                  </motion.div>
                )}
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className={`text-2xl bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                      {tier.name}
                    </span>
                  </CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={annualBilling ? "annual" : "monthly"}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-baseline"
                      >
                        <span className="text-4xl font-bold tracking-tight">
                          {annualBilling ? tier.annualPrice : tier.monthlyPrice}
                        </span>
                        <span className="ml-1 text-muted-foreground">
                          {annualBilling ? "/year" : "/month"}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                    {annualBilling && tier.id !== "tier-free" && (
                      <motion.p 
                        className="text-sm text-muted-foreground mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {`${tier.monthlyPrice} monthly when billed annually`}
                      </motion.p>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={feature} 
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: 0.5 + featureIndex * 0.05 
                        }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 180 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Check className={`h-5 w-5 flex-shrink-0 bg-gradient-to-r ${tier.color} bg-clip-text`} style={{ color: "transparent", WebkitTextFillColor: "transparent" }} />
                        </motion.div>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Link href={tier.id === "tier-free" ? "/register" : "/settings/billing"} className="w-full">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full"
                    >
                      <Button 
                        variant={tier.mostPopular ? "default" : "outline"}
                        className={`w-full relative overflow-hidden ${
                          tier.mostPopular ? "shadow-lg" : ""
                        }`}
                      >
                        {/* Button shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                          animate={hoveredTier === tier.id ? {
                            x: ["-200%", "200%"],
                          } : {}}
                          transition={{
                            duration: 1,
                            ease: "easeInOut",
                          }}
                        />
                        <span className="relative z-10">
                          {tier.id === "tier-free" ? "Get started" : "Subscribe"}
                        </span>
                      </Button>
                    </motion.div>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}