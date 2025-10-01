/**
 * Image Assets Configuration
 * Centralized configuration for all customizable images
 */

export interface ImageAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ImageAssets {
  // Logos
  logo: ImageAsset;
  logoWhite: ImageAsset;
  logoDark: ImageAsset;
  favicon: ImageAsset;

  // Hero section
  heroImage: ImageAsset;
  heroBackground?: ImageAsset;

  // About/Contact section images
  aboutImage?: ImageAsset;
  contactImage?: ImageAsset;

  // Social media / OpenGraph
  ogImage: ImageAsset;
  twitterImage?: ImageAsset;

  // Dealer specific
  dealerBanner?: ImageAsset;
  dealerShowroom?: ImageAsset;
  dealerTeam?: ImageAsset;

  // Brand logos (for carousel)
  brandLogos?: ImageAsset[];

  // Background patterns/textures
  backgroundPattern?: ImageAsset;
  sectionDivider?: ImageAsset;

  // Feature/service icons
  featureIcons?: {
    financing?: ImageAsset;
    warranty?: ImageAsset;
    delivery?: ImageAsset;
    support?: ImageAsset;
  };
}

export const DEFAULT_IMAGES: ImageAssets = {
  // Main Logos
  logo: {
    url: 'https://cdn.example.com/logo.png',
    alt: 'Example Dealer Logo',
    width: 180,
    height: 60,
  },
  logoWhite: {
    url: 'https://cdn.example.com/logo-white.png',
    alt: 'Example Dealer Logo White',
    width: 180,
    height: 60,
  },
  logoDark: {
    url: 'https://cdn.example.com/logo-dark.png',
    alt: 'Example Dealer Logo Dark',
    width: 180,
    height: 60,
  },
  favicon: {
    url: 'https://cdn.example.com/favicon.png',
    alt: 'Example Dealer Favicon',
    width: 32,
    height: 32,
  },

  // Hero Section
  heroImage: {
    url: 'https://cdn.example.com/hero-car.png',
    alt: 'Vehículo Toyota en nuestro showroom',
    width: 800,
    height: 600,
  },
  heroBackground: {
    url: 'https://cdn.example.com/hero-bg.jpg',
    alt: 'Hero Background',
  },

  // About/Contact
  aboutImage: {
    url: 'https://cdn.example.com/about.jpg',
    alt: 'Nuestro equipo de trabajo',
    width: 600,
    height: 400,
  },
  contactImage: {
    url: 'https://cdn.example.com/contact.jpg',
    alt: 'Contáctanos',
    width: 600,
    height: 400,
  },

  // Social Media
  ogImage: {
    url: 'https://cdn.example.com/og-image.jpg',
    alt: 'Example Dealer - Toyota en Quito, Ecuador',
    width: 1200,
    height: 630,
  },
  twitterImage: {
    url: 'https://cdn.example.com/twitter-image.jpg',
    alt: 'Example Dealer',
    width: 1200,
    height: 630,
  },

  // Dealer Specific
  dealerBanner: {
    url: 'https://cdn.example.com/banner.jpg',
    alt: 'Example Dealer Banner',
    width: 1920,
    height: 400,
  },
  dealerShowroom: {
    url: 'https://cdn.example.com/showroom.jpg',
    alt: 'Example Dealer Showroom',
    width: 800,
    height: 600,
  },
  dealerTeam: {
    url: 'https://cdn.example.com/team.jpg',
    alt: 'Example Dealer Team',
    width: 800,
    height: 600,
  },

  // Background patterns
  backgroundPattern: {
    url: '',
    alt: 'Background Pattern',
  },
  sectionDivider: {
    url: '',
    alt: 'Section Divider',
  },

  // Feature icons
  featureIcons: {
    financing: {
      url: 'https://cdn.example.com/icon-financing.svg',
      alt: 'Financing Icon',
      width: 64,
      height: 64,
    },
    warranty: {
      url: 'https://cdn.example.com/icon-warranty.svg',
      alt: 'Warranty Icon',
      width: 64,
      height: 64,
    },
    delivery: {
      url: 'https://cdn.example.com/icon-delivery.svg',
      alt: 'Delivery Icon',
      width: 64,
      height: 64,
    },
    support: {
      url: 'https://cdn.example.com/icon-support.svg',
      alt: 'Support Icon',
      width: 64,
      height: 64,
    },
  },
};

// Helper to check if images are configured
export const areImagesConfigured = () => {
  return !DEFAULT_IMAGES.logo.url.includes('{{');
};

// Helper to get image URL with fallback
export const getImageUrl = (image: ImageAsset, fallback: string = '/placeholder.png') => {
  if (image.url.includes('{{')) {
    return fallback;
  }
  return image.url;
};

// Helper to get all placeholder keys in images config
export const getImagePlaceholders = (): string[] => {
  const placeholders: string[] = [];

  const extractPlaceholders = (obj: any, prefix = '') => {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].includes('{{')) {
        const match = obj[key].match(/\{\{([^}]+)\}\}/);
        if (match) {
          placeholders.push(match[1]);
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        extractPlaceholders(obj[key], `${prefix}${key}.`);
      }
    }
  };

  extractPlaceholders(DEFAULT_IMAGES);
  return Array.from(new Set(placeholders)); // Remove duplicates
};
