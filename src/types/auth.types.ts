/**
 * Authentication Types
 */

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  avatar_url?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string; // Backend uses "accessToken" not "token"
    token?: string; // Fallback for compatibility
  };
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}
