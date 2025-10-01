export const DEALER_CONFIG = {
  // Información básica del dealer
  name: 'Example Dealer',
  brand: 'Toyota',
  logoUrl: 'https://cdn.example.com/logo.png',
  brandColor: '#CC0000',
  location: 'Quito, Ecuador',
  phone: '+593 99 999 9999',
  email: 'contacto@example.com',
  website: 'https://example.com',
  address: 'Av. Principal 123, Quito',
  description: 'Concesionario líder en vehículos Toyota en Quito',

  // Configuración de API
  apiBaseUrl: 'https://api.ruedaya.com',
  dealerId: 'dealer-12345',

  // SEO y metadata
  seo: {
    title: 'Example Dealer - Vehículos Toyota en Quito, Ecuador',
    description: 'Encuentra los mejores vehículos Toyota en Quito, Ecuador. Example Dealer - Tu concesionario de confianza.',
    keywords: 'Toyota, vehículos, Quito, Ecuador, concesionario, Example Dealer',
  },

  // Redes sociales
  social: {
    facebook: 'https://facebook.com/example',
    instagram: 'https://instagram.com/example',
    whatsapp: '+593999999999',
  },

  // Configuración de tema
  theme: {
    primaryColor: '#CC0000',
    logo: 'https://cdn.example.com/logo.png',
    favicon: 'https://cdn.example.com/favicon.png',
  },

  // Horarios de trabajo (será un JSON string que se parsea)
  workingHours: {} as any, // Se configurará durante el deployment
} as const;

// Helper para verificar si el dealer está configurado
export const isDealerConfigured = () => {
  return !DEALER_CONFIG.name.includes('{{') &&
         !DEALER_CONFIG.brand.includes('{{') &&
         !DEALER_CONFIG.dealerId.includes('{{');
};

// Helper para obtener la URL completa del logo
export const getDealerLogoUrl = () => {
  if (DEALER_CONFIG.logoUrl && !DEALER_CONFIG.logoUrl.includes('{{')) {
    return DEALER_CONFIG.logoUrl;
  }
  return '/images/default-dealer-logo.png';
};

// Helper para obtener el color primario
export const getPrimaryColor = () => {
  if (DEALER_CONFIG.brandColor && !DEALER_CONFIG.brandColor.includes('{{')) {
    return DEALER_CONFIG.brandColor;
  }
  return '#3B82F6'; // Color por defecto
};