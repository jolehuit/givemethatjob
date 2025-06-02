"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCard } from "@/components/subscription/subscription-card";
import { SubscriptionStatus } from "@/components/subscription/subscription-status";
import { Separator } from "@/components/ui/separator";
import { initializeRevenueCat, getCustomerInfo } from "@/lib/revenuecat";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const subscriptionPlans = [
  {
    name: "Free",
    id: "tier-free",
    monthlyPrice: "0€",
    annualPrice: "0€",
    description: "Basic interview practice to get started",
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
    id: "tier-pro",
    monthlyPrice: "9.99€",
    annualPrice: "95.88€", // 20% discount
    description: "For serious job seekers who want to stand out",
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
    id: "tier-team",
    monthlyPrice: "99€",
    annualPrice: "950.40€", // 20% discount
    description: "For career coaches and HR teams",
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
  const [isLoading, setIsLoading] = useState(true);
  const [annualBilling, setAnnualBilling] = useState(true);
  
  useEffect(() => {
    const initializeSubscriptions = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Please sign in to manage your subscription");
          return;
        }

        await initializeRevenueCat(user.id);
        const customerInfo = await getCustomerInfo();
        
        if (customerInfo?.entitlements.active["premium"]) {
          setCurrentPlan("pro");
        } else if (customerInfo?.entitlements.active["team"]) {
          setCurrentPlan("team");
        } else {
          setCurrentPlan("free");
        }
      } catch (error: any) {
        console.error("Failed to initialize subscriptions:", error);
        toast.error("Failed to load subscription information");
      } finally {
        setIsLoading(false);
      }
    };

    initializeSubscriptions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Available Plans</h3>
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <button
              onClick={() => setAnnualBilling(false)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                !annualBilling ? 'bg-background shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnualBilling(true)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                annualBilling ? 'bg-background shadow-sm' : 'text-muted-foreground'
              }`}
            >
              Annually <span className="text-primary">-20%</span>
            </button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.packageId}
              {...plan}
              isCurrentPlan={currentPlan === plan.packageId}
              annualBilling={annualBilling}
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