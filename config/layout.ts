/**
 * Layout Configuration
 * Customizable layout and component settings
 */

export interface HeaderConfig {
  // Header style
  position: 'fixed' | 'sticky' | 'relative';
  transparent: boolean;
  blur: boolean;
  shadow: boolean;

  // Logo settings
  logoPosition: 'left' | 'center' | 'right';
  logoSize: 'sm' | 'md' | 'lg';
  showLogoText: boolean;

  // Navigation settings
  navPosition: 'left' | 'center' | 'right';
  navStyle: 'default' | 'pills' | 'underline';
  showSearchBar: boolean;

  // CTA button
  showCtaButton: boolean;
  ctaStyle: 'primary' | 'secondary' | 'outline';
}

export interface HeroConfig {
  // Layout
  layout: 'split' | 'centered' | 'fullwidth' | 'minimal';
  imagePosition: 'left' | 'right';
  alignment: 'left' | 'center' | 'right';

  // Background
  backgroundType: 'solid' | 'gradient' | 'image' | 'pattern' | 'video';
  backgroundOverlay: boolean;
  backgroundBlur: boolean;

  // Height
  height: 'sm' | 'md' | 'lg' | 'full' | 'auto';
  minHeight: string;

  // Animations
  animateText: boolean;
  animateImage: boolean;
  animateButtons: boolean;

  // Content display
  showSubtitle: boolean;
  showDescription: boolean;
  showButtons: boolean;
  buttonLayout: 'horizontal' | 'vertical';
}

export interface FeaturesConfig {
  // Layout
  layout: 'grid' | 'carousel' | 'list' | 'masonry';
  columns: 2 | 3 | 4;
  gap: 'sm' | 'md' | 'lg';

  // Card style
  cardStyle: 'elevated' | 'bordered' | 'flat' | 'glass';
  cardHoverEffect: 'lift' | 'scale' | 'glow' | 'none';

  // Icon settings
  iconPosition: 'top' | 'left' | 'inline';
  iconSize: 'sm' | 'md' | 'lg';
  iconStyle: 'circle' | 'square' | 'none';

  // Animations
  animateOnScroll: boolean;
  staggerAnimation: boolean;
}

export interface VehicleCatalogConfig {
  // Layout
  layout: 'grid' | 'list' | 'masonry';
  columns: 2 | 3 | 4;
  cardsPerPage: number;

  // Card style
  cardStyle: 'modern' | 'classic' | 'minimal' | 'detailed';
  showQuickView: boolean;
  showCompareButton: boolean;
  showWishlistButton: boolean;

  // Filters
  filterPosition: 'sidebar' | 'top' | 'drawer';
  filterStyle: 'default' | 'chips' | 'dropdown';
  showSortOptions: boolean;

  // Image settings
  imageRatio: '16:9' | '4:3' | '1:1' | 'auto';
  imageHoverEffect: 'zoom' | 'slide' | 'fade' | 'none';
  showImageCarousel: boolean;
}

export interface FooterConfig {
  // Layout
  layout: 'modern' | 'classic' | 'minimal' | 'mega';
  columns: 2 | 3 | 4 | 5;

  // Content
  showNewsletter: boolean;
  showSocialLinks: boolean;
  showPaymentMethods: boolean;
  showTrustBadges: boolean;

  // Style
  background: 'light' | 'dark' | 'gradient' | 'image';
  divider: boolean;

  // Copyright
  copyrightPosition: 'left' | 'center' | 'right';
  showBackToTop: boolean;
}

export interface SidebarConfig {
  // Position
  position: 'left' | 'right';
  width: 'sm' | 'md' | 'lg';

  // Behavior
  collapsible: boolean;
  defaultCollapsed: boolean;
  overlay: boolean;

  // Style
  style: 'default' | 'bordered' | 'elevated';
  blur: boolean;
}

export interface AnimationConfig {
  // Global animation settings
  enabled: boolean;
  speed: 'slow' | 'normal' | 'fast';
  easing: string;

  // Scroll animations
  scrollAnimations: boolean;
  scrollOffset: number;
  scrollThreshold: number;

  // Page transitions
  pageTransitions: boolean;
  transitionType: 'fade' | 'slide' | 'scale' | 'none';

  // Hover effects
  hoverEffects: boolean;
  hoverScale: number;
}

export interface LayoutConfig {
  header: HeaderConfig;
  hero: HeroConfig;
  features: FeaturesConfig;
  vehicleCatalog: VehicleCatalogConfig;
  footer: FooterConfig;
  sidebar: SidebarConfig;
  animations: AnimationConfig;

  // Global layout settings
  containerMaxWidth: string;
  containerPadding: string;
  sectionSpacing: string;
  borderRadius: string;
}

// Helper to safely parse boolean from placeholder string
const parseBool = (value: string, defaultValue: boolean = false): boolean => {
  if (value.includes('{{')) return defaultValue;
  return value === 'true' || value === '1' || value === 'yes';
};

// Helper to safely parse int from placeholder string
const parseIntSafe = (value: string, defaultValue: number = 0): number => {
  if (value.includes('{{')) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper to safely parse float from placeholder string
const parseFloatSafe = (value: string, defaultValue: number = 0): number => {
  if (value.includes('{{')) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const DEFAULT_LAYOUT: LayoutConfig = {
  header: {
    position: '{{LAYOUT_HEADER_POSITION}}' as any,
    transparent: parseBool('{{LAYOUT_HEADER_TRANSPARENT}}'),
    blur: parseBool('{{LAYOUT_HEADER_BLUR}}', true),
    shadow: parseBool('{{LAYOUT_HEADER_SHADOW}}', true),
    logoPosition: '{{LAYOUT_HEADER_LOGO_POSITION}}' as any,
    logoSize: '{{LAYOUT_HEADER_LOGO_SIZE}}' as any,
    showLogoText: parseBool('{{LAYOUT_HEADER_SHOW_LOGO_TEXT}}', true),
    navPosition: '{{LAYOUT_HEADER_NAV_POSITION}}' as any,
    navStyle: '{{LAYOUT_HEADER_NAV_STYLE}}' as any,
    showSearchBar: parseBool('{{LAYOUT_HEADER_SHOW_SEARCH}}'),
    showCtaButton: parseBool('{{LAYOUT_HEADER_SHOW_CTA}}', true),
    ctaStyle: '{{LAYOUT_HEADER_CTA_STYLE}}' as any,
  },

  hero: {
    layout: '{{LAYOUT_HERO_LAYOUT}}' as any,
    imagePosition: '{{LAYOUT_HERO_IMAGE_POSITION}}' as any,
    alignment: '{{LAYOUT_HERO_ALIGNMENT}}' as any,
    backgroundType: '{{LAYOUT_HERO_BG_TYPE}}' as any,
    backgroundOverlay: parseBool('{{LAYOUT_HERO_BG_OVERLAY}}'),
    backgroundBlur: parseBool('{{LAYOUT_HERO_BG_BLUR}}'),
    height: '{{LAYOUT_HERO_HEIGHT}}' as any,
    minHeight: '{{LAYOUT_HERO_MIN_HEIGHT}}',
    animateText: parseBool('{{LAYOUT_HERO_ANIMATE_TEXT}}', true),
    animateImage: parseBool('{{LAYOUT_HERO_ANIMATE_IMAGE}}', true),
    animateButtons: parseBool('{{LAYOUT_HERO_ANIMATE_BUTTONS}}', true),
    showSubtitle: parseBool('{{LAYOUT_HERO_SHOW_SUBTITLE}}', true),
    showDescription: parseBool('{{LAYOUT_HERO_SHOW_DESC}}', true),
    showButtons: parseBool('{{LAYOUT_HERO_SHOW_BUTTONS}}', true),
    buttonLayout: '{{LAYOUT_HERO_BUTTON_LAYOUT}}' as any,
  },

  features: {
    layout: '{{LAYOUT_FEATURES_LAYOUT}}' as any,
    columns: parseIntSafe('{{LAYOUT_FEATURES_COLUMNS}}', 4) as any,
    gap: '{{LAYOUT_FEATURES_GAP}}' as any,
    cardStyle: '{{LAYOUT_FEATURES_CARD_STYLE}}' as any,
    cardHoverEffect: '{{LAYOUT_FEATURES_HOVER}}' as any,
    iconPosition: '{{LAYOUT_FEATURES_ICON_POS}}' as any,
    iconSize: '{{LAYOUT_FEATURES_ICON_SIZE}}' as any,
    iconStyle: '{{LAYOUT_FEATURES_ICON_STYLE}}' as any,
    animateOnScroll: parseBool('{{LAYOUT_FEATURES_ANIMATE}}', true),
    staggerAnimation: parseBool('{{LAYOUT_FEATURES_STAGGER}}', true),
  },

  vehicleCatalog: {
    layout: '{{LAYOUT_CATALOG_LAYOUT}}' as any,
    columns: parseIntSafe('{{LAYOUT_CATALOG_COLUMNS}}', 3) as any,
    cardsPerPage: parseIntSafe('{{LAYOUT_CATALOG_PER_PAGE}}', 12),
    cardStyle: '{{LAYOUT_CATALOG_CARD_STYLE}}' as any,
    showQuickView: parseBool('{{LAYOUT_CATALOG_QUICK_VIEW}}', true),
    showCompareButton: parseBool('{{LAYOUT_CATALOG_COMPARE}}', true),
    showWishlistButton: parseBool('{{LAYOUT_CATALOG_WISHLIST}}', true),
    filterPosition: '{{LAYOUT_CATALOG_FILTER_POS}}' as any,
    filterStyle: '{{LAYOUT_CATALOG_FILTER_STYLE}}' as any,
    showSortOptions: parseBool('{{LAYOUT_CATALOG_SORT}}', true),
    imageRatio: '{{LAYOUT_CATALOG_IMAGE_RATIO}}' as any,
    imageHoverEffect: '{{LAYOUT_CATALOG_IMAGE_HOVER}}' as any,
    showImageCarousel: parseBool('{{LAYOUT_CATALOG_IMAGE_CAROUSEL}}', true),
  },

  footer: {
    layout: '{{LAYOUT_FOOTER_LAYOUT}}' as any,
    columns: parseIntSafe('{{LAYOUT_FOOTER_COLUMNS}}', 4) as any,
    showNewsletter: parseBool('{{LAYOUT_FOOTER_NEWSLETTER}}', true),
    showSocialLinks: parseBool('{{LAYOUT_FOOTER_SOCIAL}}', true),
    showPaymentMethods: parseBool('{{LAYOUT_FOOTER_PAYMENT}}'),
    showTrustBadges: parseBool('{{LAYOUT_FOOTER_TRUST}}'),
    background: '{{LAYOUT_FOOTER_BG}}' as any,
    divider: parseBool('{{LAYOUT_FOOTER_DIVIDER}}', true),
    copyrightPosition: '{{LAYOUT_FOOTER_COPYRIGHT_POS}}' as any,
    showBackToTop: parseBool('{{LAYOUT_FOOTER_BACK_TO_TOP}}', true),
  },

  sidebar: {
    position: '{{LAYOUT_SIDEBAR_POSITION}}' as any,
    width: '{{LAYOUT_SIDEBAR_WIDTH}}' as any,
    collapsible: parseBool('{{LAYOUT_SIDEBAR_COLLAPSIBLE}}', true),
    defaultCollapsed: parseBool('{{LAYOUT_SIDEBAR_DEFAULT_COLLAPSED}}'),
    overlay: parseBool('{{LAYOUT_SIDEBAR_OVERLAY}}'),
    style: '{{LAYOUT_SIDEBAR_STYLE}}' as any,
    blur: parseBool('{{LAYOUT_SIDEBAR_BLUR}}'),
  },

  animations: {
    enabled: parseBool('{{LAYOUT_ANIMATIONS_ENABLED}}', true),
    speed: '{{LAYOUT_ANIMATIONS_SPEED}}' as any,
    easing: '{{LAYOUT_ANIMATIONS_EASING}}',
    scrollAnimations: parseBool('{{LAYOUT_ANIMATIONS_SCROLL}}', true),
    scrollOffset: parseIntSafe('{{LAYOUT_ANIMATIONS_SCROLL_OFFSET}}', 100),
    scrollThreshold: parseFloatSafe('{{LAYOUT_ANIMATIONS_SCROLL_THRESHOLD}}', 0.3),
    pageTransitions: parseBool('{{LAYOUT_ANIMATIONS_PAGE}}'),
    transitionType: '{{LAYOUT_ANIMATIONS_TRANSITION_TYPE}}' as any,
    hoverEffects: parseBool('{{LAYOUT_ANIMATIONS_HOVER}}', true),
    hoverScale: parseFloatSafe('{{LAYOUT_ANIMATIONS_HOVER_SCALE}}', 1.05),
  },

  containerMaxWidth: '{{LAYOUT_CONTAINER_MAX_WIDTH}}',
  containerPadding: '{{LAYOUT_CONTAINER_PADDING}}',
  sectionSpacing: '{{LAYOUT_SECTION_SPACING}}',
  borderRadius: '{{LAYOUT_BORDER_RADIUS}}',
};

// Helper to check if layout is configured
export const isLayoutConfigured = () => {
  return !DEFAULT_LAYOUT.containerMaxWidth.includes('{{');
};
