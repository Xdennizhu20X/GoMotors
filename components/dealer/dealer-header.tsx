'use client';

import { motion } from 'framer-motion';
import { Button, Image, Chip } from '@heroui/react';
import { StarRating } from '@/components/star-rating';

interface DealerHeaderProps {
  dealer: {
    id: string;
    name: string;
    brand: string;
    logoUrl: string;
    rating: number;
    reviewsCount: number;
    modelsAvailable: number;
    verified: boolean;
    description?: string;
  };
  brandColor: string;
  colorVariants: {
    primary: string;
    light: string;
    lighter: string;
    lightest: string;
    gradient: string;
    radialGradient: string;
    background: string;
    border: string;
  };
  onOpenReviewModal: () => void;
  onSetActiveTab: (tab: string) => void;
  hasUserReviewed?: boolean;
}

export function DealerHeader({
  dealer,
  brandColor,
  colorVariants,
  onOpenReviewModal,
  onSetActiveTab,
  hasUserReviewed
}: DealerHeaderProps) {
  return (
    <div
      className="relative border-b bg-white dark:bg-gray-900 overflow-hidden"
      style={{
        borderBottomColor: colorVariants.border,
      }}
    >
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
        style={{ backgroundColor: brandColor }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 translate-y-1/2 -translate-x-1/2"
        style={{ backgroundColor: brandColor }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-8 items-start"
        >
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <div
              className="w-32 h-32 rounded-xl flex items-center justify-center p-4 bg-white dark:bg-gray-800 border-2"
              style={{
                borderColor: colorVariants.border,
              }}
            >
              <Image
                removeWrapper
                alt={`${dealer.name} logo`}
                className="object-contain w-full h-full"
                style={{
                  filter: `sepia(0.3) saturate(1.5) brightness(0.9)`,
                  mixBlendMode: 'multiply' as const,
                  opacity: 0.9
                }}
                src={dealer.logoUrl}
              />
              <div
                className="absolute inset-0 rounded-full opacity-10"
                style={{ backgroundColor: brandColor }}
              />
            </div>
          </div>

          {/* Dealer Info */}
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                      {dealer.name}
                    </h1>
                    {dealer.verified && (
                      <Chip
                        className="text-white font-semibold self-start sm:ml-3"
                        style={{
                          backgroundColor: brandColor,
                          color: 'white',
                        }}
                      >
                        ✓ Verificado
                      </Chip>
                    )}
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    Marca: {dealer.brand}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-2">
                <StarRating rating={dealer.rating} />
                <span className="font-medium text-gray-900 dark:text-white">
                  {dealer.rating.toFixed(2)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  ({dealer.reviewsCount} reseñas)
                </span>
              </div>
              <div className="font-semibold" style={{ color: brandColor }}>
                {dealer.modelsAvailable} modelos disponibles
              </div>
            </div>

            {dealer.description && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {dealer.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button
                className="text-white font-semibold px-6 py-2"
                style={{ backgroundColor: brandColor }}
                onClick={() => onSetActiveTab('vehicles')}
              >
                Ver Catálogo de Vehículos
              </Button>
              <Button
                variant="bordered"
                className="font-semibold px-6 py-2"
                style={{
                  borderColor: brandColor,
                  color: brandColor,
                }}
              >
                Contactar Concesionario
              </Button>
              {hasUserReviewed ? (
                <Button
                  variant="bordered"
                  className="border-yellow-400 text-yellow-600 font-semibold px-6 py-2 opacity-50 cursor-not-allowed"
                  isDisabled
                >
                  ⭐ Ya has calificado
                </Button>
              ) : (
                <Button
                  variant="bordered"
                  className="border-yellow-400 text-yellow-600 font-semibold px-6 py-2 hover:bg-yellow-50"
                  onPress={onOpenReviewModal}
                >
                  ⭐ Calificar Concesionario
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}