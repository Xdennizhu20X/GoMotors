/**
 * Helper functions for generating dealer links
 */

export const VALID_DEALERS = [
  'peugeot-loja',
  'nissan-loja',
  'toyota-loja',
  'ford-loja',
  'chevrolet-loja',
  'hyundai-loja',
  'kia-loja',
  'volkswagen-loja',
  'mazda-loja',
  'honda-loja'
] as const;

export type DealerSlug = typeof VALID_DEALERS[number];

/**
 * Generate a dealer URL using query parameters
 * @param dealer - The dealer slug
 * @param baseUrl - Optional base URL (defaults to current origin)
 * @param path - Optional path to append (defaults to '/')
 * @returns The complete URL for the dealer
 */
export function getDealerUrl(dealer: DealerSlug, baseUrl?: string, path: string = '/'): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  const url = new URL(path, base);
  url.searchParams.set('dealer', dealer);
  return url.toString();
}

/**
 * Get dealer display name from slug
 */
export function getDealerDisplayName(dealer: DealerSlug): string {
  const names: Record<DealerSlug, string> = {
    'peugeot-loja': 'Peugeot Loja',
    'nissan-loja': 'Nissan Loja',
    'toyota-loja': 'Toyota Loja',
    'ford-loja': 'Ford Loja',
    'chevrolet-loja': 'Chevrolet Loja',
    'hyundai-loja': 'Hyundai Loja',
    'kia-loja': 'Kia Loja',
    'volkswagen-loja': 'Volkswagen Loja',
    'mazda-loja': 'Mazda Loja',
    'honda-loja': 'Honda Loja'
  };

  return names[dealer] || dealer;
}

/**
 * Check if a string is a valid dealer slug
 */
export function isValidDealer(dealer: string): dealer is DealerSlug {
  return VALID_DEALERS.includes(dealer as DealerSlug);
}