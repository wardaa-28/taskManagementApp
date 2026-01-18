/**
 * Authentication Hook
 * Provides easy access to auth state and actions
 */

import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    initializeAuth,
    clearError,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
