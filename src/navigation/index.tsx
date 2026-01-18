import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';
import { useAuthStore } from '../store/auth.store';

/**
 * Root Navigator
 * Manages authentication state and switches between Auth and App navigators
 */
export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [isReady, setIsReady] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const init = async () => {
      await initializeAuth();
      setIsReady(true);
    };
    init();
  }, [initializeAuth]);

  // Debug: Log auth state changes
  useEffect(() => {
    console.log('Auth state changed. isAuthenticated:', isAuthenticated);
  }, [isAuthenticated]);

  // Show nothing while initializing
  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
