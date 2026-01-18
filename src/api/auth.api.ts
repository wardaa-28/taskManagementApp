/**
 * Authentication API Service
 */

import apiClient from './axios';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ApiError,
} from '../types/auth.types';

export const authApi = {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};
