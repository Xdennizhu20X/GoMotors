"use client";

import { useEffect } from 'react';
import { DEFAULT_THEME, generateThemeCSSVars } from '@/config/theme';

/**
 * Theme Provider Component
 * Applies CSS variables from the theme configuration to the document
 */
export function ThemeProvider() {
  useEffect(() => {
    // Generate CSS variables from theme config
    const cssVars = generateThemeCSSVars(DEFAULT_THEME);

    // Apply CSS variables to root element
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        root.style.setProperty(key, value);
      }
    });

    // Apply theme colors to meta tags
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor && DEFAULT_THEME.colors.primary) {
      metaThemeColor.setAttribute('content', DEFAULT_THEME.colors.primary);
    }

    // Cleanup function
    return () => {
      Object.keys(cssVars).forEach((key) => {
        root.style.removeProperty(key);
      });
    };
  }, []);

  return null;
}
