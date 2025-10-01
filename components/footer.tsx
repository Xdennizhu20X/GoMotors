'use client';

import { useDealerTheme } from '@/hooks/useDealerTheme';
import Link from 'next/link';

export function Footer() {
  const { primaryColor, dealer } = useDealerTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-default-200 bg-white dark:bg-neutral-900 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="text-sm text-default-600">
              © {currentYear} {dealer?.name || 'Concesionaria'}. Todos los derechos reservados.
            </p>
          </div>

          {/* Powered by RuedaYa */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-default-500">Desarrollado por</span>
            <Link
              href="https://ruedaya.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline transition-colors"
              style={{ color: primaryColor }}
            >
              RuedaYa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
