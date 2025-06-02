"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCard } from "@/components/subscription/subscription-card";
import { SubscriptionStatus } from "@/components/subscription/subscription-status";
import { Separator } from "@/components/ui/separator";
import { initializeRevenueCat, getCustomerInfo } from "@/lib/revenuecat";
import { supabase } from "@/lib/supabase";

const subscriptionPlans = [
  {
    name: "Free",
    description: "Basic interview practice to get started",
    price: "Free",
    packageId: "free",
    features: [
      "2 practice interviews per month",
      "Basic interview feedback",
      "General AI avatars",
      "Standard question library",
    ],
  },
  {
    name: "Pro",
    description: "For serious job seekers who want to stand out",
    price: "€9.99",
    packageId: "pro",
    features: [
      "Unlimited interviews",
      "Detailed performance analytics",
      "Personalized question generation",
      "Multiple AI interviewer personas",
      "Interview recording and playback",
      "Tailored improvement plan",
    ],
    isPopular: true,
  },
  {
    name: "Team",
    description: "For career coaches and HR teams",
    price: "€99",
    packageId: "team",
    features: [
      "Everything in Pro",
      "Up to 20 user accounts",
      "Team performance analytics",
      "Custom interview templates",
      "API access",
      "White-label option",
      "Dedicated support",
    ],
  },
];

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeSubscriptions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        initializeRevenueCat(user.id);
        const customerInfo = await getCustomerInfo();
        
        if (customerInfo.entitlements.active["premium"]) {
          setCurrentPlan("pro");
        } else if (customerInfo.entitlements.active["team"]) {
          setCurrentPlan("team");
        } else {
          setCurrentPlan("free");
        }
      } catch (error) {
        console.error("Failed to initialize subscriptions:", error);
      }
    };

    initializeSubscriptions();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing & Subscription</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <SubscriptionStatus />
      
      <Separator />

      <div>
        <h3 className="text-xl font-semibold mb-6">Available Plans</h3>
        <div className="grid gap-6 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.packageId}
              {...plan}
              isCurrentPlan={currentPlan === plan.packageId}
            />
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Billing History</h3>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your billing history and upcoming charges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center py-8">
              No transactions to display
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}