'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from '@heroui/react';
import { InteractiveStarRating } from '@/components/interactive-star-rating';

interface ReviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  dealerName: string;
  userRating: number;
  setUserRating: (rating: number) => void;
  reviewText: string;
  setReviewText: (text: string) => void;
  submittingReview: boolean;
  handleSubmitReview: () => void;
  brandColor: string;
}

export function ReviewModal({
  isOpen,
  onOpenChange,
  dealerName,
  userRating,
  setUserRating,
  reviewText,
  setReviewText,
  submittingReview,
  handleSubmitReview,
  brandColor
}: ReviewModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">Calificar {dealerName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Comparte tu experiencia con este concesionario
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">
                    ¿Cómo calificarías este concesionario?
                  </label>
                  <InteractiveStarRating
                    onRatingChange={setUserRating}
                    initialRating={userRating}
                    size="lg"
                    className="justify-center"
                  />
                  {userRating > 0 && (
                    <p className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {userRating === 1 && "Muy malo"}
                      {userRating === 2 && "Malo"}
                      {userRating === 3 && "Regular"}
                      {userRating === 4 && "Bueno"}
                      {userRating === 5 && "Excelente"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cuéntanos sobre tu experiencia (opcional)
                  </label>
                  <Textarea
                    value={reviewText}
                    onValueChange={setReviewText}
                    placeholder="Describe tu experiencia con este concesionario, el servicio recibido, la atención al cliente, etc."
                    minRows={4}
                    maxRows={8}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                className="text-white"
                style={{ backgroundColor: brandColor }}
                onPress={handleSubmitReview}
                isDisabled={userRating === 0}
                isLoading={submittingReview}
              >
                {submittingReview ? "Enviando..." : "Enviar Reseña"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}