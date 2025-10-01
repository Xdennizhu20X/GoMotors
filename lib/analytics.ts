/**
 * Google Analytics 4 and Custom Analytics Utilities for RUEDA YA!
 * Handles both GA4 tracking and custom backend analytics
 */

// TypeScript declarations for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date | { [key: string]: any },
      config?: { [key: string]: any }
    ) => void;
    dataLayer?: any[];
  }
}

import apiClient from './api-client';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Helper function to safely call gtag
const safeGtag = (command: any, targetId: any, config?: any) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function' && GA_TRACKING_ID) {
    if (config !== undefined) {
      window.gtag(command, targetId, config);
    } else {
      window.gtag(command, targetId);
    }
  }
};

// Initialize GA4 (this is handled by @next/third-parties/google automatically)
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    console.log('Google Analytics initialized with ID:', GA_TRACKING_ID);
  }
};

// Page view tracking
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // GA4 page view
    safeGtag('config', GA_TRACKING_ID, {
      page_path: path,
      page_title: title || document.title,
    });

    // Send to backend
    sendAnalyticsToBackend('page_view', {
      page_path: path,
      page_title: title || document.title,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer,
    });
  }
};

// Generic event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParams?: { [key: string]: any }
) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // GA4 event
    safeGtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
      ...customParams,
    });

    // Send to backend
    sendAnalyticsToBackend('event', {
      action,
      category,
      label,
      value,
      ...customParams,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  }
};

// E-commerce specific events
export const trackPurchase = (transactionData: {
  transaction_id: string;
  value: number;
  currency: string;
  items: Array<{
    item_id: string;
    item_name: string;
    item_category: string;
    item_brand: string;
    price: number;
    quantity: number;
  }>;
  payment_method?: string;
  dealer_id?: string;
  dealer_name?: string;
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // GA4 purchase event
    safeGtag('event', 'purchase', {
      transaction_id: transactionData.transaction_id,
      value: transactionData.value,
      currency: transactionData.currency,
      items: transactionData.items,
    });

    // Send detailed data to backend
    sendAnalyticsToBackend('purchase', {
      ...transactionData,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  }
};

export const trackViewItem = (itemData: {
  item_id: string;
  item_name: string;
  item_category: string;
  item_brand: string;
  price: number;
  currency: string;
  dealer_id?: string;
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // GA4 view_item event
    safeGtag('event', 'view_item', {
      currency: itemData.currency,
      value: itemData.price,
      items: [{
        item_id: itemData.item_id,
        item_name: itemData.item_name,
        item_category: itemData.item_category,
        item_brand: itemData.item_brand,
        price: itemData.price,
        quantity: 1,
      }],
    });

    // Send to backend
    sendAnalyticsToBackend('view_item', {
      ...itemData,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  }
};

export const trackAddToWishlist = (itemData: {
  item_id: string;
  item_name: string;
  item_category: string;
  item_brand: string;
  price: number;
  currency: string;
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // GA4 add_to_wishlist event
    safeGtag('event', 'add_to_wishlist', {
      currency: itemData.currency,
      value: itemData.price,
      items: [{
        item_id: itemData.item_id,
        item_name: itemData.item_name,
        item_category: itemData.item_category,
        item_brand: itemData.item_brand,
        price: itemData.price,
        quantity: 1,
      }],
    });

    // Send to backend
    sendAnalyticsToBackend('add_to_wishlist', {
      ...itemData,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  }
};

export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // GA4 search event
    safeGtag('event', 'search', {
      search_term: searchTerm,
    });

    // Send to backend
    sendAnalyticsToBackend('search', {
      search_term: searchTerm,
      results_count: resultsCount,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  }
};

export const trackUserEngagement = (engagementData: {
  action: 'scroll' | 'time_spent' | 'click' | 'form_interaction';
  value?: number;
  element?: string;
  additional_data?: { [key: string]: any };
}) => {
  if (typeof window !== 'undefined') {
    // GA4 user engagement
    if (GA_TRACKING_ID) {
      safeGtag('event', 'user_engagement', {
        engagement_time_msec: engagementData.value || 0,
      });
    }

    // Send to backend
    sendAnalyticsToBackend('user_engagement', {
      ...engagementData,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  }
};

// Lead generation tracking
export const trackLead = (leadData: {
  lead_type: 'contact_form' | 'phone_call' | 'email' | 'chat';
  value?: number;
  currency?: string;
  source?: string;
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // GA4 generate_lead event
    safeGtag('event', 'generate_lead', {
      currency: leadData.currency || 'USD',
      value: leadData.value || 0,
    });

    // Send to backend
    sendAnalyticsToBackend('generate_lead', {
      ...leadData,
      timestamp: new Date().toISOString(),
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
    });
  }
};

// Custom backend analytics function
const sendAnalyticsToBackend = async (eventType: string, eventData: any) => {
  try {
    // Only send analytics if not in development or if explicitly enabled
    if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_ENABLE_ANALYTICS_IN_DEV) {
      console.log('Analytics event (dev mode):', eventType, eventData);
      return;
    }

    const analyticsPayload = {
      event_type: eventType,
      event_data: eventData,
      session_id: getSessionId(),
      user_id: getUserId(),
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      page_referrer: document.referrer,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
    };

    // Send to backend (fire-and-forget, don't block the UI)
    apiClient.sendAnalyticsEvent(analyticsPayload).catch((error) => {
      console.warn('Failed to send analytics to backend:', error);
    });

  } catch (error) {
    console.warn('Analytics error:', error);
  }
};

// Session management
const getSessionId = (): string => {
  if (typeof window === 'undefined') return '';

  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// User ID management (if user is logged in)
const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Try to get user ID from localStorage (set by auth system)
  const authToken = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  if (user) {
    try {
      const userData = JSON.parse(user);
      return userData.id || userData._id || null;
    } catch {
      return null;
    }
  }

  return null;
};

// Utility functions for specific RUEDA YA! use cases
export const trackVehicleInteraction = (action: string, vehicleData: {
  vehicle_id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  dealer_id?: string;
}) => {
  trackEvent(action, 'vehicle_interaction', `${vehicleData.brand} ${vehicleData.model}`, vehicleData.price, {
    vehicle_id: vehicleData.vehicle_id,
    vehicle_brand: vehicleData.brand,
    vehicle_model: vehicleData.model,
    vehicle_year: vehicleData.year,
    vehicle_price: vehicleData.price,
    dealer_id: vehicleData.dealer_id,
  });
};

export const trackDealerInteraction = (action: string, dealerData: {
  dealer_id: string;
  dealer_name: string;
  location: string;
}) => {
  trackEvent(action, 'dealer_interaction', dealerData.dealer_name, undefined, {
    dealer_id: dealerData.dealer_id,
    dealer_name: dealerData.dealer_name,
    dealer_location: dealerData.location,
  });
};

export const trackFinancingInteraction = (action: string, financingData: {
  loan_amount: number;
  down_payment: number;
  loan_terms: number;
  monthly_payment: number;
  vehicle_id?: string;
}) => {
  trackEvent(action, 'financing_interaction', action, financingData.loan_amount, {
    loan_amount: financingData.loan_amount,
    down_payment: financingData.down_payment,
    loan_terms: financingData.loan_terms,
    monthly_payment: financingData.monthly_payment,
    vehicle_id: financingData.vehicle_id,
  });
};

// Initialize analytics on app load
export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    initGA();

    // Track initial page view
    trackPageView(window.location.pathname);

    // Set up automatic scroll tracking
    let maxScroll = 0;
    const trackScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
        maxScroll = scrollPercent;
        trackUserEngagement({
          action: 'scroll',
          value: scrollPercent,
          additional_data: { scroll_depth: scrollPercent }
        });
      }
    };

    window.addEventListener('scroll', trackScroll, { passive: true });

    // Track time spent on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
      const timeSpent = Date.now() - startTime;
      trackUserEngagement({
        action: 'time_spent',
        value: timeSpent,
        additional_data: { time_spent_ms: timeSpent }
      });
    });
  }
};