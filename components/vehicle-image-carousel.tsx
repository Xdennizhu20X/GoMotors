"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@heroui/button'
import { Card } from '@heroui/react'
import NextImage from 'next/image'

interface VehicleImage {
  src: string
  label: string
}

interface VehicleImageCarouselProps {
  images: VehicleImage[]
  vehicleName: string
  isAIGenerated?: boolean
}

export const VehicleImageCarousel = ({ images, vehicleName, isAIGenerated = false }: VehicleImageCarouselProps) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = () => {
    setDirection(1)
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setDirection(-1)
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const [direction, setDirection] = useState(0)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  return (
    <div className="w-full space-y-3">
      {/* Carrusel principal - Muy compacto */}
      <Card className="relative w-full aspect-[5/3] overflow-hidden bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
        <div className="relative w-full h-full">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentImage}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x)

                if (swipe < -swipeConfidenceThreshold) {
                  nextImage()
                } else if (swipe > swipeConfidenceThreshold) {
                  prevImage()
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing z-0"
            >
              <NextImage
                src={images[currentImage].src}
                alt={`${vehicleName} - ${images[currentImage].label}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={currentImage === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Etiqueta de vista actual */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            {images[currentImage].label}
          </div>

          {/* AI disclaimer */}
          {isAIGenerated && (
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white/80 px-3 py-1 rounded text-xs z-10 max-w-[calc(100%-8rem)]">
              Generadas con IA y son parecidas pero no como lo original
            </div>
          )}

          {/* Controles del carrusel */}
          <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2 flex justify-between pointer-events-none z-10">
            <Button
              isIconOnly
              variant="flat"
              className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm pointer-events-auto"
              onClick={prevImage}
              size="lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              isIconOnly
              variant="flat"
              className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm pointer-events-auto"
              onClick={nextImage}
              size="lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {/* Botón de pantalla completa */}
          <Button
            isIconOnly
            variant="flat"
            className="absolute top-4 right-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm z-10"
            onClick={() => setIsFullscreen(true)}
            size="sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </Button>

          {/* Contador */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            {currentImage + 1} / {images.length}
          </div>
        </div>
      </Card>

      {/* Miniaturas - Más pequeñas */}
      <div className="flex gap-1.5 justify-center">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`flex-shrink-0 relative w-14 h-11 rounded-md overflow-hidden border-2 transition-all ${
              index === currentImage
                ? 'border-[#1341ee] ring-2 ring-[#1341ee]/20'
                : 'border-gray-200 dark:border-neutral-700 hover:border-[#1341ee]/50'
            }`}
          >
            <NextImage
              src={image.src}
              alt={image.label}
              fill
              className="object-cover"
              sizes="56px"
            />
            <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
            {index === currentImage && (
              <div className="absolute inset-0 bg-[#1341ee]/20" />
            )}
          </button>
        ))}
      </div>


      {/* Modal de pantalla completa */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-16 left-0 right-0 bottom-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-6xl max-h-full w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <NextImage
                src={images[currentImage].src}
                alt={`${vehicleName} - ${images[currentImage].label} - Vista completa`}
                fill
                className="object-contain"
                sizes="100vw"
              />
              
              <Button
                isIconOnly
                variant="flat"
                className="absolute top-4 right-4 bg-white/20 text-white"
                onClick={() => setIsFullscreen(false)}
                size="lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>

              {/* AI disclaimer en fullscreen */}
              {isAIGenerated && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white/80 px-4 py-2 rounded text-sm z-10">
                  Generadas con IA y son parecidas pero no como lo original
                </div>
              )}

              {/* Controles en pantalla completa */}
              <div className="absolute inset-x-4 top-1/2 transform -translate-y-1/2 flex justify-between">
                <Button
                  isIconOnly
                  variant="flat"
                  className="bg-white/20 text-white"
                  onClick={prevImage}
                  size="lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                <Button
                  isIconOnly
                  variant="flat"
                  className="bg-white/20 text-white"
                  onClick={nextImage}
                  size="lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}