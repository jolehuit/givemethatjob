"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCustomerInfo } from "@/lib/revenuecat";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface CustomerInfo {
  entitlements: {
    active: {
      [key: string]: {
        identifier: string;
        isActive: boolean;
        willRenew: boolean;
        expirationDate: Date | null;
      };
    };
  };
}

export function SubscriptionStatus() {
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      try {
        const info = await getCustomerInfo();
        setCustomerInfo(info);
      } catch (error) {
        console.error("Failed to fetch subscription status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerInfo();
  }, []);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      router.push("/settings/billing#pricing");
    } catch (error) {
      console.error("Failed to initiate upgrade:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const isPremium = customerInfo?.entitlements.active["premium"]?.isActive;
  const expirationDate = customerInfo?.entitlements.active["premium"]?.expirationDate;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>
          Your current subscription plan and status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{isPremium ? "Premium" : "Free"} Plan</p>
            {isPremium && expirationDate && (
              <p className="text-sm text-muted-foreground">
                Renews on {new Date(expirationDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleUpgrade}
            disabled={isUpgrading}
          >
            {isUpgrading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upgrade Plan"
            )}
          </Button>
        </div>

        {!isPremium && (
          <div className="rounded-md bg-primary/10 p-4">
            <p className="text-sm">
              Upgrade to Premium to unlock unlimited interviews and advanced features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}