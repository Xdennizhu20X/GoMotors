#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para reemplazar placeholders en archivos
function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Archivo no encontrado: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');

    Object.keys(replacements).forEach(placeholder => {
      const regex = new RegExp(`{{${placeholder}}}`, 'g');
      content = content.replace(regex, replacements[placeholder] || '');
    });

    fs.writeFileSync(filePath, content);
    console.log(`✅ Personalizado: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
  }
}

// Función para procesar archivos recursivamente
function processDirectory(dir, replacements, extensions = ['.js', '.ts', '.tsx', '.jsx', '.json', '.html', '.md']) {
  if (!fs.existsSync(dir)) return;

  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Omitir directorios específicos
      if (['node_modules', '.git', '.next', 'dist', 'build'].includes(item)) {
        return;
      }
      processDirectory(fullPath, replacements, extensions);
    } else if (stat.isFile()) {
      const ext = path.extname(fullPath);
      if (extensions.includes(ext) || item === '.env.example' || item === '.env') {
        replaceInFile(fullPath, replacements);
      }
    }
  });
}

// Helper to safely get nested property
function getNestedProperty(obj, path, defaultValue = '') {
  return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
}

// Helper to flatten nested objects into dot notation
function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenObject(obj[key], `${prefix}${key}_`));
    } else if (Array.isArray(obj[key])) {
      flattened[`${prefix}${key}`] = JSON.stringify(obj[key]);
    } else {
      flattened[`${prefix}${key}`] = obj[key] ?? '';
    }
  }

  return flattened;
}

// Función principal de personalización
function customize(dealerConfig) {
  console.log('🎨 Iniciando personalización del template...');
  console.log('📄 Configuración del dealer:', dealerConfig.dealer?.name || 'Unknown');

  // Base replacements
  const replacements = {
    // Dealer basic info
    'DEALER_NAME': dealerConfig.dealer?.name || '',
    'DEALER_BRAND': dealerConfig.dealer?.brand || '',
    'DEALER_LOGO_URL': dealerConfig.dealer?.logoUrl || '',
    'DEALER_BRAND_COLOR': dealerConfig.dealer?.brandColor || '#1341ee',
    'DEALER_LOCATION': dealerConfig.dealer?.location || '',
    'DEALER_PHONE': dealerConfig.dealer?.phone || '',
    'DEALER_EMAIL': dealerConfig.dealer?.email || '',
    'DEALER_WEBSITE': dealerConfig.dealer?.website || '',
    'DEALER_ADDRESS': dealerConfig.dealer?.address || '',
    'DEALER_WORKING_HOURS': JSON.stringify(dealerConfig.dealer?.workingHours || {}),
    'DEALER_DESCRIPTION': dealerConfig.dealer?.description || '',
    'DEALER_FAVICON_URL': dealerConfig.images?.favicon || dealerConfig.dealer?.logoUrl || '',

    // Social media
    'DEALER_FACEBOOK': dealerConfig.social?.facebook || '',
    'DEALER_INSTAGRAM': dealerConfig.social?.instagram || '',
    'DEALER_WHATSAPP': dealerConfig.social?.whatsapp || '',
    'DEALER_TWITTER': dealerConfig.social?.twitter || '',
    'DEALER_LINKEDIN': dealerConfig.social?.linkedin || '',
    'DEALER_YOUTUBE': dealerConfig.social?.youtube || '',

    // API
    'API_BASE_URL': dealerConfig.api?.baseUrl || '',
    'DEALER_ID': dealerConfig.api?.dealerId || '',

    // SEO
    'SEO_TITLE': dealerConfig.seo?.title || `${dealerConfig.dealer?.name} - ${dealerConfig.dealer?.brand}`,
    'SEO_DESCRIPTION': dealerConfig.seo?.description || `Concesionario ${dealerConfig.dealer?.brand} en ${dealerConfig.dealer?.location}`,
    'SEO_KEYWORDS': dealerConfig.seo?.keywords || `${dealerConfig.dealer?.brand}, vehículos, ${dealerConfig.dealer?.location}`,
  };

  // Add theme colors
  if (dealerConfig.theme?.colors) {
    Object.assign(replacements, flattenObject(dealerConfig.theme.colors, 'THEME_'));
  }

  // Add theme typography
  if (dealerConfig.theme?.typography) {
    Object.assign(replacements, flattenObject(dealerConfig.theme.typography, 'THEME_'));
  }

  // Add theme spacing
  if (dealerConfig.theme?.spacing) {
    Object.assign(replacements, flattenObject(dealerConfig.theme.spacing, 'THEME_'));
  }

  // Add theme global settings
  if (dealerConfig.theme) {
    replacements['THEME_ANIMATION_EASING'] = dealerConfig.theme.animationEasing || 'cubic-bezier(0.16, 1, 0.3, 1)';
    replacements['THEME_CONTAINER_PADDING'] = dealerConfig.theme.containerPadding || '1rem';
    replacements['THEME_SECTION_SPACING'] = dealerConfig.theme.sectionSpacing || '4rem';
  }

  // Add images
  if (dealerConfig.images) {
    replacements['IMAGE_LOGO'] = dealerConfig.images.logo || '';
    replacements['IMAGE_LOGO_WHITE'] = dealerConfig.images.logoWhite || '';
    replacements['IMAGE_LOGO_DARK'] = dealerConfig.images.logoDark || '';
    replacements['IMAGE_FAVICON'] = dealerConfig.images.favicon || '';
    replacements['IMAGE_HERO'] = dealerConfig.images.heroImage || '';
    replacements['IMAGE_HERO_ALT'] = dealerConfig.images.heroImageAlt || 'Hero Image';
    replacements['IMAGE_HERO_BG'] = dealerConfig.images.heroBackground || '';
    replacements['IMAGE_ABOUT'] = dealerConfig.images.aboutImage || '';
    replacements['IMAGE_ABOUT_ALT'] = dealerConfig.images.aboutImageAlt || 'About';
    replacements['IMAGE_CONTACT'] = dealerConfig.images.contactImage || '';
    replacements['IMAGE_CONTACT_ALT'] = dealerConfig.images.contactImageAlt || 'Contact';
    replacements['IMAGE_OG'] = dealerConfig.images.ogImage || '';
    replacements['IMAGE_TWITTER'] = dealerConfig.images.twitterImage || '';
    replacements['IMAGE_DEALER_BANNER'] = dealerConfig.images.dealerBanner || '';
    replacements['IMAGE_DEALER_SHOWROOM'] = dealerConfig.images.dealerShowroom || '';
    replacements['IMAGE_DEALER_TEAM'] = dealerConfig.images.dealerTeam || '';
    replacements['IMAGE_BG_PATTERN'] = dealerConfig.images.backgroundPattern || '';
    replacements['IMAGE_SECTION_DIVIDER'] = dealerConfig.images.sectionDivider || '';

    if (dealerConfig.images.featureIcons) {
      replacements['IMAGE_ICON_FINANCING'] = dealerConfig.images.featureIcons.financing || '';
      replacements['IMAGE_ICON_WARRANTY'] = dealerConfig.images.featureIcons.warranty || '';
      replacements['IMAGE_ICON_DELIVERY'] = dealerConfig.images.featureIcons.delivery || '';
      replacements['IMAGE_ICON_SUPPORT'] = dealerConfig.images.featureIcons.support || '';
    }
  }

  // Add content
  if (dealerConfig.content) {
    Object.assign(replacements, flattenObject(dealerConfig.content, 'CONTENT_'));
  }

  // Add layout configuration
  if (dealerConfig.layout) {
    Object.assign(replacements, flattenObject(dealerConfig.layout, 'LAYOUT_'));
  }

  // Archivos específicos a personalizar
  const specificFiles = [
    '.env.example',
    '.env',
    'deployment-config.json',
    'package.json',
    'README.md'
  ];

  specificFiles.forEach(file => {
    replaceInFile(path.join(process.cwd(), file), replacements);
  });

  // Procesar todos los archivos del proyecto
  console.log('🔄 Procesando archivos del proyecto...');
  processDirectory(process.cwd(), replacements);

  // Crear archivo de configuración del dealer
  const dealerConfigPath = path.join(process.cwd(), 'config', 'dealer.json');
  fs.mkdirSync(path.dirname(dealerConfigPath), { recursive: true });
  fs.writeFileSync(dealerConfigPath, JSON.stringify(dealerConfig, null, 2));

  console.log('✅ Personalización completada para:', dealerConfig.dealer.name);
  console.log('📝 Configuración guardada en:', dealerConfigPath);
}

// Función para validar configuración
function validateConfig(config) {
  const required = ['dealer.name', 'dealer.brand', 'api.baseUrl', 'api.dealerId'];

  for (const field of required) {
    const keys = field.split('.');
    let current = config;

    for (const key of keys) {
      if (!current[key]) {
        throw new Error(`Campo requerido faltante: ${field}`);
      }
      current = current[key];
    }
  }

  return true;
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const configPath = process.argv[2] || './deployment-config.json';

  try {
    if (!fs.existsSync(configPath)) {
      console.error('❌ Archivo de configuración no encontrado:', configPath);
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    // Validar configuración
    validateConfig(config);

    // Ejecutar personalización
    customize(config);

    console.log('🎉 ¡Template personalizado exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la personalización:', error.message);
    process.exit(1);
  }
}

module.exports = { customize, validateConfig };