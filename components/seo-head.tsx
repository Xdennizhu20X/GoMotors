import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  structuredData?: object;
  noIndex?: boolean;
}

export function SEOHead({
  title = "GoMotors - Plataforma de Vehículos Ecuador",
  description = "La plataforma líder de vehículos en Ecuador. Encuentra tu auto ideal entre miles de opciones de concesionarios verificados. Compra, vende y financia vehículos de forma segura y confiable.",
  keywords = ["vehículos Ecuador", "autos Ecuador", "concesionarios Ecuador", "comprar auto", "vender auto"],
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonical,
  structuredData,
  noIndex = false
}: SEOHeadProps) {
  const keywordsString = keywords.join(', ');
  const fullTitle = title.includes('GoMotors') ? title : `${title} | GoMotors`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />

      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="es_EC" />
      <meta property="og:site_name" content="GoMotors" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@ruedaya_ec" />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}

      {/* Additional SEO tags */}
      <meta name="author" content="GoMotors" />
      <meta name="publisher" content="GoMotors" />
      <meta name="language" content="es" />
      <meta name="geo.region" content="EC" />
      <meta name="geo.country" content="Ecuador" />
    </Head>
  );
}