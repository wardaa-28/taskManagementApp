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
      
      console.log('Login response:', JSON.stringify(response, null, 2));
      
      // Handle different response structures
      // authApi.login() returns response.data from axios, which is AuthResponse
      // Backend response: { success, message, data: { user, accessToken } }
      // Note: Backend uses "accessToken" not "token"
      let token: string | undefined;
      let user: User | undefined;
      
      // Check if response has nested data structure (AuthResponse format)
      // Backend returns: { success, message, data: { user, accessToken } }
      if (response.data && response.data.user) {
        // Backend uses "accessToken" field name
        token = (response.data as any).accessToken || response.data.token || (response.data as any).access_token;
        user = response.data.user;
      }
      // Check if response is direct (token and user at root level)
      else if ((response as any).token && (response as any).user) {
        token = (response as any).token;
        user = (response as any).user;
      }
      // Fallback: check for accessToken at root level
      else if ((response as any).accessToken && (response as any).user) {
        token = (response as any).accessToken;
        user = (response as any).user;
      }
      
      // Validate we have both token and user
      if (!token || !user) {
        console.error('=== INVALID RESPONSE STRUCTURE ===');
        console.error('Full response:', JSON.stringify(response, null, 2));
        console.error('Response.data:', JSON.stringify(response.data, null, 2));
        console.error('Extracted token:', token);
        console.error('Extracted user:', user);
        console.error('=== END DEBUG INFO ===');
        throw new Error('Invalid response: missing token or user data. Please check API response structure. Check console for full response details.');
      }
      
      // Save token and user
      await tokenStorage.saveToken(token);
      await tokenStorage.saveUser(user);
      
      console.log('Setting authenticated state...');
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      console.log('Auth state updated. isAuthenticated: true');
    } catch (error: any) {
      console.error('Login error:', error);
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
      
      console.log('Register response:', JSON.stringify(response, null, 2));
      
      // Handle different response structures
      // authApi.register() returns response.data from axios, which is AuthResponse
      // Backend response: { success, message, data: { user, accessToken } }
      // Note: Backend uses "accessToken" not "token"
      let token: string | undefined;
      let user: User | undefined;
      
      // Check if response has nested data structure (AuthResponse format)
      // Backend returns: { success, message, data: { user, accessToken } }
      if (response.data && response.data.user) {
        // Backend uses "accessToken" field name
        token = (response.data as any).accessToken || response.data.token || (response.data as any).access_token;
        user = response.data.user;
      }
      // Check if response is direct (token and user at root level)
      else if ((response as any).token && (response as any).user) {
        token = (response as any).token;
        user = (response as any).user;
      }
      // Fallback: check for accessToken at root level
      else if ((response as any).accessToken && (response as any).user) {
        token = (response as any).accessToken;
        user = (response as any).user;
      }
      
      // Validate we have both token and user
      if (!token || !user) {
        console.error('=== INVALID RESPONSE STRUCTURE ===');
        console.error('Full response:', JSON.stringify(response, null, 2));
        console.error('Response.data:', JSON.stringify(response.data, null, 2));
        console.error('Extracted token:', token);
        console.error('Extracted user:', user);
        console.error('=== END DEBUG INFO ===');
        throw new Error('Invalid response: missing token or user data. Please check API response structure. Check console for full response details.');
      }
      
      // Save token and user
      await tokenStorage.saveToken(token);
      await tokenStorage.saveUser(user);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Register error:', error);
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
