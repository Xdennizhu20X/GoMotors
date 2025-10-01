import { useDealer } from '@/contexts/DealerContext';

/**
 * Hook to get dealer theme colors easily
 * Returns the primary color and other theme values
 */
export function useDealerTheme() {
  const { dealer } = useDealer();

  const config = dealer?.configuration;
  const theme = config?.theme;

  // Get primary color from configuration or fallback
  const primaryColor = theme?.colors?.primary || dealer?.theme?.primaryColor || dealer?.brandColor || '#1341ee';
  const secondaryColor = theme?.colors?.secondary || dealer?.theme?.secondaryColor || '#000000';
  const accentColor = theme?.colors?.accent || primaryColor;
  const successColor = theme?.colors?.success || '#10b981';
  const warningColor = theme?.colors?.warning || '#f59e0b';
  const errorColor = theme?.colors?.error || '#ef4444';

  return {
    primaryColor,
    secondaryColor,
    accentColor,
    successColor,
    warningColor,
    errorColor,
    dealer,
    config,
  };
}
