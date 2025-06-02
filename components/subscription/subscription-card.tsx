"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Purchases } from "@revenuecat/purchases-js";

interface SubscriptionCardProps {
  name: string;
  description: string;
  price: string;
  features: string[];
  packageId: string;
  isPopular?: boolean;
  isCurrentPlan?: boolean;
}

export function SubscriptionCard({
  name,
  description,
  price,
  features,
  packageId,
  isPopular,
  isCurrentPlan,
}: SubscriptionCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      const offerings = await Purchases.getSharedInstance().getOfferings();
      const package_ = offerings.all[packageId]?.monthly;
      
      if (!package_) {
        throw new Error("Package not found");
      }

      const { customerInfo } = await Purchases.getSharedInstance().purchase({
        rcPackage: package_,
      });

      if (customerInfo.entitlements.active["premium"]) {
        toast.success("Successfully subscribed!");
      }
    } catch (error: any) {
      if (error.code === Purchases.ErrorCode.UserCancelledError) {
        return;
      }
      toast.error(error.message || "Failed to process subscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`flex flex-col ${isPopular ? 'border-primary shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-sm text-primary-foreground">
          Most Popular
        </div>
      )}
      
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-muted-foreground">/month</span>}
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
      
      <CardFooter>
        <Button 
          className="w-full" 
          variant={isPopular ? "default" : "outline"}
          onClick={handleSubscribe}
          disabled={isLoading || isCurrentPlan}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isCurrentPlan ? (
            "Current Plan"
          ) : (
            "Subscribe"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}