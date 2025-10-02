import "@/styles/globals.css";
import "@/styles/custom.css";
import "@/styles/patterns.css";
import "@/styles/typography.css";
import { Metadata, Viewport } from "next";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";
import { DealerProvider } from "@/contexts/DealerContext";

import { siteConfig } from "@/config/site";
import { fontSans, fontHeading, fontDisplay } from "@/config/fonts";
import { DealerNavbar } from "@/components/dealer/dealer-navbar";
import { Footer } from "@/components/footer";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "vehículos Ecuador",
    "autos Ecuador",
    "concesionarios Ecuador",
    "comprar auto",
    "vender auto",
    "financiamiento vehicular",
    "carros usados",
    "carros nuevos",
    "Quito",
    "Guayaquil",
    "Cuenca"
  ],
  authors: [{ name: "GoMotors" }],
  creator: "GoMotors",
  publisher: "GoMotors",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ruedaya.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_EC',
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/og-image.jpg'],
    creator: '@ruedaya_ec',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/gomotorsfavico.png",
    shortcut: "/gomotorsfavico.png",
    apple: "/gomotorsfavico.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const dealerSlug = headersList.get('x-dealer-slug') || undefined;

  return (
    <html suppressHydrationWarning lang="es">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable,
          fontDisplay.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <DealerProvider initialIsDealer={true} initialSlug={dealerSlug}>
            <div className="relative flex flex-col min-h-screen" data-dealer-theme>
              <DealerNavbar />
              <main className="container mx-auto max-w-9xl flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </DealerProvider>
        </Providers>
      </body>
    </html>
  );
}
