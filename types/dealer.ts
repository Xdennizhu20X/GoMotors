// Complete configuration structure from backend
export interface DealerConfiguration {
  theme?: {
    colors?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      success?: string;
      warning?: string;
      error?: string;
    };
    typography?: {
      fontSans?: string;
      fontHeading?: string;
      fontDisplay?: string;
      fontMono?: string;
    };
  };
  images?: {
    logo?: string;
    logoWhite?: string;
    favicon?: string;
    heroImage?: string;
    heroImageAlt?: string;
    heroBackground?: string;
    aboutImage?: string;
    ogImage?: string;
    twitterImage?: string;
  };
  content?: {
    siteName?: string;
    siteDescription?: string;
    hero?: {
      title?: string;
      subtitle?: string;
      description?: string;
      ctaPrimary?: string;
      ctaSecondary?: string;
    };
  };
  layout?: {
    header?: {
      position?: 'fixed' | 'sticky' | 'relative';
      transparent?: boolean;
      blur?: boolean;
      shadow?: boolean;
      logoPosition?: 'left' | 'center' | 'right';
    };
    hero?: {
      layout?: 'split' | 'centered' | 'fullwidth' | 'minimal';
      height?: 'sm' | 'md' | 'lg' | 'full';
      animateText?: boolean;
      animateImage?: boolean;
      showButtons?: boolean;
    };
  };
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    whatsapp?: string;
    linkedin?: string;
  };
}

export interface DealerConfig {
  _id?: string; // MongoDB ID
  id: string;
  slug: string;
  name: string;
  displayName: string;
  logo: string;
  logoWhite?: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Campos adicionales según la API real
  brand?: string;
  brandColor?: string;
  logoUrl?: string;
  address?: string;
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  services?: string[];
  active?: boolean;
  verified?: boolean;
  featuredDealer?: boolean;
  rating?: number;
  reviewsCount?: number;
  stock?: number;
  modelsAvailable?: number;
  vehicles?: any[];

  // New: Full configuration from customization system
  configuration?: DealerConfiguration;
}

export interface DealerVehicle {
  id: string;
  dealerId: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage?: number;
  condition: 'new' | 'used';
  fuelType: string;
  transmission: string;
  color: string;
  images: string[];
  features: string[];
  description: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DealerContext {
  isDealer: boolean;
  dealer?: DealerConfig;
  slug?: string;
}