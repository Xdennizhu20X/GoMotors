/**
 * Theme Configuration
 * This file contains all customizable theme settings for dealer websites
 */

export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondary: string;
  secondaryHover: string;

  // Accent colors
  accent: string;
  accentHover: string;

  // Background colors
  backgroundLight: string;
  backgroundDark: string;

  // Foreground/text colors
  foregroundLight: string;
  foregroundDark: string;

  // Content card colors (dark mode)
  content1Dark: string;
  content2Dark: string;
  content3Dark: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeTypography {
  // Font families
  fontSans: string;
  fontHeading: string;
  fontDisplay: string;
  fontMono: string;

  // Font weights
  fontWeightLight: number;
  fontWeightNormal: number;
  fontWeightMedium: number;
  fontWeightSemibold: number;
  fontWeightBold: number;
  fontWeightBlack: number;

  // Font sizes
  fontSizeXs: string;
  fontSizeSm: string;
  fontSizeBase: string;
  fontSizeLg: string;
  fontSizeXl: string;
  fontSize2xl: string;
  fontSize3xl: string;
  fontSize4xl: string;
  fontSize5xl: string;

  // Line heights
  lineHeightTight: number;
  lineHeightNormal: number;
  lineHeightRelaxed: number;

  // Letter spacing
  letterSpacingTight: string;
  letterSpacingNormal: string;
  letterSpacingWide: string;
}

export interface ThemeSpacing {
  // Border radius
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
  radius2xl: string;
  radius3xl: string;
  radiusFull: string;

  // Shadows
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  shadowXl: string;
  shadow2xl: string;

  // Container max widths
  maxWidthXs: string;
  maxWidthSm: string;
  maxWidthMd: string;
  maxWidthLg: string;
  maxWidthXl: string;
  maxWidth2xl: string;
  maxWidth7xl: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;

  // Animation settings
  animationSpeed: 'slow' | 'normal' | 'fast';
  animationEasing: string;

  // Layout settings
  containerPadding: string;
  sectionSpacing: string;
}

// Default theme configuration
export const DEFAULT_THEME: ThemeConfig = {
  colors: {
    primary: '{{THEME_PRIMARY_COLOR}}',
    primaryHover: '{{THEME_PRIMARY_HOVER}}',
    primaryLight: '{{THEME_PRIMARY_LIGHT}}',
    primaryDark: '{{THEME_PRIMARY_DARK}}',

    secondary: '{{THEME_SECONDARY_COLOR}}',
    secondaryHover: '{{THEME_SECONDARY_HOVER}}',

    accent: '{{THEME_ACCENT_COLOR}}',
    accentHover: '{{THEME_ACCENT_HOVER}}',

    backgroundLight: '{{THEME_BG_LIGHT}}',
    backgroundDark: '{{THEME_BG_DARK}}',

    foregroundLight: '{{THEME_FG_LIGHT}}',
    foregroundDark: '{{THEME_FG_DARK}}',

    content1Dark: '{{THEME_CONTENT1_DARK}}',
    content2Dark: '{{THEME_CONTENT2_DARK}}',
    content3Dark: '{{THEME_CONTENT3_DARK}}',

    success: '{{THEME_SUCCESS_COLOR}}',
    warning: '{{THEME_WARNING_COLOR}}',
    error: '{{THEME_ERROR_COLOR}}',
    info: '{{THEME_INFO_COLOR}}',
  },

  typography: {
    fontSans: '{{THEME_FONT_SANS}}',
    fontHeading: '{{THEME_FONT_HEADING}}',
    fontDisplay: '{{THEME_FONT_DISPLAY}}',
    fontMono: '{{THEME_FONT_MONO}}',

    fontWeightLight: 300,
    fontWeightNormal: 400,
    fontWeightMedium: 500,
    fontWeightSemibold: 600,
    fontWeightBold: 700,
    fontWeightBlack: 900,

    fontSizeXs: '{{THEME_FONT_SIZE_XS}}',
    fontSizeSm: '{{THEME_FONT_SIZE_SM}}',
    fontSizeBase: '{{THEME_FONT_SIZE_BASE}}',
    fontSizeLg: '{{THEME_FONT_SIZE_LG}}',
    fontSizeXl: '{{THEME_FONT_SIZE_XL}}',
    fontSize2xl: '{{THEME_FONT_SIZE_2XL}}',
    fontSize3xl: '{{THEME_FONT_SIZE_3XL}}',
    fontSize4xl: '{{THEME_FONT_SIZE_4XL}}',
    fontSize5xl: '{{THEME_FONT_SIZE_5XL}}',

    lineHeightTight: 1.1,
    lineHeightNormal: 1.5,
    lineHeightRelaxed: 1.75,

    letterSpacingTight: '-0.02em',
    letterSpacingNormal: '0',
    letterSpacingWide: '0.05em',
  },

  spacing: {
    radiusSm: '{{THEME_RADIUS_SM}}',
    radiusMd: '{{THEME_RADIUS_MD}}',
    radiusLg: '{{THEME_RADIUS_LG}}',
    radiusXl: '{{THEME_RADIUS_XL}}',
    radius2xl: '{{THEME_RADIUS_2XL}}',
    radius3xl: '{{THEME_RADIUS_3XL}}',
    radiusFull: '{{THEME_RADIUS_FULL}}',

    shadowSm: '{{THEME_SHADOW_SM}}',
    shadowMd: '{{THEME_SHADOW_MD}}',
    shadowLg: '{{THEME_SHADOW_LG}}',
    shadowXl: '{{THEME_SHADOW_XL}}',
    shadow2xl: '{{THEME_SHADOW_2XL}}',

    maxWidthXs: '{{THEME_MAX_WIDTH_XS}}',
    maxWidthSm: '{{THEME_MAX_WIDTH_SM}}',
    maxWidthMd: '{{THEME_MAX_WIDTH_MD}}',
    maxWidthLg: '{{THEME_MAX_WIDTH_LG}}',
    maxWidthXl: '{{THEME_MAX_WIDTH_XL}}',
    maxWidth2xl: '{{THEME_MAX_WIDTH_2XL}}',
    maxWidth7xl: '{{THEME_MAX_WIDTH_7XL}}',
  },

  animationSpeed: 'normal',
  animationEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',

  containerPadding: '1rem',
  sectionSpacing: '4rem',
};

// Helper function to check if theme is configured
export const isThemeConfigured = () => {
  return !DEFAULT_THEME.colors.primary.includes('{{');
};

// Helper to get CSS variable from color
export const getCSSVar = (colorValue: string, varName: string) => {
  if (colorValue.includes('{{')) {
    return `var(--${varName}, #1341ee)`; // Fallback color
  }
  return colorValue;
};

// Generate CSS variables for the theme
export const generateThemeCSSVars = (theme: ThemeConfig) => {
  return {
    '--color-primary': theme.colors.primary,
    '--color-primary-hover': theme.colors.primaryHover,
    '--color-primary-light': theme.colors.primaryLight,
    '--color-primary-dark': theme.colors.primaryDark,
    '--color-secondary': theme.colors.secondary,
    '--color-secondary-hover': theme.colors.secondaryHover,
    '--color-accent': theme.colors.accent,
    '--color-accent-hover': theme.colors.accentHover,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--color-error': theme.colors.error,
    '--color-info': theme.colors.info,
    '--animation-easing': theme.animationEasing,
    '--container-padding': theme.containerPadding,
    '--section-spacing': theme.sectionSpacing,
  };
};
