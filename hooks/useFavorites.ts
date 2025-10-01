/**
 * Custom Hook for Managing Favorites
 * Handles favorite vehicles for authenticated users
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api-client';
import { Vehicle } from '@/config/vehicles';

interface UseFavoritesReturn {
  favorites: Vehicle[];
  isLoading: boolean;
  error: string | null;
  isFavorite: (vehicleId: string) => boolean;
  toggleFavorite: (vehicleId: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<Vehicle[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.getWishlist();
      if (((response as any).status === 'success' || response.success) && response.data) {
        setFavorites(response.data);
        setFavoriteIds(new Set(response.data.map((v: Vehicle) => v.id)));
      }
    } catch (error: any) {
      if (error.error?.code !== 'NO_TOKEN') {
        setError(error.error?.message || 'Error al cargar favoritos');
      }
      setFavorites([]);
      setFavoriteIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchFavorites();
    }
  }, [fetchFavorites]);

  const isFavorite = useCallback((vehicleId: string): boolean => {
    return favoriteIds.has(vehicleId);
  }, [favoriteIds]);

  const toggleFavorite = useCallback(async (vehicleId: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Debes iniciar sesión para agregar favoritos');
    }

    setError(null);
    const wasFavorite = isFavorite(vehicleId);

    // Optimistic update
    setFavoriteIds(prev => {
      const newSet = new Set(prev);
      if (wasFavorite) {
        newSet.delete(vehicleId);
      } else {
        newSet.add(vehicleId);
      }
      return newSet;
    });

    try {
      if (wasFavorite) {
        await apiClient.removeFromWishlist(vehicleId);
      } else {
        await apiClient.addToWishlist(vehicleId);
      }
      // Refresh favorites list
      await fetchFavorites();
    } catch (error: any) {
      // Revert optimistic update on error
      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        if (wasFavorite) {
          newSet.add(vehicleId);
        } else {
          newSet.delete(vehicleId);
        }
        return newSet;
      });
      setError(error.error?.message || 'Error al actualizar favoritos');
      throw error;
    }
  }, [isFavorite, fetchFavorites]);

  const refreshFavorites = useCallback(async () => {
    await fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    isLoading,
    error,
    isFavorite,
    toggleFavorite,
    refreshFavorites,
  };
}