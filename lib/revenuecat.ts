import { Purchases } from '@revenuecat/purchases-js';

const WEB_BILLING_API_KEY = process.env.NEXT_PUBLIC_REVENUECAT_API_KEY;

if (!WEB_BILLING_API_KEY) {
  throw new Error('RevenueCat API key is not configured');
}

export const initializeRevenueCat = (userId: string) => {
  if (!Purchases.isConfigured()) {
    return Purchases.configure(WEB_BILLING_API_KEY, userId);
  }
  return Purchases.getSharedInstance();
};

export const checkEntitlement = async (entitlementId: string) => {
  try {
    return await Purchases.getSharedInstance().isEntitledTo(entitlementId);
  } catch (error) {
    console.error('Failed to check entitlement:', error);
    return false;
  }
};

export const getCustomerInfo = async () => {
  try {
    return await Purchases.getSharedInstance().getCustomerInfo();
  } catch (error) {
    console.error('Failed to get customer info:', error);
    throw error;
  }
};

export const getOfferings = async () => {
  try {
    return await Purchases.getSharedInstance().getOfferings();
  } catch (error) {
    console.error('Failed to get offerings:', error);
    throw error;
  }
};