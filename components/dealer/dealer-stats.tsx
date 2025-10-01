'use client';

import { Card } from '@heroui/react';
import { StarRating } from '@/components/star-rating';

interface DealerStatsProps {
  dealer: {
    rating: number;
    reviewsCount: number;
    modelsAvailable: number;
  };
  brandColor: string;
  colorVariants: {
    lightest: string;
    border: string;
  };
}

export function DealerStats({ dealer, brandColor, colorVariants }: DealerStatsProps) {
  return (
    <Card className="p-6 border bg-white dark:bg-gray-900" style={{ borderColor: colorVariants.border }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg border-r border-gray-200 dark:border-gray-700 last:border-r-0" style={{ backgroundColor: 'transparent' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: brandColor }}>{dealer.rating.toFixed(2)}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">Calificación</div>
          <StarRating rating={dealer.rating} className="justify-center" />
        </div>
        <div className="text-center p-4 rounded-lg border-r border-gray-200 dark:border-gray-700 last:border-r-0" style={{ backgroundColor: 'transparent' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: brandColor }}>{dealer.reviewsCount}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Reseñas de clientes</div>
        </div>
        <div className="text-center p-4 rounded-lg" style={{ backgroundColor: 'transparent' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: brandColor }}>{dealer.modelsAvailable}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Modelos disponibles</div>
        </div>
      </div>
    </Card>
  );
}