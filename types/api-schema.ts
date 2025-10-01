/**
 * API Schema Types
 * Tipos TypeScript completos para la configuración del dealer
 */

// ============================================================================
// DEALER INFO
// ============================================================================

export interface DealerInfo {
  name: string;                      // REQUIRED
  brand: string;                     // REQUIRED
  logoUrl?: string;
  brandColor?: string;
  location?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  description?: string;
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

export interface ApiConfig {
  baseUrl: string;                   // REQUIRED
  dealerId: string;                  // REQUIRED
}

// ============================================================================
// THEME
// ============================================================================

export interface ThemeColors {
  primary?: string;
  primaryHover?: string;
  primaryLight?: string;
  primaryDark?: string;
  secondary?: string;
  secondaryHover?: string;
  accent?: string;
  accentHover?: string;
  backgroundLight?: string;
  backgroundDark?: string;
  foregroundLight?: string;
  foregroundDark?: string;
  content1Dark?: string;
  content2Dark?: string;
  content3Dark?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
}

export interface ThemeTypography {
  fontSans?: string;
  fontHeading?: string;
  fontDisplay?: string;
  fontMono?: string;
  fontSizeXs?: string;
  fontSizeSm?: string;
  fontSizeBase?: string;
  fontSizeLg?: string;
  fontSizeXl?: string;
  fontSize2xl?: string;
  fontSize3xl?: string;
  fontSize4xl?: string;
  fontSize5xl?: string;
}

export interface ThemeSpacing {
  radiusSm?: string;
  radiusMd?: string;
  radiusLg?: string;
  radiusXl?: string;
  radius2xl?: string;
  radius3xl?: string;
  radiusFull?: string;
  shadowSm?: string;
  shadowMd?: string;
  shadowLg?: string;
  shadowXl?: string;
  shadow2xl?: string;
  maxWidthXs?: string;
  maxWidthSm?: string;
  maxWidthMd?: string;
  maxWidthLg?: string;
  maxWidthXl?: string;
  maxWidth2xl?: string;
  maxWidth7xl?: string;
}

export interface ThemeConfig {
  colors?: ThemeColors;
  typography?: ThemeTypography;
  spacing?: ThemeSpacing;
  animationEasing?: string;
  containerPadding?: string;
  sectionSpacing?: string;
}

// ============================================================================
// IMAGES
// ============================================================================

export interface ImageAssets {
  // Logos
  logo?: string;
  logoWhite?: string;
  logoDark?: string;
  favicon?: string;

  // Hero
  heroImage?: string;
  heroImageAlt?: string;
  heroBackground?: string;

  // About / Contact
  aboutImage?: string;
  aboutImageAlt?: string;
  contactImage?: string;
  contactImageAlt?: string;

  // SEO / Social
  ogImage?: string;
  twitterImage?: string;

  // Dealer Specific
  dealerBanner?: string;
  dealerShowroom?: string;
  dealerTeam?: string;

  // Background patterns
  backgroundPattern?: string;
  sectionDivider?: string;

  // Feature Icons
  featureIcons?: {
    financing?: string;
    warranty?: string;
    delivery?: string;
    support?: string;
  };
}

// ============================================================================
// CONTENT
// ============================================================================

export interface HeroContent {
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  description?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface FeaturesContent {
  sectionTitle?: string;
  sectionSubtitle?: string;
  features?: Feature[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface AboutContent {
  sectionTitle?: string;
  sectionSubtitle?: string;
  paragraphs?: string[];
  stats?: Stat[];
}

export interface ContactFormFields {
  namePlaceholder?: string;
  emailPlaceholder?: string;
  phonePlaceholder?: string;
  messagePlaceholder?: string;
  submitButton?: string;
}

export interface DealerRegistration {
  title?: string;
  subtitle?: string;
  description?: string;
  benefits?: string[];
  ctaButton?: string;
}

export interface ContactContent {
  sectionTitle?: string;
  sectionSubtitle?: string;
  formTitle?: string;
  formSubtitle?: string;
  formFields?: ContactFormFields;
  dealerRegistration?: DealerRegistration;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface FooterContent {
  description?: string;
  sections?: FooterSection[];
  copyrightText?: string;
  socialLinks?: FooterSocialLinks;
}

export interface SEOContent {
  title?: string;
  titleTemplate?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  twitterHandle?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface NavCTA {
  label: string;
  href: string;
}

export interface NavigationContent {
  items?: NavItem[];
  ctaButton?: NavCTA;
}

export interface ContentConfig {
  siteName?: string;
  tagline?: string;
  hero?: HeroContent;
  features?: FeaturesContent;
  about?: AboutContent;
  contact?: ContactContent;
  footer?: FooterContent;
  seo?: SEOContent;
  navigation?: NavigationContent;
}

// ============================================================================
// LAYOUT
// ============================================================================

export type HeaderPosition = 'fixed' | 'sticky' | 'relative';
export type Alignment = 'left' | 'center' | 'right';
export type Size = 'sm' | 'md' | 'lg';
export type NavStyle = 'default' | 'pills' | 'underline';
export type CTAStyle = 'primary' | 'secondary' | 'outline';

export interface HeaderConfig {
  position?: HeaderPosition;
  transparent?: boolean;
  blur?: boolean;
  shadow?: boolean;
  logoPosition?: Alignment;
  logoSize?: Size;
  showLogoText?: boolean;
  navPosition?: Alignment;
  navStyle?: NavStyle;
  showSearchBar?: boolean;
  showCtaButton?: boolean;
  ctaStyle?: CTAStyle;
}

export type HeroLayout = 'split' | 'centered' | 'fullwidth' | 'minimal';
export type BackgroundType = 'solid' | 'gradient' | 'image' | 'pattern' | 'video';
export type HeroHeight = 'sm' | 'md' | 'lg' | 'full' | 'auto';
export type ButtonLayout = 'horizontal' | 'vertical';

export interface HeroConfig {
  layout?: HeroLayout;
  imagePosition?: 'left' | 'right';
  alignment?: Alignment;
  backgroundType?: BackgroundType;
  backgroundOverlay?: boolean;
  backgroundBlur?: boolean;
  height?: HeroHeight;
  minHeight?: string;
  animateText?: boolean;
  animateImage?: boolean;
  animateButtons?: boolean;
  showSubtitle?: boolean;
  showDescription?: boolean;
  showButtons?: boolean;
  buttonLayout?: ButtonLayout;
}

export type FeaturesLayout = 'grid' | 'carousel' | 'list' | 'masonry';
export type CardStyle = 'elevated' | 'bordered' | 'flat' | 'glass';
export type HoverEffect = 'lift' | 'scale' | 'glow' | 'none';
export type IconPosition = 'top' | 'left' | 'inline';
export type IconStyle = 'circle' | 'square' | 'none';
export type Gap = 'sm' | 'md' | 'lg';

export interface FeaturesConfig {
  layout?: FeaturesLayout;
  columns?: 2 | 3 | 4;
  gap?: Gap;
  cardStyle?: CardStyle;
  cardHoverEffect?: HoverEffect;
  iconPosition?: IconPosition;
  iconSize?: Size;
  iconStyle?: IconStyle;
  animateOnScroll?: boolean;
  staggerAnimation?: boolean;
}

export type CatalogLayout = 'grid' | 'list' | 'masonry';
export type CatalogCardStyle = 'modern' | 'classic' | 'minimal' | 'detailed';
export type FilterPosition = 'sidebar' | 'top' | 'drawer';
export type FilterStyle = 'default' | 'chips' | 'dropdown';
export type ImageRatio = '16:9' | '4:3' | '1:1' | 'auto';
export type ImageHoverEffect = 'zoom' | 'slide' | 'fade' | 'none';

export interface VehicleCatalogConfig {
  layout?: CatalogLayout;
  columns?: 2 | 3 | 4;
  cardsPerPage?: number;
  cardStyle?: CatalogCardStyle;
  showQuickView?: boolean;
  showCompareButton?: boolean;
  showWishlistButton?: boolean;
  filterPosition?: FilterPosition;
  filterStyle?: FilterStyle;
  showSortOptions?: boolean;
  imageRatio?: ImageRatio;
  imageHoverEffect?: ImageHoverEffect;
  showImageCarousel?: boolean;
}

export type FooterLayout = 'modern' | 'classic' | 'minimal' | 'mega';
export type FooterBackground = 'light' | 'dark' | 'gradient' | 'image';

export interface FooterConfig {
  layout?: FooterLayout;
  columns?: 2 | 3 | 4 | 5;
  showNewsletter?: boolean;
  showSocialLinks?: boolean;
  showPaymentMethods?: boolean;
  showTrustBadges?: boolean;
  background?: FooterBackground;
  divider?: boolean;
  copyrightPosition?: Alignment;
  showBackToTop?: boolean;
}

export type SidebarPosition = 'left' | 'right';
export type SidebarStyle = 'default' | 'bordered' | 'elevated';

export interface SidebarConfig {
  position?: SidebarPosition;
  width?: Size;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  overlay?: boolean;
  style?: SidebarStyle;
  blur?: boolean;
}

export type AnimationSpeed = 'slow' | 'normal' | 'fast';
export type TransitionType = 'fade' | 'slide' | 'scale' | 'none';

export interface AnimationConfig {
  enabled?: boolean;
  speed?: AnimationSpeed;
  easing?: string;
  scrollAnimations?: boolean;
  scrollOffset?: number;
  scrollThreshold?: number;
  pageTransitions?: boolean;
  transitionType?: TransitionType;
  hoverEffects?: boolean;
  hoverScale?: number;
}

export interface LayoutConfig {
  header?: HeaderConfig;
  hero?: HeroConfig;
  features?: FeaturesConfig;
  vehicleCatalog?: VehicleCatalogConfig;
  footer?: FooterConfig;
  sidebar?: SidebarConfig;
  animations?: AnimationConfig;
  containerMaxWidth?: string;
  containerPadding?: string;
  sectionSpacing?: string;
  borderRadius?: string;
}

// ============================================================================
// SOCIAL MEDIA
// ============================================================================

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

// ============================================================================
// SEO (TOP LEVEL)
// ============================================================================

export interface SEO {
  title?: string;
  description?: string;
  keywords?: string;
}

// ============================================================================
// COMPLETE CONFIGURATION
// ============================================================================

export interface DealerConfiguration {
  dealer: DealerInfo;              // REQUIRED
  api: ApiConfig;                  // REQUIRED
  theme?: ThemeConfig;
  images?: ImageAssets;
  content?: ContentConfig;
  layout?: LayoutConfig;
  social?: SocialMedia;
  seo?: SEO;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface CustomizeResponse {
  success: boolean;
  message: string;
  dealerId: string;
  deploymentUrl?: string;
  configId?: string;
}

export interface ConfigResponse {
  success: boolean;
  config: DealerConfiguration;
}

export interface UpdateResponse {
  success: boolean;
  message: string;
  updatedFields: string[];
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string[];
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateDealerConfig(config: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate required fields
  if (!config.dealer) {
    errors.push('dealer object is required');
  } else {
    if (!config.dealer.name) {
      errors.push('dealer.name is required');
    }
    if (!config.dealer.brand) {
      errors.push('dealer.brand is required');
    }
  }

  if (!config.api) {
    errors.push('api object is required');
  } else {
    if (!config.api.baseUrl) {
      errors.push('api.baseUrl is required');
    }
    if (!config.api.dealerId) {
      errors.push('api.dealerId is required');
    }
  }

  // Validate URLs if present
  const urlFields = [
    'dealer.logoUrl',
    'dealer.website',
    'api.baseUrl',
  ];

  urlFields.forEach(field => {
    const value = getNestedValue(config, field);
    if (value && !isValidUrl(value)) {
      errors.push(`${field} must be a valid URL`);
    }
  });

  // Validate email if present
  if (config.dealer?.email && !isValidEmail(config.dealer.email)) {
    errors.push('dealer.email must be a valid email address');
  }

  // Validate colors if present
  if (config.theme?.colors) {
    Object.entries(config.theme.colors).forEach(([key, value]) => {
      if (value && typeof value === 'string' && !isValidHexColor(value as string)) {
        errors.push(`theme.colors.${key} must be a valid hex color`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Helper functions
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidHexColor(color: string): boolean {
  const hexRegex = /^#[0-9A-F]{6}$/i;
  return hexRegex.test(color);
}

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_VALUES = {
  theme: {
    colors: {
      primary: '#1341ee',
      primaryHover: '#0f35cc',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    typography: {
      fontSans: 'Inter, system-ui, sans-serif',
      fontSizeBase: '1rem',
    },
    spacing: {
      radiusMd: '0.5rem',
      shadowMd: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    animationEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    containerPadding: '1rem',
    sectionSpacing: '4rem',
  },
  layout: {
    header: {
      position: 'sticky' as HeaderPosition,
      blur: true,
      shadow: true,
      logoPosition: 'left' as Alignment,
      logoSize: 'md' as Size,
      showLogoText: true,
      navPosition: 'center' as Alignment,
      navStyle: 'default' as NavStyle,
      showCtaButton: true,
      ctaStyle: 'primary' as CTAStyle,
    },
    hero: {
      layout: 'split' as HeroLayout,
      imagePosition: 'right' as 'left' | 'right',
      alignment: 'left' as Alignment,
      backgroundType: 'gradient' as BackgroundType,
      height: 'lg' as HeroHeight,
      animateText: true,
      animateImage: true,
      showButtons: true,
      buttonLayout: 'horizontal' as ButtonLayout,
    },
    features: {
      layout: 'grid' as FeaturesLayout,
      columns: 4 as 2 | 3 | 4,
      cardStyle: 'elevated' as CardStyle,
      cardHoverEffect: 'lift' as HoverEffect,
      iconPosition: 'top' as IconPosition,
      iconSize: 'lg' as Size,
      animateOnScroll: true,
      staggerAnimation: true,
    },
    vehicleCatalog: {
      layout: 'grid' as CatalogLayout,
      columns: 3 as 2 | 3 | 4,
      cardsPerPage: 12,
      cardStyle: 'modern' as CatalogCardStyle,
      showQuickView: true,
      showCompareButton: true,
      filterPosition: 'sidebar' as FilterPosition,
      imageRatio: '16:9' as ImageRatio,
      imageHoverEffect: 'zoom' as ImageHoverEffect,
    },
    footer: {
      layout: 'modern' as FooterLayout,
      columns: 4 as 2 | 3 | 4 | 5,
      showNewsletter: true,
      showSocialLinks: true,
      background: 'dark' as FooterBackground,
      showBackToTop: true,
    },
    animations: {
      enabled: true,
      speed: 'normal' as AnimationSpeed,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      scrollAnimations: true,
      scrollOffset: 100,
      scrollThreshold: 0.3,
      hoverEffects: true,
      hoverScale: 1.05,
    },
  },
};
