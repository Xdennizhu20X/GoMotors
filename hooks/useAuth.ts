/**
 * Custom Authentication Hook for RUEDA YA!
 * Simple wrapper for AuthContext
 */

import { useAuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  return useAuthContext();
}