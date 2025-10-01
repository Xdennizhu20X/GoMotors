'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardBody, Button, Image } from '@heroui/react';
import { HeartFilledIcon, TrashIcon } from '@/components/icons';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface WishlistItem {
  _id: string;
  vehicleId: string;
  vehicleInfo: {
    name: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    image: string;
    dealerName: string;
  };
  notes?: string;
  priority: number;
  status: string;
  addedAt: string;
}

export default function FavoritosPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { wishlist, loading, getWishlist, removeFromWishlist } = useWishlist();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, router]);

  // Load wishlist on mount
  useEffect(() => {
    if (isAuthenticated) {
      getWishlist();
    }
  }, [isAuthenticated, getWishlist]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleRemoveFromWishlist = async (vehicleId: string) => {
    await removeFromWishlist(vehicleId);
  };

  const handleViewVehicle = (vehicleId: string) => {
    router.push(`/vehiculos/${vehicleId}`);
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1341ee] mx-auto mb-4"></div>
          <p className="text-foreground/70">Cargando tu lista de deseos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-950 dark:to-neutral-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Mi Lista de Deseos
          </h1>
          <p className="text-foreground/70">
            Tus vehículos favoritos
          </p>
        </motion.div>

        {/* Wishlist Items */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <HeartFilledIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Tu lista de deseos está vacía
            </h3>
            <p className="text-foreground/70 mb-6">
              Explora nuestro catálogo y añade vehículos que te interesen
            </p>
            <Button
              className="bg-[#1341ee] text-white"
              onPress={() => router.push('/vehiculos')}
            >
              Explorar Vehículos
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.filter(item => item.vehicleInfo || item.vehicleId).map((item: WishlistItem, index: number) => {
              // Fallback para vehicleInfo undefined - usar datos de vehicleId si existe
              const vehicleData = item.vehicleInfo || (item.vehicleId ? {
                brand: 'Vehículo',
                model: 'No disponible',
                year: new Date().getFullYear(),
                price: 0,
                image: '/placeholder-car.jpg',
                name: 'Vehículo eliminado',
                dealerName: 'N/A'
              } : null);

              if (!vehicleData) return null;

              return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="w-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <Image
                      removeWrapper
                      alt={`${vehicleData.brand} ${vehicleData.model}`}
                      className="w-full h-48 object-cover"
                      src={vehicleData.image || '/placeholder-car.jpg'}
                    />

                    {/* Remove from wishlist button */}
                    <Button
                      isIconOnly
                      size="sm"
                      className="absolute top-3 right-3 bg-red-500 text-white hover:bg-red-600 shadow-lg z-10 min-w-8 h-8 border-2 border-white"
                      onPress={() => handleRemoveFromWishlist(item.vehicleId)}
                    >
                      <HeartFilledIcon className="w-5 h-5" />
                    </Button>
                  </div>

                  <CardBody className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-foreground">
                          {vehicleData.brand} {vehicleData.model}
                        </h3>
                        <p className="text-foreground/70 text-sm">
                          {vehicleData.year}
                        </p>
                      </div>

                      <p className="text-xl font-bold text-[#1341ee]">
                        {formatPrice(vehicleData.price)}
                      </p>

                      <Button
                        className="w-full bg-[#1341ee] text-white"
                        onPress={() => handleViewVehicle(item.vehicleId)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}