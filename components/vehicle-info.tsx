"use client"

import { motion } from 'framer-motion'
import { Chip, Divider } from '@heroui/react'
import { StarRating } from '@/components/star-rating'
import { type Vehicle } from '@/config/vehicles'

interface VehicleInfoProps {
  vehicle: Vehicle
}

export const VehicleInfo = ({ vehicle }: VehicleInfoProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getTransmissionLabel = (transmission: string) => {
    const labels = {
      manual: 'Manual',
      automatica: 'Automática',
      cvt: 'CVT'
    }
    return labels[transmission as keyof typeof labels] || transmission
  }

  const getFuelTypeLabel = (fuelType: string) => {
    const labels = {
      gasolina: 'Gasolina',
      diesel: 'Diesel',
      hibrido: 'Híbrido',
      electrico: 'Eléctrico'
    }
    return labels[fuelType as keyof typeof labels] || fuelType
  }

 const getFuelTypeColor = (fuelType: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
  const colors = {
    gasolina: 'warning' as const,
    diesel: 'secondary' as const,
    hibrido: 'success' as const,
    electrico: 'primary' as const
  }
  return colors[fuelType as keyof typeof colors] || 'default'
}

  const infoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.div
      variants={infoVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {/* Título y precio principal */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {vehicle.brand} {vehicle.model}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Año {vehicle.year}
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold text-[#1341ee]">
            {formatPrice(vehicle.price)}
          </span>
          <span className="text-sm text-gray-500">USD</span>
        </div>
      </motion.div>

      <Divider />

      {/* Estado y condición */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 flex-wrap">
        {(vehicle as any).condition && (
          <Chip 
            color={(vehicle as any).condition === 'new' ? 'success' : 'warning'} 
            variant="flat" 
            size="sm"
          >
            {(vehicle as any).condition === 'new' ? 'Nuevo' : 'Usado'}
          </Chip>
        )}
        {(vehicle as any).status === 'available' && (
          <Chip color="success" variant="flat" size="sm">
            Disponible
          </Chip>
        )}
        {(vehicle as any).featured && (
          <Chip color="primary" variant="flat" size="sm">
            ⭐ Destacado
          </Chip>
        )}
        <Chip color="default" variant="flat" size="sm">
          {vehicle.stock} en stock
        </Chip>
      </motion.div>

      <Divider />

      {/* Especificaciones básicas */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Especificaciones
        </h3>
        
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Transmisión:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {getTransmissionLabel(vehicle.transmission)}
            </p>
          </div>
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Combustible:</span>
            <div className="mt-1">
              <Chip 
                size="sm" 
                color={getFuelTypeColor(vehicle.fuelType)}
                variant="flat"
              >
                {getFuelTypeLabel(vehicle.fuelType)}
              </Chip>
            </div>
          </div>
          
          {vehicle.engine && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Motor:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {vehicle.engine}
              </p>
            </div>
          )}
          
          <div>
            <span className="text-gray-600 dark:text-gray-400">Kilometraje:</span>
            <p className="font-medium text-gray-900 dark:text-white">
              {vehicle.mileage === 0 ? 'Nuevo (0 km)' : `${vehicle.mileage?.toLocaleString()} km`}
            </p>
          </div>
          
          {(vehicle as any).color && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Color:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {(vehicle as any).color}
              </p>
            </div>
          )}
          
          {vehicle.location && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Ubicación:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {vehicle.location}
              </p>
            </div>
          )}

          {(vehicle as any).views && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Vistas:</span>
              <p className="font-medium text-gray-900 dark:text-white">
                {(vehicle as any).views.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Descripción */}
      {(vehicle as any).description && (
        <>
          <Divider />
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Descripción
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {(vehicle as any).description}
            </p>
          </motion.div>
        </>
      )}

      {/* Características */}
      {vehicle.features && vehicle.features.length > 0 && (
        <>
          <Divider />
          <motion.div variants={itemVariants} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Características
            </h3>
            <div className="flex flex-wrap gap-2">
              {vehicle.features.map((feature, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="bordered"
                  className="border-gray-200 dark:border-gray-700"
                >
                  {feature}
                </Chip>
              ))}
            </div>
          </motion.div>
        </>
      )}

      <Divider />

      {/* Información del concesionario */}
      <motion.div variants={itemVariants} className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Concesionario
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900 dark:text-white">
              {(vehicle as any).dealer?.name || `${vehicle.brand} ${vehicle.location}`}
            </span>
            <StarRating rating={(vehicle as any).dealer?.rating || vehicle.rating || 4.0} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {(vehicle as any).dealer?.address || `Av. Principal 123, ${vehicle.location}`}
          </p>
          
          {/* Información de contacto del dealer */}
          {(vehicle as any).dealer?.phone && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              📞 {(vehicle as any).dealer.phone}
            </p>
          )}
          
          {(vehicle as any).dealer?.email && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ✉️ {(vehicle as any).dealer.email}
            </p>
          )}
          
          <div className="flex gap-2 flex-wrap">
            {(vehicle as any).dealer?.verified && (
              <Chip size="sm" color="success" variant="flat">
                ✓ Certificado
              </Chip>
            )}
            <Chip size="sm" color="primary" variant="flat">
              Garantía
            </Chip>
            
            {/* Servicios del dealer */}
            {(vehicle as any).dealer?.services && (vehicle as any).dealer.services.length > 0 && 
              (vehicle as any).dealer.services.map((service: string, index: number) => (
                <Chip key={index} size="sm" color="default" variant="bordered">
                  {service}
                </Chip>
              ))
            }
          </div>
          
          {/* Horarios de trabajo */}
          {(vehicle as any).dealer?.workingHours && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-neutral-900/50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Horarios de Atención
              </h4>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {Object.entries((vehicle as any).dealer.workingHours).map(([day, hours]) => {
                  const dayNames: { [key: string]: string } = {
                    monday: 'Lunes',
                    tuesday: 'Martes', 
                    wednesday: 'Miércoles',
                    thursday: 'Jueves',
                    friday: 'Viernes',
                    saturday: 'Sábado',
                    sunday: 'Domingo'
                  }
                  return (
                    <div key={day} className="flex justify-between">
                      <span>{dayNames[day]}:</span>
                      <span>{hours === 'closed' ? 'Cerrado' : String(hours)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Ficha del vehículo (si está disponible) */}
      {(vehicle as any).vehicleSheet && (
        <>
          <Divider />
          <motion.div variants={itemVariants}>
            <a
              href={(vehicle as any).vehicleSheet}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1341ee]/10 to-[#1341ee]/5 dark:from-[#1341ee]/20 dark:to-[#1341ee]/10 rounded-lg border-2 border-[#1341ee]/30 hover:border-[#1341ee] transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1341ee] rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-[#1341ee] transition-colors">
                      Ver Ficha del Vehículo
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Descarga la información técnica completa
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#1341ee]">
                  <span className="text-sm font-medium hidden sm:inline">Abrir</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </a>
          </motion.div>
        </>
      )}

      {/* Showroom del vehículo (si está disponible) */}
      {(vehicle as any).showroomLink && (
        <>
          <Divider />
          <motion.div variants={itemVariants}>
            <a
              href={(vehicle as any).showroomLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10 rounded-lg border-2 border-purple-500/30 hover:border-purple-500 transition-all group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                      Ver en Showroom Virtual
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Explora el vehículo en 360° y realidad aumentada
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-purple-600">
                  <span className="text-sm font-medium hidden sm:inline">Explorar</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </a>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}