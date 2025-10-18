"use client"

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@heroui/button'
import { Card, CardBody } from '@heroui/react'
import { vehicles } from '@/config/vehicles'
import { VehicleImageCarousel } from '@/components/vehicle-image-carousel'
import { VehicleInfo } from '@/components/vehicle-info'
import { VehiclePurchase } from '@/components/vehicle-purchase'
import apiClient from '@/lib/api-client'
import type { Vehicle } from '@/config/vehicles'
import { trackViewItem, trackPageView } from '@/lib/analytics'

interface VehicleDetailPageProps {
  params: Promise<{ id: string }>
}

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const [vehicleId, setVehicleId] = useState<string | null>(null)
  const [vehicle, setVehicle] = useState<any>(null)
  const [selectedColor, setSelectedColor] = useState<string>('Blanco')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Resolve params Promise and find vehicle
  useEffect(() => {
    const loadVehicle = async () => {
      try {
        setLoading(true)
        const resolvedParams = await params
        let foundVehicle: Vehicle | null = null
        
        console.log('Loading vehicle with ID:', resolvedParams.id)
        
        // First try to fetch from API
        try {
          console.log('Attempting to fetch vehicle from API...')
          const response = await apiClient.getVehicleById(resolvedParams.id)
          if ((response as any).success && response.data) {
            foundVehicle = response.data
            console.log('Vehicle loaded from API successfully:', foundVehicle)
          }
        } catch (apiError) {
          console.warn('API fetch failed, trying static vehicles:', apiError)
          // Continue to static fallback - don't throw error here
        }
        
        // If API fails, try static vehicles
        if (!foundVehicle) {
          console.log('Searching in static vehicles...')
          // Try _id first (MongoDB), then regular id
          foundVehicle = vehicles.find(v => 
            (v as any)._id === resolvedParams.id || v.id === resolvedParams.id
          ) || null;
          
          // If not found by direct ID, try pattern matching for non-MongoDB IDs
          if (!foundVehicle) {
            const isMongoId = /^[0-9a-fA-F]{24}$/.test(resolvedParams.id);
            if (!isMongoId) {
              // Only try pattern matching for non-MongoDB IDs
              const idParts = resolvedParams.id.split('-');
              if (idParts.length >= 2) {
                const [brand, model] = idParts;
                foundVehicle = vehicles.find(v => 
                  v.brand?.toLowerCase().replace(/\s+/g, '-') === brand &&
                  v.model?.toLowerCase().replace(/\s+/g, '-') === model
                ) || null;
              }
            }
          }
          
          if (foundVehicle) {
            console.log('Vehicle found in static data')
          }
        }
        
        if (!foundVehicle) {
          console.error('Vehicle not found with ID:', resolvedParams.id)
          setError('Vehículo no encontrado')
          setLoading(false)
          return
        }
        
        // Normalize vehicle data
        const normalizedVehicle = {
          ...foundVehicle,
          id: (foundVehicle as any)._id || foundVehicle.id || resolvedParams.id, // Prioritize _id from MongoDB
          imageUrl: foundVehicle.imageUrl || (foundVehicle as any).image || '/carro.png',
          transmission: foundVehicle.transmission || 'manual',
          fuelType: foundVehicle.fuelType || 'gasolina',
          rating: (foundVehicle as any).dealer?.rating || (foundVehicle as any).rating || 4.0,
          mileage: foundVehicle.mileage || 0,
          stock: (foundVehicle as any).stock || 1,
        }
        
        console.log('Vehicle loaded successfully:', normalizedVehicle.brand, normalizedVehicle.model)
        setVehicleId(resolvedParams.id)
        setVehicle(normalizedVehicle)
        setSelectedColor(normalizedVehicle.color || 'Blanco')
        setError(null)

      } catch (error) {
        console.error('Error loading vehicle:', error)
        setError('Error al cargar el vehículo')
      } finally {
        setLoading(false)
      }
    }

    loadVehicle()
  }, [params])

  // Track vehicle view when vehicle is loaded
  useEffect(() => {
    if (vehicle && typeof window !== 'undefined') {
      // Track vehicle view
      trackViewItem({
        item_id: vehicle.id,
        item_name: `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        item_category: 'vehicle',
        item_brand: vehicle.brand,
        price: vehicle.price,
        currency: 'USD',
        dealer_id: (vehicle as any).dealer?._id || (vehicle as any).dealer || (vehicle as any).dealerId,
      });

      // Track page view
      trackPageView(
        window.location.pathname,
        `${vehicle.brand} ${vehicle.model} ${vehicle.year} - Detalles del Vehículo`
      );
    }
  }, [vehicle])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1341ee] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando vehículo...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {error}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            El vehículo que buscas no está disponible o no existe.
          </p>
          <Button
            className="bg-[#1341ee] text-white"
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </div>
      </div>
    )
  }

  // If no vehicle found
  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚗</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Vehículo no encontrado
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            El vehículo que buscas no está disponible.
          </p>
          <Button
            className="bg-[#1341ee] text-white"
            onClick={() => window.history.back()}
          >
            Volver
          </Button>
        </div>
      </div>
    )
  }

  // Construir array de imágenes 3D del vehículo (independientes del color)
  const buildVehicle3DImages = (vehicle: any) => {
    const images3D: { src: string; label: string }[] = []

    if (vehicle.images3D) {
      if (vehicle.images3D.general) {
        images3D.push({ src: vehicle.images3D.general, label: 'Vista General' })
      }
      if (vehicle.images3D.front) {
        images3D.push({ src: vehicle.images3D.front, label: 'Vista Frontal' })
      }
      if (vehicle.images3D.side) {
        images3D.push({ src: vehicle.images3D.side, label: 'Vista Lateral' })
      }
      if (vehicle.images3D.back) {
        images3D.push({ src: vehicle.images3D.back, label: 'Vista Trasera' })
      }
      if (vehicle.images3D.top) {
        images3D.push({ src: vehicle.images3D.top, label: 'Vista Superior' })
      }
    }

    // Si no hay imágenes 3D, usar imagen principal como fallback
    if (images3D.length === 0 && vehicle.imageUrl) {
      images3D.push({ src: vehicle.imageUrl, label: 'Imagen Principal' })
    }

    // Si aún no hay imágenes, usar imagen por defecto
    if (images3D.length === 0) {
      images3D.push({ src: '/carro.png', label: 'Imagen por defecto' })
    }

    return images3D
  }

  const vehicleImages = buildVehicle3DImages(vehicle)

  // Verificar si las imágenes son generadas con IA (si vienen de images3D)
  const hasAIGeneratedImages = vehicle.images3D && Object.keys(vehicle.images3D).length > 0

  // Debug: mostrar imágenes 3D cargadas
  console.log('Vehicle 3D images loaded for carousel:', vehicleImages)

  const pageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-16 left-0 right-0 bottom-0 bg-gray-50 dark:bg-black overflow-hidden"
    >
      <div className="flex h-full">
        {/* Carrusel de imágenes - 70% - Fixed */}
        <div className="w-[70%] h-full flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            <VehicleImageCarousel
              images={vehicleImages}
              vehicleName={`${vehicle.brand} ${vehicle.model}`}
              isAIGenerated={hasAIGeneratedImages}
            />
          </div>
        </div>

        {/* Información y compra - 30% - Scrollable */}
        <div className="w-[30%] h-full overflow-y-auto bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <VehicleInfo vehicle={vehicle} />
            
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              <VehiclePurchase 
                vehicle={vehicle}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}