{
  "use client";

  import { useEffect, useState } from "react";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { Button } from "@/components/ui/button";
  import { getCustomerInfo, getOfferings, initializeRevenueCat } from "@/lib/revenuecat";
  import { Loader2 } from "lucide-react";
  import { useRouter } from "next/navigation";
  import { toast } from "sonner";
  import { supabase } from "@/lib/supabase";
  import { Purchases } from "@revenuecat/purchases-js";

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
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            throw new Error('User not authenticated');
          }

          await initializeRevenueCat(user.id);
          const info = await getCustomerInfo();
          setCustomerInfo(info);
        } catch (error) {
          console.error("Failed to fetch subscription status:", error);
          toast.error("Failed to load subscription information");
        } finally {
          setIsLoading(false);
        }
      };

      fetchCustomerInfo();
    }, []);

    const handleUpgrade = async () => {
      if (isUpgrading) return;
      
      setIsUpgrading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        await initializeRevenueCat(user.id);
        const offerings = await Purchases.getSharedInstance().getOfferings();
        
        if (!offerings?.current) {
          throw new Error('No subscription offerings available');
        }

        const package_ = offerings.current.monthly;
        if (!package_) {
          throw new Error('Monthly subscription package not found');
        }

        const { customerInfo: updatedInfo } = await Purchases.getSharedInstance().purchase({
          rcPackage: package_,
        });

        if (updatedInfo.entitlements.active["premium"]) {
          setCustomerInfo(updatedInfo);
          toast.success("Successfully upgraded to Pro!");
          router.refresh();
        }
      } catch (error: any) {
        if (error.code === Purchases.ErrorCode.UserCancelledError) {
          return;
        }
        console.error("Failed to upgrade subscription:", error);
        toast.error(error.message || "Failed to upgrade subscription");
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
              <p className="font-medium">{isPremium ? "Pro" : "Free"} Plan</p>
              {isPremium && expirationDate && (
                <p className="text-sm text-muted-foreground">
                  Renews on {new Date(expirationDate).toLocaleDateString()}
                </p>
              )}
            </div>
            {!isPremium && (
              <Button 
                variant="default"
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
                  "Upgrade to Pro"
                )}
              </Button>
            )}
          </div>

          {!isPremium && (
            <div className="rounded-md bg-primary/10 p-4">
              <p className="text-sm">
                Upgrade to Pro to unlock unlimited interviews and advanced features.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}