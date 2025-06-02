import { Purchases } from '@revenuecat/purchases-js';

const WEB_BILLING_API_KEY = process.env.REVENUECAT_API_KEY;

export const initializeRevenueCat = async (userId: string) => {
  try {
    if (!WEB_BILLING_API_KEY) {
      console.error('RevenueCat API key not configured');
      return null;
    }

    if (!Purchases.isConfigured()) {
      return Purchases.configure(WEB_BILLING_API_KEY, userId);
    }
    return Purchases.getSharedInstance();
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    return null;
  }
};

export const checkEntitlement = async (entitlementId: string) => {
  try {
    const purchases = await initializeRevenueCat(entitlementId);
    if (!purchases) return false;
    return await purchases.isEntitledTo(entitlementId);
  } catch (error) {
    console.error('Failed to check entitlement:', error);
    return false;
  }
};

export const getCustomerInfo = async () => {
  try {
    const purchases = await Purchases.getSharedInstance();
    return await purchases.getCustomerInfo();
  } catch (error) {
    console.error('Failed to get customer info:', error);
    return null;
  }
};

export const getOfferings = async () => {
  try {
    const purchases = await Purchases.getSharedInstance();
    return await purchases.getOfferings();
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return null;
  }
};