/**
 * YoGo 有夠菜 - Firebase Analytics Helper
 * Provides seamless event logging for both development debugging and production Firebase tracking.
 */

declare global {
  interface Window {
    firebase?: any;
    gtag?: (...args: any[]) => void;
  }
}

export function logAnalyticsEvent(eventName: string, params: Record<string, any> = {}): void {
  // 1. Log to console for local development verification (Wow factor!)
  console.log(`📊 [Analytics Event] ${eventName}:`, params);

  // 2. Log to real Firebase SDK if initialized
  try {
    if (window.firebase && window.firebase.analytics) {
      window.firebase.analytics().logEvent(eventName, params);
    } else if (window.gtag) {
      window.gtag('event', eventName, params);
    }
  } catch (err) {
    console.error('Failed to log event to Firebase Analytics SDK:', err);
  }
}
