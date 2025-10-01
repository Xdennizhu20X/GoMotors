'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, CardBody, Tab, Tabs, useDisclosure, Image, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from '@heroui/react';
import { StarRating } from '@/components/star-rating';
import { InteractiveStarRating } from '@/components/interactive-star-rating';
import { AdvancedCatalog } from '@/components/advanced-catalog';
import { DealerHeader } from '@/components/dealer/dealer-header';
import { DealerStats } from '@/components/dealer/dealer-stats';
import { DealerQuickActions } from '@/components/dealer/dealer-quick-actions';
import { DealerInfoCards } from '@/components/dealer/dealer-info-cards';
import { DealerReviewsSection } from '@/components/dealer/dealer-reviews-section';
import { ReviewModal } from '@/components/dealer/review-modal';
import { NotificationModal } from '@/components/ui/notification-modal';
import apiClient from '@/lib/api-client';
import type { Vehicle as VehicleType } from '@/config/vehicles';
import { useBrandColor, getBrandColorVariants } from '@/hooks/useBrandColor';

interface Dealer {
  id: string;
  name: string;
  brand: string;
  logoUrl: string;
  rating: number;
  reviewsCount: number;
  modelsAvailable: number;
  verified: boolean;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  brandColor?: string;
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  services?: string[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

interface BackendVehicle extends VehicleType {
  status?: 'available' | 'sold' | 'reserved' | 'inactive';
  available?: boolean;
}

export default function DealerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealerId = params.id as string;
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [dealer, setDealer] = useState<Dealer | null>(null);
  const [vehicles, setVehicles] = useState<BackendVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('info');

  // Review states
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewsRefreshTrigger, setReviewsRefreshTrigger] = useState(0);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [userExistingReview, setUserExistingReview] = useState(null);

  // Notification modal states
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info'
  });

  // Brand color customization
  const brandColor = useBrandColor(dealer?.brand, dealer?.brandColor);
  const colorVariants = getBrandColorVariants(brandColor);

  // Helper function to show notifications
  const showNotificationModal = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setNotificationData({ title, message, type });
    setShowNotification(true);
  };

  const fetchDealerDetails = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getDealerById(dealerId);

      console.log('Dealer detail response:', response);

      let dealerData;
      if (response.data && response.data.dealer) {
        dealerData = response.data.dealer;
      } else if (response.data) {
        dealerData = response.data;
      } else {
        dealerData = response;
      }

      if (dealerData) {
        dealerData.id = dealerData.id || dealerData._id || dealerId;
      }

      setDealer(dealerData);

      try {
        const vehiclesResponse = await apiClient.getVehicles({ dealer: dealerId });
        let vehiclesData = vehiclesResponse.data?.vehicles || vehiclesResponse.data || [];
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : []);
      } catch (vehicleError) {
        console.warn('No vehicles found for this dealer:', vehicleError);
        setVehicles([]);
      }

    } catch (error: any) {
      console.error('Error fetching dealer details:', error);
      setError(`Error al cargar los detalles del concesionario: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const checkUserReview = async () => {
    try {
      const response = await apiClient.checkUserReview(dealerId);
      if (response.success && response.data) {
        setHasUserReviewed(response.data.hasReviewed);
        setUserExistingReview(response.data.review);
      }
    } catch (error) {
      // Si no está autenticado o hay error, asumimos que no ha reseñado
      setHasUserReviewed(false);
      setUserExistingReview(null);
    }
  };

  useEffect(() => {
    if (dealerId) {
      fetchDealerDetails();
      checkUserReview(); // Verificar si el usuario ya ha reseñado
    }
  }, [dealerId]);

  const handleSubmitReview = async () => {
    if (userRating === 0) return;

    setSubmittingReview(true);
    try {
      const response = await apiClient.createReview(dealerId, {
        rating: userRating,
        comment: reviewText
      });

      if (response.success) {
        console.log('Review submitted successfully:', response.data);
        setUserRating(0);
        setReviewText('');
        onClose();
        await fetchDealerDetails();
        await checkUserReview(); // Actualizar el estado de reseña del usuario
        setReviewsRefreshTrigger(prev => prev + 1);
        showNotificationModal(
          '¡Reseña Enviada!',
          'Tu reseña ha sido enviada exitosamente y será visible una vez sea aprobada.',
          'success'
        );
      } else {
        throw new Error(response.message || 'Error al enviar la reseña');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);

      let title = 'Error al Enviar Reseña';
      let message = 'Hubo un problema al enviar tu reseña. Por favor, inténtalo nuevamente.';

      // Manejar diferentes tipos de errores
      // El error puede venir en diferentes formatos dependiendo del tipo de error
      const errorMsg = error.message || error.error?.message || error.data?.message || '';

      if (errorMsg.includes('Ya has calificado')) {
        title = 'Reseña Ya Enviada';
        message = 'Ya has calificado este concesionario anteriormente. Solo puedes enviar una reseña por concesionario.';
      } else if (errorMsg) {
        message = errorMsg;
      }

      showNotificationModal(title, message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: brandColor }}
          ></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando detalles del concesionario...</p>
        </div>
      </div>
    );
  }

  if (error || !dealer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardBody className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error || 'Concesionario no encontrado'}
            </p>
            <div className="space-x-4">
              <Button
                onClick={fetchDealerDetails}
                className="text-white"
                style={{ backgroundColor: brandColor }}
              >
                Reintentar
              </Button>
              <Button
                variant="light"
                onClick={() => router.push('/marcas')}
              >
                Volver a Marcas
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const defaultWorkingHours = {
    monday: '9:00 AM - 6:00 PM',
    tuesday: '9:00 AM - 6:00 PM',
    wednesday: '9:00 AM - 6:00 PM',
    thursday: '9:00 AM - 6:00 PM',
    friday: '9:00 AM - 6:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Cerrado'
  };

  const workingHours = dealer.workingHours || defaultWorkingHours;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header Section */}
      <DealerHeader
        dealer={dealer}
        brandColor={brandColor}
        colorVariants={colorVariants}
        onOpenReviewModal={onOpen}
        onSetActiveTab={setActiveTab}
        hasUserReviewed={hasUserReviewed}
      />

      {/* Tab Navigation */}
      <div className="relative">
        <div
          className="sticky top-0 z-40 border-b bg-white dark:bg-gray-900"
          style={{
            borderBottomColor: colorVariants.border,
          }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div style={{ '--brand-color': brandColor } as React.CSSProperties}>
              <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => setActiveTab(key as string)}
                className="w-full"
                classNames={{
                  tabList: "gap-2 sm:gap-6 w-full relative rounded-none p-0 border-b-0 bg-transparent flex-nowrap",
                  cursor: "w-full rounded-t-lg",
                  tab: "flex-1 sm:max-w-fit px-3 sm:px-6 py-4 h-12 transition-all duration-200 text-center",
                  tabContent: "font-semibold text-xs sm:text-sm transition-colors duration-200 group-data-[selected=false]:text-gray-500 dark:group-data-[selected=false]:text-gray-400"
                }}
                style={{
                  '--heroui-tabs-cursor': brandColor,
                } as React.CSSProperties}
              >
                <Tab
                  key="info"
                  title={
                    <span style={{ color: activeTab === 'info' ? brandColor : undefined }}>
                      <span className="hidden sm:inline">Información del Concesionario</span>
                      <span className="sm:hidden">Información</span>
                    </span>
                  }
                />
                <Tab
                  key="vehicles"
                  title={
                    <span style={{ color: activeTab === 'vehicles' ? brandColor : undefined }}>
                      <span className="hidden sm:inline">Catálogo de Vehículos</span>
                      <span className="sm:hidden">Catálogo</span>
                    </span>
                  }
                />
              </Tabs>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gray-50 dark:bg-black min-h-screen">
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto px-4 py-8"
              >
                <div className="grid grid-cols-12 gap-4 auto-rows-min">
                  {/* Statistics Section */}
                  <div className="col-span-12 lg:col-span-8">
                    <DealerStats dealer={dealer} brandColor={brandColor} colorVariants={colorVariants} />
                  </div>

                  {/* Quick Actions */}
                  <div className="col-span-12 lg:col-span-4">
                    <DealerQuickActions
                      brandColor={brandColor}
                      colorVariants={colorVariants}
                      onOpenReviewModal={onOpen}
                      hasUserReviewed={hasUserReviewed}
                    />
                  </div>

                  {/* Info Cards */}
                  <DealerInfoCards
                    dealer={dealer}
                    workingHours={workingHours}
                    brandColor={brandColor}
                    colorVariants={colorVariants}
                  />

                  {/* Reviews Section */}
                  <DealerReviewsSection
                    dealer={{
                      rating: dealer.rating,
                      reviewsCount: dealer.reviewsCount,
                      id: dealer.id
                    }}
                    brandColor={brandColor}
                    colorVariants={colorVariants}
                    onOpenReviewModal={onOpen}
                    refreshTrigger={reviewsRefreshTrigger}
                    hasUserReviewed={hasUserReviewed}
                  />

                  {/* About Section */}
                  {dealer.description && (
                    <div className="col-span-12">
                      <Card className="p-6 border bg-white dark:bg-gray-900" style={{ borderColor: colorVariants.border }}>
                        <h3 className="font-semibold mb-3" style={{ color: brandColor }}>
                          Acerca de {dealer.name}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {dealer.description}
                        </p>
                      </Card>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'vehicles' && (
              <motion.div
                key="vehicles"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <AdvancedCatalog dealerId={dealerId} className="bg-gray-50 dark:bg-black" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        dealerName={dealer.name}
        userRating={userRating}
        setUserRating={setUserRating}
        reviewText={reviewText}
        setReviewText={setReviewText}
        submittingReview={submittingReview}
        handleSubmitReview={handleSubmitReview}
        brandColor={brandColor}
      />

      {/* Notification Modal */}
      <NotificationModal
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
        title={notificationData.title}
        message={notificationData.message}
        type={notificationData.type}
        brandColor={brandColor}
      />
    </div>
  );
}