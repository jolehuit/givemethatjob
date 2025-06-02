'use client';

import {
  BadgeCheck,
  Brain,
  FileVideo,
  BarChart3,
  Upload,
  Mic,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    name: "Personalized Interviews",
    description:
      "AI generates questions based on the specific job description and your CV for a tailored experience.",
    icon: Brain,
  },
  {
    name: "Video Interviews",
    description:
      "Practice with realistic AI avatar interviewers that respond to your answers in real-time.",
    icon: FileVideo,
  },
  {
    name: "Detailed Feedback",
    description:
      "Receive comprehensive feedback on your performance, with specific tips for improvement.",
    icon: BarChart3,
  },
  {
    name: "One-Click Setup",
    description:
      "Just paste a job URL and upload your CV to start practicing immediately.",
    icon: Upload,
  },
  {
    name: "Natural Voice Interaction",
    description:
      "AI interviewers use natural-sounding voices that make the experience feel real.",
    icon: Mic,
  },
  {
    name: "Unlimited Practice",
    description:
      "Practice as many times as you need to perfect your interview skills.",
    icon: Clock,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function Features() {
  return (
    <div id="features" className="py-24 bg-background sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-base font-semibold leading-7 text-primary">Better Preparation</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need to ace your next interview
            </p>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Our AI-powered platform helps you prepare for interviews with realistic practice sessions, personalized feedback, and targeted improvement suggestions.
            </p>
          </motion.div>
        </div>
        
        <motion.div
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                className="relative bg-card/50 backdrop-blur-sm rounded-2xl p-8 hover:bg-card/80 transition-colors"
                variants={itemVariants}
              >
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
}