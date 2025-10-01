'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { initializeAnalytics, trackPageView } from '@/lib/analytics';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize analytics on mount with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        initializeAnalytics();
        setIsInitialized(true);
      } catch (error) {
        console.warn('Analytics initialization failed:', error);
      }
    }, 1000); // Wait 1 second for GA to load

    return () => clearTimeout(timer);
  }, []);

  // Track page views on route changes, but only after initialization
  useEffect(() => {
    if (pathname && isInitialized) {
      try {
        trackPageView(pathname);
      } catch (error) {
        console.warn('Page view tracking failed:', error);
      }
    }
  }, [pathname, isInitialized]);

  return <>{children}</>;
}