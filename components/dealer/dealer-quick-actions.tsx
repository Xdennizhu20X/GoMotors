'use client';

import { Card, Button } from '@heroui/react';

interface DealerQuickActionsProps {
  brandColor: string;
  colorVariants: {
    lightest: string;
    light: string;
    border: string;
  };
  onOpenReviewModal: () => void;
  hasUserReviewed?: boolean;
}

export function DealerQuickActions({ brandColor, colorVariants, onOpenReviewModal, hasUserReviewed }: DealerQuickActionsProps) {
  return (
    <Card className="p-6 h-full border bg-white dark:bg-gray-900" style={{ borderColor: colorVariants.border }}>
      <h3 className="font-semibold mb-4" style={{ color: brandColor }}>
        Acciones Rápidas
      </h3>
      <div className="space-y-3">
        <Button
          className="w-full text-white font-semibold"
          style={{
            backgroundColor: brandColor,
          }}
          size="sm"
        >
          Contactar Concesionario
        </Button>
        {hasUserReviewed ? (
          <Button
            variant="bordered"
            className="w-full font-semibold opacity-50 cursor-not-allowed"
            isDisabled
            style={{
              borderColor: brandColor,
              color: brandColor,
              backgroundColor: colorVariants.lightest,
            }}
            size="sm"
          >
            Ya has calificado
          </Button>
        ) : (
          <Button
            variant="bordered"
            className="w-full font-semibold"
            style={{
              borderColor: brandColor,
              color: brandColor,
              backgroundColor: colorVariants.lightest,
            }}
            onPress={onOpenReviewModal}
            size="sm"
          >
            Escribir Reseña
          </Button>
        )}
      </div>
    </Card>
  );
}