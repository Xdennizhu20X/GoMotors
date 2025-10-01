'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardBody, CardFooter, Image } from '@heroui/react';
import { HeartFilledIcon } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useDealerTheme } from '@/hooks/useDealerTheme';
import type { Vehicle } from '@/config/vehicles';

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

export const VehicleCard = ({ vehicle, index = 0 }: VehicleCardProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { wishlistStatus, checkWishlistStatus, toggleWishlist } = useWishlist();
  const { primaryColor } = useDealerTheme();

  // Get vehicle ID (prioritize MongoDB _id over simple id)
  const vehicleId = (vehicle as any)._id || vehicle.id;
  const isInWishlist = wishlistStatus[vehicleId] || false;

  // No longer need to check individual status - data is loaded globally by useWishlist hook

  // Handle wishlist toggle
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (vehicleId) {
      await toggleWishlist(vehicleId);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const hoverVariants = {
    y: -8,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTransmissionLabel = (transmission: string) => {
    const labels = {
      manual: 'Manual',
      automatica: 'Automática',
      cvt: 'CVT'
    };
    return labels[transmission as keyof typeof labels] || transmission;
  };

  const getFuelTypeLabel = (fuelType: string) => {
    const labels = {
      gasolina: 'Gasolina',
      diesel: 'Diesel',
      hibrido: 'Híbrido',
      electrico: 'Eléctrico'
    };
    return labels[fuelType as keyof typeof labels] || fuelType;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={hoverVariants}
      className="w-full group"
    >
      <Card className="relative w-full overflow-hidden rounded-xl border border-gray-200/30 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-md hover:shadow-lg transition-all duration-300">
        
        {/* Image Header */}
        <div className="relative">
          <div className="h-48 bg-gray-50/50 dark:bg-neutral-800 overflow-hidden">
            <Image
              removeWrapper
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={vehicle.imageUrl}
            />
          </div>
          
          {/* Year Badge - Top Left */}
          <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-semibold">
            {vehicle.year}
          </div>
          
          {/* Heart Icon - Top Right */}
          <button
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remover de favoritos" : "Agregar a favoritos"}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 z-10 ${
              isInWishlist
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <HeartFilledIcon className="w-4 h-4" />
          </button>
        </div>

        <CardBody className="p-4">
          {/* Stock Badge */}
          <div className="flex justify-between items-start mb-3">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              vehicle.stock > 5 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : vehicle.stock > 2
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {vehicle.stock} en stock
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="space-y-3">
            {/* Brand & Model */}
            <div>
              <h3
                className="font-bold text-lg text-foreground transition-colors duration-300"
                style={{
                  // @ts-ignore
                  '--hover-color': primaryColor
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = primaryColor}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                {vehicle.brand} {vehicle.model}
              </h3>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                <span className="text-foreground/70">
                  {getTransmissionLabel(vehicle.transmission)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                <span className="text-foreground/70">
                  {getFuelTypeLabel(vehicle.fuelType)}
                </span>
              </div>

              {vehicle.mileage !== undefined && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                  <span className="text-foreground/70">
                    {vehicle.mileage === 0 ? 'Nuevo' : `${vehicle.mileage.toLocaleString()} km`}
                  </span>
                </div>
              )}

              {vehicle.color && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></div>
                  <span className="text-foreground/70">
                    {vehicle.color}
                  </span>
                </div>
              )}
            </div>

            {/* Location */}
            {vehicle.location && (
              <div className="flex items-center gap-1 text-sm">
                <svg className="w-4 h-4 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-foreground/60">{vehicle.location}</span>
              </div>
            )}

            {/* Price */}
            <div className="pt-2">
              <p className="text-2xl font-black" style={{ color: primaryColor }}>
                {formatPrice(vehicle.price)}
              </p>
            </div>
          </div>
        </CardBody>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full text-white font-semibold py-2 rounded-lg transition-all duration-300"
            style={{ backgroundColor: primaryColor }}
            size="sm"
            onPress={() => {
              // Prioritize MongoDB _id over simple id
              const navigationId = (vehicle as any)._id || vehicle.id;
              console.log('Navigating with ID:', navigationId, 'from vehicle:', vehicle);
              if (navigationId) {
                router.push(`/vehiculos/${navigationId}`);
              } else {
                console.error('Vehicle missing both _id and id:', vehicle);
              }
            }}
          >
            Ver Detalles
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};