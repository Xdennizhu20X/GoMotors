'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import apiClient from '@/lib/api-client';
import { useAuth } from '@/hooks/useAuth';
import { trackAddToWishlist } from '@/lib/analytics';

// Global flags to prevent multiple simultaneous requests
let isLoadingWishlist = false;
let isLoadingStats = false;

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

interface WishlistStats {
  total: number;
  active: number;
  considering: number;
  notInterested: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistStatus, setWishlistStatus] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState<WishlistStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Get full wishlist
  const getWishlist = useCallback(async (params?: { page?: number; limit?: number; status?: string }) => {
    if (!isAuthenticated || isLoadingWishlist) return;

    isLoadingWishlist = true;
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getWishlist(params);
      if (response.success && response.data?.wishlist) {
        setWishlist(response.data.wishlist);

        // Update status cache
        const statusMap: Record<string, boolean> = {};
        response.data.wishlist.forEach((item: WishlistItem) => {
          statusMap[item.vehicleId] = true;
        });
        setWishlistStatus(prev => ({ ...prev, ...statusMap }));
      }
    } catch (error: any) {
      console.error('Error getting wishlist:', error);
      setError(error.error?.message || 'Error al obtener la lista de deseos');
    } finally {
      setLoading(false);
      isLoadingWishlist = false;
    }
  }, [isAuthenticated]);

  // Check if vehicle is in wishlist (now just returns cached data)
  const checkWishlistStatus = useCallback(async (vehicleId: string): Promise<boolean> => {
    if (!isAuthenticated) return false;

    // Just return cached data, no API calls
    return wishlistStatus[vehicleId] || false;
  }, [isAuthenticated, wishlistStatus]);

  // Add to wishlist
  const addToWishlist = useCallback(async (vehicleId: string, notes?: string, priority?: number, vehicleData?: any) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para añadir vehículos a tu lista de deseos');
      return false;
    }

    try {
      const response = await apiClient.addToWishlist(vehicleId, notes, priority);
      if (response.success) {
        setWishlistStatus(prev => ({
          ...prev,
          [vehicleId]: true
        }));

        // Add to local wishlist if we have it loaded
        if (response.data && wishlist.length > 0) {
          setWishlist(prev => [response.data, ...prev]);
        }

        // Track wishlist addition
        if (vehicleData && typeof window !== 'undefined') {
          trackAddToWishlist({
            item_id: vehicleId,
            item_name: vehicleData.name || `${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}`,
            item_category: 'vehicle',
            item_brand: vehicleData.brand,
            price: vehicleData.price,
            currency: 'USD',
          });
        }

        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      setError(error.error?.message || 'Error al añadir a la lista de deseos');
      return false;
    }
  }, [isAuthenticated, wishlist.length]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (vehicleId: string) => {
    if (!isAuthenticated) return false;

    try {
      const response = await apiClient.removeFromWishlist(vehicleId);
      if (response.success) {
        setWishlistStatus(prev => ({
          ...prev,
          [vehicleId]: false
        }));

        // Remove from local wishlist
        setWishlist(prev => prev.filter(item => item.vehicleId !== vehicleId));

        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error removing from wishlist:', error);
      setError(error.error?.message || 'Error al eliminar de la lista de deseos');
      return false;
    }
  }, [isAuthenticated]);

  // Toggle wishlist status
  const toggleWishlist = useCallback(async (vehicleId: string, notes?: string, priority?: number, vehicleData?: any) => {
    const isCurrentlyInWishlist = await checkWishlistStatus(vehicleId);

    if (isCurrentlyInWishlist) {
      return await removeFromWishlist(vehicleId);
    } else {
      return await addToWishlist(vehicleId, notes, priority, vehicleData);
    }
  }, [checkWishlistStatus, removeFromWishlist, addToWishlist]);

  // Update wishlist item
  const updateWishlistItem = useCallback(async (id: string, data: { notes?: string; priority?: number; status?: string }) => {
    if (!isAuthenticated) return false;

    try {
      const response = await apiClient.updateWishlistItem(id, data);
      if (response.success && response.data) {
        // Update local wishlist
        setWishlist(prev => prev.map(item =>
          item._id === id ? { ...item, ...data } : item
        ));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Error updating wishlist item:', error);
      setError(error.error?.message || 'Error al actualizar el item');
      return false;
    }
  }, [isAuthenticated]);

  // Get wishlist stats
  const getWishlistStats = useCallback(async () => {
    if (!isAuthenticated || isLoadingStats) return;

    isLoadingStats = true;
    try {
      const response = await apiClient.getWishlistStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error: any) {
      console.error('Error getting wishlist stats:', error);
    } finally {
      isLoadingStats = false;
    }
  }, [isAuthenticated]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load wishlist on mount if authenticated (only once)
  useEffect(() => {
    if (isAuthenticated && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      getWishlist();
      getWishlistStats();
    } else if (!isAuthenticated) {
      // Clear data when user logs out
      hasLoadedRef.current = false;
      setWishlist([]);
      setWishlistStatus({});
      setStats(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); // Only depend on isAuthenticated

  return {
    // Data
    wishlist,
    wishlistStatus,
    stats,
    loading,
    error,

    // Actions
    getWishlist,
    checkWishlistStatus,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    updateWishlistItem,
    getWishlistStats,
    clearError,
  };
};