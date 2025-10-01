/**
 * Content Configuration
 * All customizable text content for the website
 */

export interface HeroContent {
  title: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface FeaturesContent {
  sectionTitle: string;
  sectionSubtitle: string;
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface AboutContent {
  sectionTitle: string;
  sectionSubtitle: string;
  paragraphs: string[];
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export interface ContactContent {
  sectionTitle: string;
  sectionSubtitle: string;
  formTitle: string;
  formSubtitle: string;
  formFields: {
    namePlaceholder: string;
    emailPlaceholder: string;
    phonePlaceholder: string;
    messagePlaceholder: string;
    submitButton: string;
  };
  dealerRegistration: {
    title: string;
    subtitle: string;
    description: string;
    benefits: string[];
    ctaButton: string;
  };
}

export interface FooterContent {
  companyDescription: string;
  sections: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  copyrightText: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
}

export interface SEOContent {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  author: string;
  twitterHandle?: string;
}

export interface NavigationContent {
  items: Array<{
    label: string;
    href: string;
  }>;
  ctaButton?: {
    label: string;
    href: string;
  };
}

export interface ContentConfig {
  siteName: string;
  tagline: string;
  hero: HeroContent;
  features: FeaturesContent;
  about: AboutContent;
  contact: ContactContent;
  footer: FooterContent;
  seo: SEOContent;
  navigation: NavigationContent;
}

export const DEFAULT_CONTENT: ContentConfig = {
  siteName: '{{CONTENT_SITE_NAME}}',
  tagline: '{{CONTENT_TAGLINE}}',

  hero: {
    title: '{{CONTENT_HERO_TITLE}}',
    titleHighlight: '{{CONTENT_HERO_TITLE_HIGHLIGHT}}',
    subtitle: '{{CONTENT_HERO_SUBTITLE}}',
    description: '{{CONTENT_HERO_DESCRIPTION}}',
    ctaPrimary: '{{CONTENT_HERO_CTA_PRIMARY}}',
    ctaSecondary: '{{CONTENT_HERO_CTA_SECONDARY}}',
  },

  features: {
    sectionTitle: '{{CONTENT_FEATURES_TITLE}}',
    sectionSubtitle: '{{CONTENT_FEATURES_SUBTITLE}}',
    features: [
      {
        title: '{{CONTENT_FEATURE_1_TITLE}}',
        description: '{{CONTENT_FEATURE_1_DESC}}',
        icon: '{{CONTENT_FEATURE_1_ICON}}',
      },
      {
        title: '{{CONTENT_FEATURE_2_TITLE}}',
        description: '{{CONTENT_FEATURE_2_DESC}}',
        icon: '{{CONTENT_FEATURE_2_ICON}}',
      },
      {
        title: '{{CONTENT_FEATURE_3_TITLE}}',
        description: '{{CONTENT_FEATURE_3_DESC}}',
        icon: '{{CONTENT_FEATURE_3_ICON}}',
      },
      {
        title: '{{CONTENT_FEATURE_4_TITLE}}',
        description: '{{CONTENT_FEATURE_4_DESC}}',
        icon: '{{CONTENT_FEATURE_4_ICON}}',
      },
    ],
  },

  about: {
    sectionTitle: '{{CONTENT_ABOUT_TITLE}}',
    sectionSubtitle: '{{CONTENT_ABOUT_SUBTITLE}}',
    paragraphs: [
      '{{CONTENT_ABOUT_PARAGRAPH_1}}',
      '{{CONTENT_ABOUT_PARAGRAPH_2}}',
      '{{CONTENT_ABOUT_PARAGRAPH_3}}',
    ],
    stats: [
      {
        value: '{{CONTENT_ABOUT_STAT_1_VALUE}}',
        label: '{{CONTENT_ABOUT_STAT_1_LABEL}}',
      },
      {
        value: '{{CONTENT_ABOUT_STAT_2_VALUE}}',
        label: '{{CONTENT_ABOUT_STAT_2_LABEL}}',
      },
      {
        value: '{{CONTENT_ABOUT_STAT_3_VALUE}}',
        label: '{{CONTENT_ABOUT_STAT_3_LABEL}}',
      },
    ],
  },

  contact: {
    sectionTitle: '{{CONTENT_CONTACT_TITLE}}',
    sectionSubtitle: '{{CONTENT_CONTACT_SUBTITLE}}',
    formTitle: '{{CONTENT_CONTACT_FORM_TITLE}}',
    formSubtitle: '{{CONTENT_CONTACT_FORM_SUBTITLE}}',
    formFields: {
      namePlaceholder: '{{CONTENT_FORM_NAME_PLACEHOLDER}}',
      emailPlaceholder: '{{CONTENT_FORM_EMAIL_PLACEHOLDER}}',
      phonePlaceholder: '{{CONTENT_FORM_PHONE_PLACEHOLDER}}',
      messagePlaceholder: '{{CONTENT_FORM_MESSAGE_PLACEHOLDER}}',
      submitButton: '{{CONTENT_FORM_SUBMIT_BUTTON}}',
    },
    dealerRegistration: {
      title: '{{CONTENT_DEALER_REG_TITLE}}',
      subtitle: '{{CONTENT_DEALER_REG_SUBTITLE}}',
      description: '{{CONTENT_DEALER_REG_DESCRIPTION}}',
      benefits: [
        '{{CONTENT_DEALER_REG_BENEFIT_1}}',
        '{{CONTENT_DEALER_REG_BENEFIT_2}}',
        '{{CONTENT_DEALER_REG_BENEFIT_3}}',
      ],
      ctaButton: '{{CONTENT_DEALER_REG_CTA}}',
    },
  },

  footer: {
    companyDescription: '{{CONTENT_FOOTER_DESCRIPTION}}',
    sections: [
      {
        title: '{{CONTENT_FOOTER_SECTION_1_TITLE}}',
        links: [
          {
            label: '{{CONTENT_FOOTER_SECTION_1_LINK_1}}',
            href: '{{CONTENT_FOOTER_SECTION_1_LINK_1_HREF}}',
          },
          {
            label: '{{CONTENT_FOOTER_SECTION_1_LINK_2}}',
            href: '{{CONTENT_FOOTER_SECTION_1_LINK_2_HREF}}',
          },
        ],
      },
    ],
    copyrightText: '{{CONTENT_FOOTER_COPYRIGHT}}',
    socialLinks: {
      facebook: '{{CONTENT_FOOTER_FACEBOOK}}',
      instagram: '{{CONTENT_FOOTER_INSTAGRAM}}',
      twitter: '{{CONTENT_FOOTER_TWITTER}}',
      linkedin: '{{CONTENT_FOOTER_LINKEDIN}}',
      youtube: '{{CONTENT_FOOTER_YOUTUBE}}',
    },
  },

  seo: {
    defaultTitle: '{{CONTENT_SEO_TITLE}}',
    titleTemplate: '{{CONTENT_SEO_TITLE_TEMPLATE}}',
    defaultDescription: '{{CONTENT_SEO_DESCRIPTION}}',
    keywords: '{{CONTENT_SEO_KEYWORDS}}'.split(',').map(k => k.trim()),
    author: '{{CONTENT_SEO_AUTHOR}}',
    twitterHandle: '{{CONTENT_SEO_TWITTER_HANDLE}}',
  },

  navigation: {
    items: [
      {
        label: '{{CONTENT_NAV_ITEM_1}}',
        href: '{{CONTENT_NAV_ITEM_1_HREF}}',
      },
      {
        label: '{{CONTENT_NAV_ITEM_2}}',
        href: '{{CONTENT_NAV_ITEM_2_HREF}}',
      },
      {
        label: '{{CONTENT_NAV_ITEM_3}}',
        href: '{{CONTENT_NAV_ITEM_3_HREF}}',
      },
      {
        label: '{{CONTENT_NAV_ITEM_4}}',
        href: '{{CONTENT_NAV_ITEM_4_HREF}}',
      },
    ],
    ctaButton: {
      label: '{{CONTENT_NAV_CTA_LABEL}}',
      href: '{{CONTENT_NAV_CTA_HREF}}',
    },
  },
};

// Helper to check if content is configured
export const isContentConfigured = () => {
  return !DEFAULT_CONTENT.siteName.includes('{{');
};

// Helper to get content with fallback
export const getContent = (content: string, fallback: string = '') => {
  if (content.includes('{{')) {
    return fallback;
  }
  return content;
};
