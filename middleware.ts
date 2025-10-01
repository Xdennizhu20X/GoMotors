import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();

  // Check if there's a dealer parameter in the URL
  const dealerParam = url.searchParams.get('dealer');

  // Extract subdomain for backward compatibility
  const cleanHostname = hostname.split(':')[0];
  const isProductionDomain = cleanHostname.includes('ruedaya.com');
  const isLocalDomain = cleanHostname.includes('.local') || cleanHostname === 'localhost' || cleanHostname.startsWith('127.0.0.1');

  let subdomain = '';
  let isMainDomain = false;
  let dealerSlug = '';

  // Priority 1: Check for dealer parameter in URL
  if (dealerParam) {
    const validDealers = ['peugeot-loja', 'nissan-loja', 'toyota-loja', 'ford-loja', 'chevrolet-loja', 'hyundai-loja', 'kia-loja', 'volkswagen-loja', 'mazda-loja', 'honda-loja'];
    if (validDealers.includes(dealerParam)) {
      dealerSlug = dealerParam;
      isMainDomain = false;
    } else {
      isMainDomain = true;
    }
  }
  // Priority 2: Check subdomain for backward compatibility
  else if (isProductionDomain) {
    const parts = cleanHostname.split('.');
    if (parts.length >= 2) {
      subdomain = parts[0];
      isMainDomain = subdomain === 'ruedaya' || subdomain === 'www';
      if (!isMainDomain) {
        dealerSlug = subdomain;
      }
    } else {
      isMainDomain = true;
    }
  } else if (isLocalDomain) {
    if (cleanHostname.includes('.local')) {
      const parts = cleanHostname.split('.');
      subdomain = parts[0];
      isMainDomain = subdomain === 'ruedaya' || subdomain === 'www';
      if (!isMainDomain) {
        dealerSlug = subdomain;
      }
    } else {
      isMainDomain = true;
    }
  } else {
    // Default case - main domain
    isMainDomain = true;
  }

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/static') ||
    url.pathname.includes('.') ||
    url.pathname === '/favicon.ico' ||
    url.pathname === '/robots.txt' ||
    url.pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // Debug logging for development
  console.log(`[Middleware] hostname: ${cleanHostname}, dealerParam: ${dealerParam}, dealerSlug: ${dealerSlug}, isMainDomain: ${isMainDomain}`);

  // If it's a dealer (from param or subdomain), rewrite to dealer routes
  if (!isMainDomain && dealerSlug) {
    console.log(`[Middleware] Rewriting to dealer route with slug: ${dealerSlug}`);

    // Remove dealer param from URL for cleaner rewrite
    const cleanUrl = new URL(url);
    cleanUrl.searchParams.delete('dealer');

    const response = NextResponse.rewrite(new URL(`/dealer${cleanUrl.pathname}${cleanUrl.search}`, request.url));
    response.headers.set('x-dealer-slug', dealerSlug);
    response.headers.set('x-is-dealer', 'true');
    return response;
  }

  // For main domain, add headers to indicate it's not a dealer
  console.log(`[Middleware] Main domain detected: ${cleanHostname}`);
  const response = NextResponse.next();
  response.headers.set('x-is-dealer', 'false');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};