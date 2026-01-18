/**
 * Secure Token Storage Utility
 * Uses AsyncStorage for token persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@task_management:token';
const USER_KEY = '@task_management:user';

export const tokenStorage = {
  /**
   * Save authentication token
   */
  async saveToken(token: string): Promise<void> {
    try {
      if (!token) {
        console.warn('Attempted to save undefined/null token. Skipping.');
        return;
      }
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  },

  /**
   * Get authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Remove authentication token
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  },

  /**
   * Save user data
   */
  async saveUser(user: any): Promise<void> {
    try {
      if (!user) {
        console.warn('Attempted to save undefined/null user. Skipping.');
        return;
      }
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  /**
   * Get user data
   */
  async getUser(): Promise<any | null> {
    try {
      const userStr = await AsyncStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Remove user data
   */
  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  },

  /**
   * Clear all authentication data
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  },
};
