/**
 * Axios Instance Configuration
 * Centralized HTTP client with interceptors for authentication and error handling
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../utils/tokenStorage';
import { useAuthStore } from '../store/auth.store';

// Base URL - can be configured via environment variable
// IMPORTANT: Make sure your backend server is running on this address!
// 
// For Android Emulator: use http://10.0.2.2:3000
// For iOS Simulator: use http://localhost:3000  
// For Physical Device: use your computer's IP (e.g., http://192.168.1.100:3000)
// 
// To find your IP on Windows: run "ipconfig" and look for IPv4 Address
// To find your IP on Mac/Linux: run "ifconfig" or "ip addr"
const BASE_URL = __DEV__
  ? 'http://172.20.10.2:3000' // Base URL without /api - endpoints already have paths
  : 'https://your-production-api.com';

// Log the base URL for debugging
console.log('API Base URL:', BASE_URL);

/**
 * Create axios instance
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Attaches JWT token to all requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles 401 Unauthorized (auto logout)
 * Normalizes error responses
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle network errors (server not reachable)
    if (
      error.code === 'ECONNREFUSED' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('Cannot POST') ||
      error.message?.includes('Cannot GET') ||
      !error.response
    ) {
      console.error('=== NETWORK CONNECTION ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Request URL:', originalRequest?.url);
      console.error('Base URL:', BASE_URL);
      console.error('Full URL:', `${BASE_URL}${originalRequest?.url}`);
      console.error('=== TROUBLESHOOTING ===');
      console.error('1. Is your backend server running? (npm run start:dev)');
      console.error('2. Is the IP address correct? Current:', BASE_URL);
      console.error('3. Are you using Android Emulator? Try: http://10.0.2.2:3000');
      console.error('4. Are you using Physical Device? Use your computer IP');
      console.error('5. Check firewall allows port 3000');
      console.error('=== END TROUBLESHOOTING ===');
      
      return Promise.reject({
        ...error,
        message: `Cannot connect to server at ${BASE_URL}.\n\nPlease check:\n1. Backend server is running (npm run start:dev)\n2. Correct IP address\n3. Device and computer on same network\n4. Firewall allows port 3000`,
        isNetworkError: true,
      });
    }

    // Handle 401 Unauthorized - auto logout
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth data
      await tokenStorage.clearAll();
      
      // Reset auth store
      useAuthStore.getState().logout();
      
      // Return error to be handled by calling code
      return Promise.reject(error);
    }

    // Normalize error response
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An error occurred';

    return Promise.reject({
      ...error,
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default apiClient;
