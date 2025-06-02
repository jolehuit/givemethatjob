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

export function Features() {
  return (
    <div id="features" className="py-24 bg-background sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Better Preparation</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to ace your next interview
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Our AI-powered platform helps you prepare for interviews with realistic practice sessions, personalized feedback, and targeted improvement suggestions.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-foreground">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}