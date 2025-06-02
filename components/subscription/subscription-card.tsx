"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Purchases } from "@revenuecat/purchases-js";
import { supabase } from "@/lib/supabase";

interface SubscriptionCardProps {
  name: string;
  description: string;
  monthlyPrice: string;
  annualPrice: string;
  features: string[];
  packageId: string;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  annualBilling?: boolean;
}

export function SubscriptionCard({
  name,
  description,
  monthlyPrice,
  annualPrice,
  features,
  packageId,
  isPopular,
  isCurrentPlan,
  annualBilling = false,
}: SubscriptionCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to subscribe");
        return;
      }
      
      const offerings = await Purchases.getSharedInstance().getOfferings();
      if (!offerings?.current) {
        throw new Error("No subscription offerings available");
      }

      const package_ = annualBilling 
        ? offerings.current.annual 
        : offerings.current.monthly;

      if (!package_) {
        throw new Error("Selected subscription package not found");
      }

      const { customerInfo } = await Purchases.getSharedInstance().purchase({
        rcPackage: package_,
      });

      if (customerInfo.entitlements.active[packageId]) {
        toast.success("Successfully subscribed!");
        router.refresh();
      }
    } catch (error: any) {
      if (error.code === Purchases.ErrorCode.UserCancelledError) {
        return;
      }
      console.error("Subscription error:", error);
      toast.error(error.message || "Failed to process subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`flex flex-col ${isPopular ? 'border-primary shadow-lg relative' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-sm text-primary-foreground">
          Most Popular
        </div>
      )}
      
      <CardHeader className="flex-none">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold">
              {annualBilling ? annualPrice : monthlyPrice}
            </span>
            <span className="ml-1 text-muted-foreground">
              /{annualBilling ? 'year' : 'month'}
            </span>
          </div>
          {annualBilling && packageId !== 'free' && (
            <p className="text-sm text-muted-foreground mt-1">
              {monthlyPrice} monthly when billed annually
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="flex-none pt-6">
        <Button 
          className="w-full" 
          variant={isPopular ? "default" : "outline"}
          onClick={handleSubscribe}
          disabled={isLoading || isCurrentPlan || packageId === 'free'}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            "Current Plan"
          ) : packageId === 'free' ? (
            "Free Plan"
          ) : (
            "Subscribe"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}