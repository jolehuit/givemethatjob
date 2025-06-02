'use client';

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

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
  },
];

export function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <div id="pricing" className="py-24 bg-secondary/50 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Choose the plan that works best for your needs. All plans include access to our AI interview platform.
          </p>
        </div>
        
        <div className="flex justify-center mt-8">
          <div className="relative flex rounded-full bg-muted p-1">
            <button
              type="button"
              className={`relative rounded-full py-2 px-6 text-sm font-semibold ${
                !annualBilling 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => setAnnualBilling(false)}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`relative rounded-full py-2 px-6 text-sm font-semibold ${
                annualBilling 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground'
              }`}
              onClick={() => setAnnualBilling(true)}
            >
              Annually <span className="text-primary">-20%</span>
            </button>
          </div>
        </div>
        
        <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card 
              key={tier.id} 
              className={`flex flex-col justify-between border ${
                tier.mostPopular 
                  ? 'relative border-primary shadow-lg' 
                  : 'border-border'
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-bold tracking-tight">
                    {annualBilling ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  <span className="ml-1 text-muted-foreground">
                    {annualBilling ? '/year' : '/month'}
                  </span>
                </div>
                {annualBilling && tier.id !== 'tier-free' && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {`${tier.monthlyPrice} monthly when billed annually`}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={tier.id === "tier-free" ? "/register" : "/settings/billing"} className="w-full">
                  <Button 
                    variant={tier.mostPopular ? "default" : "outline"}
                    className="w-full"
                  >
                    {tier.id === "tier-free" ? "Get started" : "Subscribe"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}