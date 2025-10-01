/**
 * Authentication Context Provider
 * Manages global authentication state for the application
 */

"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import apiClient from '@/lib/api-client';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: 'customer' | 'dealer' | 'admin';
  avatar?: string;
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
    favoritesBrands: string[];
  };
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking auth - session status:', sessionStatus);
      console.log('NextAuth session:', session);

      // Si estamos cargando la sesión de NextAuth, esperar
      if (sessionStatus === 'loading') {
        return;
      }

      // Primero verificar si hay sesión de NextAuth (Google OAuth)
      if (sessionStatus === 'authenticated' && session?.user) {
        console.log('NextAuth session found, checking backend sync...');

        // Verificar si ya tenemos token del backend para este usuario
        const backendToken = localStorage.getItem('oauth_backend_token');

        if (backendToken) {
          // Si ya tenemos token, usar ese para obtener datos actualizados
          try {
            localStorage.setItem('authToken', backendToken);
            const response = await apiClient.getMe();
            const isSuccess = response.success || (response as any).status === 'success';
            const userData = response.data?.user || response.data;

            if (isSuccess && userData) {
              console.log('Using synced backend user data:', userData);
              setUser(userData);
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.log('Backend token invalid, clearing and using NextAuth data');
            localStorage.removeItem('oauth_backend_token');
            localStorage.removeItem('authToken');
          }
        }

        // Si no hay token backend válido, usar datos de NextAuth
        const nextAuthUser: User = {
          id: session.user.id || 'temp-id',
          name: session.user.name || '',
          email: session.user.email || '',
          phone: session.user.phone || '',
          location: session.user.location || '',
          role: 'customer',
          avatar: session.user.image || '',
          preferences: {
            notifications: true,
            newsletter: true,
            favoritesBrands: []
          },
          createdAt: new Date().toISOString()
        };

        // Si NextAuth tiene un token del backend, guardarlo
        if (session.user.backendToken) {
          console.log('Saving backend token from NextAuth session:', session.user.backendToken);
          localStorage.setItem('oauth_backend_token', session.user.backendToken);
          localStorage.setItem('authToken', session.user.backendToken);

          // Intentar obtener datos del backend con el token
          try {
            const response = await apiClient.getMe();
            const isSuccess = response.success || (response as any).status === 'success';
            const userData = response.data?.user || response.data;

            if (isSuccess && userData) {
              console.log('Successfully synced with backend data:', userData);
              setUser(userData);
              setIsAuthenticated(true);
              setIsLoading(false);
              return;
            }
          } catch (error) {
            console.log('Failed to get backend data with token, using NextAuth data:', error);
          }
        } else {
          console.log('No backend token found in NextAuth session');
        }

        setUser(nextAuthUser);
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Si no hay sesión de NextAuth, verificar token del backend
      const token = localStorage.getItem('authToken');
      console.log('Checking auth - backend token exists:', !!token);

      if (token) {
        try {
          const response = await apiClient.getMe();
          console.log('getMe response:', response);

          // El backend devuelve { status: 'success', data: { user } } o { success: true, data: { user } }
          const isSuccess = response.success || (response as any).status === 'success';
          const userData = response.data?.user || response.data;

          if (isSuccess && userData) {
            console.log('Setting user from backend response:', userData);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            console.log('Invalid response, removing token. Response:', response);
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.log('Error getting user, removing token:', error);
          localStorage.removeItem('authToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [session, sessionStatus]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.login({ email, password });
      console.log('Login response:', response);

      const isSuccess = response.success || (response as any).status === 'success';
      const userData = response.data?.user || response.data;

      if (isSuccess && userData) {
        console.log('Login successful, setting user:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        router.push('/');
      }
    } catch (error: any) {
      setError(error.error?.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.register(userData);
      console.log('Register response:', response);

      const isSuccess = response.success || (response as any).status === 'success';
      const userResponseData = response.data?.user || response.data;

      if (isSuccess && userResponseData) {
        console.log('Register successful, setting user:', userResponseData);
        setUser(userResponseData);
        setIsAuthenticated(true);
        router.push('/');
      }
    } catch (error: any) {
      setError(error.error?.message || 'Error al registrar usuario');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Si hay sesión de NextAuth, cerrarla
      if (session) {
        await signOut({ redirect: false });
      }

      // Si hay token del backend, cerrar sesión del backend
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          await apiClient.logout();
        } catch (error) {
          console.error('Error during backend logout:', error);
        }
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      apiClient.clearAuthToken();
      localStorage.removeItem('oauth_backend_token');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      router.push('/');
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.updateProfile(profileData);
      if (response.success) {
        setUser(response.data || user);
      }
    } catch (error: any) {
      setError(error.error?.message || 'Error al actualizar perfil');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.updatePassword({ currentPassword, newPassword });
      if (response.success) {
        // Password updated successfully
      }
    } catch (error: any) {
      setError(error.error?.message || 'Error al cambiar contraseña');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getMe();
      const isSuccess = response.success || (response as any).status === 'success';
      const userData = response.data?.user || response.data;

      if (isSuccess && userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        error,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}