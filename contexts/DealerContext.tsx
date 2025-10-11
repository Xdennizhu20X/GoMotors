"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import apiClient from '@/lib/api-client';
import { DealerConfig, DealerContext, DealerConfiguration } from '@/types/dealer';
import cachedTheme from '@/config/dealer-theme.json';

const DealerContextProvider = createContext<DealerContext | undefined>(undefined);

interface DealerProviderProps {
  children: ReactNode;
  initialIsDealer?: boolean;
  initialSlug?: string;
}

// Apply theme configuration to document
function applyThemeToDocument(configuration?: DealerConfiguration) {
  if (typeof window === 'undefined' || !configuration) return;

  const root = document.documentElement;

  // Apply theme colors
  if (configuration.theme?.colors) {
    const colors = configuration.theme.colors;
    if (colors.primary) root.style.setProperty('--dealer-primary', colors.primary);
    if (colors.secondary) root.style.setProperty('--dealer-secondary', colors.secondary);
    if (colors.accent) root.style.setProperty('--dealer-accent', colors.accent);
    if (colors.success) root.style.setProperty('--dealer-success', colors.success);
    if (colors.warning) root.style.setProperty('--dealer-warning', colors.warning);
    if (colors.error) root.style.setProperty('--dealer-error', colors.error);
  }

  // Apply typography
  if (configuration.theme?.typography) {
    const typography = configuration.theme.typography;
    if (typography.fontSans) root.style.setProperty('--dealer-font-sans', typography.fontSans);
    if (typography.fontHeading) root.style.setProperty('--dealer-font-heading', typography.fontHeading);
    if (typography.fontDisplay) root.style.setProperty('--dealer-font-display', typography.fontDisplay);
    if (typography.fontMono) root.style.setProperty('--dealer-font-mono', typography.fontMono);
  }

  console.log('Theme applied to document:', configuration.theme);
}

export function DealerProvider({ children, initialIsDealer = false, initialSlug }: DealerProviderProps) {
  const [context, setContext] = useState<DealerContext>({
    isDealer: true, // Always true now since each deployment is for one dealer
    dealer: undefined,
    slug: initialSlug,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDealer = async () => {
      try {
        let dealerId = '';

        // Priority 1: NEXT_PUBLIC_DEALER_ID environment variable (for specific deployments)
        const envDealerId = process.env.NEXT_PUBLIC_DEALER_ID;
        if (envDealerId) {
          dealerId = envDealerId;
          console.log('[DealerContext] Using DEALER_ID from env:', dealerId);
        }
        // Priority 2: Server-side slug from middleware
        else if (initialSlug) {
          dealerId = initialSlug;
          console.log('[DealerContext] Using initialSlug from server:', dealerId);
        }
        // Priority 3: Extract from subdomain
        else if (typeof window !== 'undefined') {
          const hostname = window.location.hostname;

          // Check subdomain
          const isProductionDomain = hostname.includes('ruedaya.com');
          const isLocalDomain = hostname.includes('.local');

          if (isProductionDomain || isLocalDomain) {
            const parts = hostname.split('.');
            if (parts.length >= 3) {
              // subdomain.ruedaya.com -> subdomain
              dealerId = parts[0];
              if (dealerId === 'www') {
                dealerId = '';
              }
            }
          }

          console.log('[DealerContext] Detected dealerId from hostname:', dealerId);
        }

        // INSTANT LOAD: Use cached theme first (no API delay)
        if (cachedTheme && cachedTheme.dealer) {
          const dealerData = cachedTheme.dealer;
          const config = cachedTheme;

          // Merge dealer data with configuration
          const completeDealer = {
            ...dealerData,
            configuration: {
              theme: config.theme,
              images: config.images,
              content: config.content,
              social: config.social,
            }
          };

          setContext({
            isDealer: true,
            dealer: completeDealer,
            slug: dealerId || dealerData._id,
          });

          // Apply theme to document IMMEDIATELY
          applyThemeToDocument(completeDealer.configuration);

          console.log('[DealerContext] ⚡ Instant theme loaded from cache');
          setLoading(false);

          // BACKGROUND REFRESH: Optionally fetch fresh data (non-blocking)
          // This ensures theme stays updated without blocking initial render
          if (dealerId) {
            fetchFreshTheme(dealerId);
          }
        }
        // FALLBACK: If no cached theme, fetch from API (legacy behavior)
        else if (dealerId) {
          try {
            const response = await apiClient.getCompleteDealerConfiguration(dealerId);
            if (response.success && response.data) {
              const dealerData = response.data.dealer || response.data;
              const config = response.data;

              // Merge dealer data with configuration
              const completeDealer = {
                ...dealerData,
                configuration: {
                  theme: config.theme,
                  images: config.images,
                  content: config.content,
                  social: config.social,
                }
              };

              setContext({
                isDealer: true,
                dealer: completeDealer,
                slug: dealerId,
              });

              // Apply theme to document
              applyThemeToDocument(completeDealer.configuration);

              console.log('[DealerContext] Dealer configuration loaded from API:', dealerId);
            } else {
              console.error('[DealerContext] Dealer not found:', dealerId);
              setContext({
                isDealer: false,
                dealer: undefined,
                slug: undefined,
              });
            }
          } catch (error) {
            console.error('[DealerContext] Error fetching dealer config:', error);
            setContext({
              isDealer: false,
              dealer: undefined,
              slug: undefined,
            });
          }
          setLoading(false);
        } else {
          console.warn('[DealerContext] No dealer ID found - set NEXT_PUBLIC_DEALER_ID env variable');
          setContext({
            isDealer: false,
            dealer: undefined,
            slug: undefined,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error('[DealerContext] Error initializing dealer context:', error);
        setContext({
          isDealer: false,
          dealer: undefined,
          slug: undefined,
        });
        setLoading(false);
      }
    };

    // Background theme refresh (non-blocking)
    const fetchFreshTheme = async (dealerId: string) => {
      try {
        const response = await apiClient.getCompleteDealerConfiguration(dealerId);
        if (response.success && response.data) {
          const dealerData = response.data.dealer || response.data;
          const config = response.data;

          const completeDealer = {
            ...dealerData,
            configuration: {
              theme: config.theme,
              images: config.images,
              content: config.content,
              social: config.social,
            }
          };

          // Update context with fresh data
          setContext({
            isDealer: true,
            dealer: completeDealer,
            slug: dealerId,
          });

          // Re-apply theme if it changed
          applyThemeToDocument(completeDealer.configuration);

          console.log('[DealerContext] 🔄 Theme refreshed from API (background)');
        }
      } catch (error) {
        console.warn('[DealerContext] Background theme refresh failed (using cache):', error);
        // Silent fail - we already have cached theme loaded
      }
    };

    initializeDealer();
  }, [initialIsDealer, initialSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1341ee]"></div>
      </div>
    );
  }

  return (
    <DealerContextProvider.Provider value={context}>
      {children}
    </DealerContextProvider.Provider>
  );
}

export function useDealer() {
  const context = useContext(DealerContextProvider);
  if (context === undefined) {
    throw new Error('useDealer must be used within a DealerProvider');
  }
  return context;
}