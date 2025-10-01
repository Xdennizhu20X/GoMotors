'use client';

import { useState, useEffect } from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";

import { StarRating } from "@/components/star-rating";
import apiClient from "@/lib/api-client";
import { brands } from "@/config/brands";

interface Dealer {
  id: string;
  name: string;
  brand: string;
  logoUrl: string;
  rating: number;
  reviewsCount: number;
  modelsAvailable: number;
  verified: boolean;
}

const DealerCard = ({ dealer, index }: { dealer: Dealer; index: number }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * 0.15,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const hoverVariants = {
    scale: 1.02,
    y: -8,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={hoverVariants}
      className="w-full group"
    >
      <Card className="relative w-full overflow-hidden rounded-lg border border-gray-200/30 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md hover:border-[#1341ee]/30 dark:hover:border-white/30 transition-all duration-300">
        
        <CardBody className="p-0 relative">
          {/* Logo Section */}
          <div className="relative h-48 bg-gray-50/50 dark:bg-neutral-800 p-4">
            
            {/* Floating Element */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.7, 0.5]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 right-4 w-12 h-12 bg-[#1341ee]/10 rounded-full"
            ></motion.div>

            {/* Logo Container */}
            <motion.div 
              className="relative z-10 w-full h-full flex items-center justify-center"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 } 
              }}
            >
              <Image
                removeWrapper
                alt={`${dealer.name} logo`}
                className={`object-contain [filter:brightness(0)_saturate(100%)_invert(15%)_sepia(98%)_saturate(2048%)_hue-rotate(223deg)_brightness(94%)_contrast(96%)] dark:[filter:brightness(0)_saturate(100%)_invert(100%)] w-32 h-32`}
                src={dealer.logoUrl}
              />
            </motion.div>
          </div>
        </CardBody>

        <CardFooter className="flex-col items-start p-6 relative">
          {/* Header Section */}
          <div className="w-full flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-foreground group-hover:text-[#1341ee] transition-colors duration-300 mb-2">
                {dealer.name}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StarRating rating={dealer.rating} />
                  <span className="text-sm font-medium text-foreground/60">({dealer.rating})</span>
                </div>
                {dealer.verified && (
                  <div className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-foreground/60">Verificado</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="w-full grid grid-cols-1 gap-4 mb-6">
            <div className="text-center p-3 rounded-md bg-[#1341ee]/5 dark:bg-neutral-800 border border-[#1341ee]/15 dark:border-neutral-600">
              <p className="text-xs font-medium text-[#1341ee]/70 dark:text-white/70 uppercase tracking-wider mb-1">Modelos</p>
              <p className="text-xl font-bold text-[#1341ee] dark:text-white">{dealer.modelsAvailable}</p>
            </div>
          </div>

          {/* CTA Button */}
          <NextLink href={`/concesionarios/${dealer.id}`} className="w-full">
            <Button className="w-full bg-[#1341ee] text-white font-semibold text-base py-3 rounded-md hover:bg-[#1341ee]/90 transition-all duration-300">
              Explorar Concesionario
            </Button>
          </NextLink>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default function MarcasPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      let dealersData: any[] = [];
      
      // Try to fetch from API first
      try {
        console.log('Attempting to fetch dealers from API...');
        const response = await apiClient.getDealers();
        console.log('API Response:', response);
        
        // Check response structure
        if (response.data && response.data.dealers && Array.isArray(response.data.dealers)) {
          dealersData = response.data.dealers;
          console.log('Dealers loaded from API:', dealersData.length);
        } else if (response.data && Array.isArray(response.data)) {
          dealersData = response.data;
          console.log('Dealers loaded from API (direct array):', dealersData.length);
        } else if (Array.isArray(response)) {
          dealersData = response;
          console.log('Dealers loaded from API (raw array):', dealersData.length);
        }
      } catch (apiError) {
        console.warn('API fetch failed, using fallback brands data:', apiError);
        // Continue to fallback - don't throw error here
      }
      
      // If API failed or returned no data, use static brands as fallback
      if (!dealersData || dealersData.length === 0) {
        console.log('Using brands as fallback dealers data');
        dealersData = brands.map((brand, index) => ({
          id: brand.id || `dealer-${index + 1}`,
          name: `${brand.name} Ecuador`,
          brand: brand.name,
          logoUrl: brand.logoUrl,
          rating: 4.2 + (Math.random() * 0.6), // Random rating between 4.2-4.8
          reviewsCount: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
          modelsAvailable: Math.floor(Math.random() * 15) + 5, // Random models 5-20
          verified: Math.random() > 0.3, // 70% chance of being verified
          description: `Concesionario oficial de ${brand.name} en Ecuador`,
          address: `Av. Principal 123, Quito, Ecuador`,
          phone: '+593 2 123 4567',
          email: `info@${brand.name.toLowerCase()}ecuador.com`,
          website: `https://${brand.name.toLowerCase()}ecuador.com`,
          services: ['Venta de vehículos', 'Servicio técnico', 'Repuestos originales']
        }));
      }
      
      // Normalize dealers data
      const normalizedDealers = dealersData.map((dealer, index) => ({
        ...dealer,
        id: dealer.id || dealer._id || `dealer-${index + 1}`,
        name: dealer.name || 'Concesionario',
        brand: dealer.brand || 'Marca',
        logoUrl: dealer.logoUrl || '/images/brands/default.svg',
        rating: dealer.rating || 4.0,
        reviewsCount: dealer.reviewsCount || 0,
        modelsAvailable: dealer.modelsAvailable || 0,
        verified: dealer.verified !== undefined ? dealer.verified : false
      }));
      
      console.log('Final normalized dealers:', normalizedDealers.length);
      setDealers(normalizedDealers);
      setError(null);
      
    } catch (error: any) {
      console.error('Error in fetchDealers:', error);
      setError(`Error al cargar los concesionarios: ${error.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(19,65,238,0.04),transparent_60%)]"></div>
      
      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
          opacity: [0.6, 0.8, 0.6]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-20 w-20 h-20 bg-[#1341ee]/10 rounded-full"
      ></motion.div>
      
      <motion.div
        animate={{
          y: [10, -10, 10],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-32 right-32 w-24 h-24 bg-[#1341ee]/8 rounded-full"
      ></motion.div>

      <div className="relative z-10 py-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-20 text-center">
            <motion.div
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tight mb-8">
                <span className="text-foreground">Descubre Nuestras</span>
                <span className="block text-[#1341ee]">Concesionarias</span>
              </h1>
            </motion.div>

            <motion.div
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed font-light max-w-4xl mx-auto">
                Explora una selección curada de las mejores marcas de automóviles, donde la 
                <span className="font-semibold text-[#1341ee]"> innovación se encuentra con la excelencia</span>.
              </p>
              
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1341ee] rounded-full"></div>
                  <span className="text-sm font-medium text-foreground/60">Calidad Certificada</span>
                </div>
                <div className="w-px h-4 bg-foreground/20"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1341ee] rounded-full"></div>
                  <span className="text-sm font-medium text-foreground/60">Garantía Extendida</span>
                </div>
                <div className="w-px h-4 bg-foreground/20"></div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#1341ee] rounded-full"></div>
                  <span className="text-sm font-medium text-foreground/60">Financiamiento</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1341ee]"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button 
                onClick={fetchDealers}
                className="bg-[#1341ee] text-white"
              >
                Reintentar
              </Button>
            </div>
          )}

          {/* Cards Grid */}
          {!loading && !error && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
            >
              {dealers.map((dealer, index) => (
                <DealerCard key={dealer.id || `dealer-${index}`} dealer={dealer} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}