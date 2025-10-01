'use client';

import { useState, useEffect } from 'react';
import { Card, Button } from '@heroui/react';
import { StarRating } from '@/components/star-rating';
import apiClient from '@/lib/api-client';

interface Review {
  id?: string;
  _id?: string;
  name?: string;
  user?: {
    name?: string;
    email?: string;
  };
  rating?: number;
  comment?: string;
  createdAt: string;
}

interface DealerReviewsSectionProps {
  dealer: {
    rating: number;
    reviewsCount: number;
    id: string;
  };
  brandColor: string;
  colorVariants: {
    lightest: string;
    background: string;
    border: string;
  };
  onOpenReviewModal: () => void;
  refreshTrigger?: number;
  hasUserReviewed?: boolean;
}

export function DealerReviewsSection({ dealer, brandColor, colorVariants, onOpenReviewModal, refreshTrigger, hasUserReviewed }: DealerReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getDealerReviews(dealer.id, {
          page: 1,
          limit: 3,
          sort: '-createdAt'
        });

        if (response.success && response.data) {
          const reviewsData = response.data.reviews || response.data || [];
          // Filtrar y validar reseñas para evitar errores
          const validReviews = Array.isArray(reviewsData)
            ? reviewsData.filter(review => review && (review.id || review._id) && review.createdAt)
            : [];
          setReviews(validReviews);
        }
      } catch (error) {
        console.warn('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    if (dealer.id) {
      fetchReviews();
    }
  }, [dealer.id, refreshTrigger]);

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'Fecha no disponible';

      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Fecha inválida';

      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return 'Hace 1 día';
      if (diffDays < 7) return `Hace ${diffDays} días`;
      if (diffDays < 14) return 'Hace 1 semana';
      if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
      return `Hace ${Math.ceil(diffDays / 30)} meses`;
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Fecha no disponible';
    }
  };

  return (
    <div className="col-span-12">
      <Card className="p-6 border bg-white dark:bg-gray-900" style={{ borderColor: colorVariants.border }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold" style={{ color: brandColor }}>Reseñas y Calificaciones</h3>
          {hasUserReviewed ? (
            <Button
              size="sm"
              variant="light"
              isDisabled
              className="opacity-50 cursor-not-allowed"
              style={{
                color: brandColor,
                backgroundColor: 'transparent',
              }}
            >
              Ya has calificado
            </Button>
          ) : (
            <Button
              size="sm"
              variant="light"
              className="hover:opacity-80"
              style={{
                color: brandColor,
                backgroundColor: 'transparent',
              }}
              onPress={onOpenReviewModal}
            >
              Escribir Reseña
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Compact Rating Summary */}
          <div className="lg:col-span-1">
            <div
              className="text-center p-4 rounded-lg"
              style={{
                backgroundColor: colorVariants.lightest,
              }}
            >
              <div className="text-3xl font-bold mb-1" style={{ color: brandColor }}>{dealer.rating.toFixed(2)}</div>
              <StarRating rating={dealer.rating} className="justify-center mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {dealer.reviewsCount} reseñas
              </p>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="lg:col-span-3">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cargando reseñas...</p>
                </div>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id || review._id}
                    className="p-3 rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 dark:text-white text-sm">
                          {review.name || review.user?.name || 'Usuario Anónimo'}
                        </span>
                        <StarRating rating={review.rating || 0} />
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment || 'Sin comentario'}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Aún no hay reseñas para este concesionario
                  </p>
                  {hasUserReviewed ? (
                    <Button
                      size="sm"
                      isDisabled
                      className="opacity-50 cursor-not-allowed"
                      style={{
                        backgroundColor: brandColor,
                        color: 'white',
                      }}
                    >
                      Ya has calificado
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      style={{
                        backgroundColor: brandColor,
                        color: 'white',
                      }}
                      onPress={onOpenReviewModal}
                    >
                      ¡Sé el primero en dejar una reseña!
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}