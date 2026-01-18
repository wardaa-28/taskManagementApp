/**
 * Authentication Store
 * Manages user authentication state and token
 */

import { create } from 'zustand';
import { User } from '../types/auth.types';
import { authApi } from '../api';
import { tokenStorage } from '../utils/tokenStorage';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, avatar_url?: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authApi.login({ email, password });
      
      // Save token and user
      await tokenStorage.saveToken(response.data.token);
      await tokenStorage.saveUser(response.data.user);
      
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Login failed',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  register: async (name: string, email: string, password: string, avatar_url?: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authApi.register({ name, email, password, avatar_url });
      
      // Save token and user
      await tokenStorage.saveToken(response.data.token);
      await tokenStorage.saveUser(response.data.user);
      
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Registration failed',
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      await tokenStorage.clearAll();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  initializeAuth: async () => {
    try {
      const token = await tokenStorage.getToken();
      const user = await tokenStorage.getUser();
      
      if (token && user) {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await tokenStorage.clearAll();
    }
  },

  clearError: () => set({ error: null }),
}));
