/**
 * Fetch Dealer Theme at Build Time
 * This script fetches the dealer configuration from the backend API
 * and saves it as a local JSON file for instant loading (no cold start delay)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

/**
 * Load environment variables from .env.local file
 */
function loadEnvFile() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    return;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');

  lines.forEach((line) => {
    // Skip comments and empty lines
    line = line.trim();
    if (!line || line.startsWith('#')) {
      return;
    }

    // Parse KEY=VALUE
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Set in process.env if not already set
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

// Load .env.local at startup
loadEnvFile();

async function fetchTheme() {
  const dealerId = process.env.NEXT_PUBLIC_DEALER_ID;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  log('\n🎨 Fetching dealer theme configuration...', colors.cyan);

  // Validate required environment variables
  if (!dealerId) {
    log('⚠️  Warning: NEXT_PUBLIC_DEALER_ID not set', colors.yellow);
    log('   Using placeholder theme configuration', colors.yellow);
    createPlaceholderTheme();
    return;
  }

  if (!apiUrl) {
    log('⚠️  Warning: NEXT_PUBLIC_API_URL not set', colors.yellow);
    log('   Using placeholder theme configuration', colors.yellow);
    createPlaceholderTheme();
    return;
  }

  log(`   Dealer ID: ${dealerId}`, colors.blue);
  log(`   API URL: ${apiUrl}`, colors.blue);

  try {
    const endpoint = `${apiUrl}/dealers/${dealerId}/configuration/complete`;
    log(`\n📡 Fetching from: ${endpoint}`, colors.cyan);

    const response = await fetchWithTimeout(endpoint, 15000); // 15 second timeout

    if (!response.success) {
      throw new Error(response.error || 'Failed to fetch theme');
    }

    // Save the configuration to file
    const configDir = path.join(__dirname, '../config');
    const configPath = path.join(configDir, 'dealer-theme.json');

    // Ensure config directory exists
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Write the theme configuration
    fs.writeFileSync(
      configPath,
      JSON.stringify(response.data, null, 2),
      'utf8'
    );

    log('\n✅ Theme configuration saved successfully!', colors.green);
    log(`   File: config/dealer-theme.json`, colors.green);

    // Log theme details
    const theme = response.data;
    if (theme.dealer) {
      log(`   Dealer: ${theme.dealer.name}`, colors.blue);
      log(`   Brand: ${theme.dealer.brand || 'N/A'}`, colors.blue);
    }
    if (theme.theme?.colors?.primary) {
      log(`   Primary Color: ${theme.theme.colors.primary}`, colors.blue);
    }

    log('\n🚀 Build can proceed with cached theme\n', colors.green);

  } catch (error) {
    log('\n❌ Error fetching theme:', colors.red);
    log(`   ${error.message}`, colors.red);

    // Check if we have a previous theme file to fall back on
    const configPath = path.join(__dirname, '../config/dealer-theme.json');
    if (fs.existsSync(configPath)) {
      log('\n⚠️  Using previously cached theme configuration', colors.yellow);
      log('   Build will proceed with existing theme\n', colors.yellow);
    } else {
      log('\n⚠️  Creating placeholder theme configuration', colors.yellow);
      log('   Build will proceed with default theme\n', colors.yellow);
      createPlaceholderTheme();
    }
  }
}

/**
 * Fetch with timeout
 */
function fetchWithTimeout(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const request = protocol.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${error.message}`));
        }
      });
    });

    request.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    request.setTimeout(timeout, () => {
      request.destroy();
      reject(new Error(`Request timeout after ${timeout}ms`));
    });
  });
}

/**
 * Create a placeholder theme configuration
 * Used when API is not available or dealer ID is not set
 */
function createPlaceholderTheme() {
  const placeholderTheme = {
    dealer: {
      _id: process.env.NEXT_PUBLIC_DEALER_ID || 'placeholder-id',
      id: process.env.NEXT_PUBLIC_DEALER_ID || 'placeholder-id',
      slug: 'placeholder-dealer',
      name: 'Example Dealer',
      displayName: 'Example Dealer',
      logo: 'https://cdn.example.com/logo.png',
      description: 'Concesionario líder en vehículos',
      brand: 'Toyota',
      email: 'contacto@example.com',
      phone: '+593 99 999 9999',
      location: 'Quito, Ecuador',
      address: 'Av. Principal 123, Quito',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    theme: {
      colors: {
        primary: '#CC0000',
        secondary: '#1a1a1a',
        accent: '#FFD700',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      typography: {
        fontSans: 'Inter, system-ui, sans-serif',
        fontHeading: 'Inter, system-ui, sans-serif',
        fontDisplay: 'Inter, system-ui, sans-serif',
        fontMono: 'Monaco, monospace',
      },
    },
    images: {
      logo: 'https://cdn.example.com/logo.png',
      favicon: 'https://cdn.example.com/favicon.png',
      hero: 'https://cdn.example.com/hero.jpg',
    },
    content: {
      siteName: 'Example Dealer',
      siteDescription: 'Encuentra los mejores vehículos en Ecuador',
      hero: {
        title: 'Bienvenido a Example Dealer',
        subtitle: 'Tu concesionario de confianza',
        description: 'Encuentra los mejores vehículos en Ecuador',
        ctaPrimary: 'Ver Inventario',
        ctaSecondary: 'Contáctanos',
      },
    },
    social: {
      facebook: '',
      instagram: '',
      whatsapp: '',
    },
  };

  const configDir = path.join(__dirname, '../config');
  const configPath = path.join(configDir, 'dealer-theme.json');

  // Ensure config directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  fs.writeFileSync(
    configPath,
    JSON.stringify(placeholderTheme, null, 2),
    'utf8'
  );

  log('   Created: config/dealer-theme.json', colors.yellow);
}

// Run the script
fetchTheme().catch((error) => {
  log('\n❌ Fatal error:', colors.red);
  log(`   ${error.message}`, colors.red);
  process.exit(1);
});
