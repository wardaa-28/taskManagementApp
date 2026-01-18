/**
 * Color palette for the Task Management App
 * Professional, clean, and modern color scheme
 */

export const colors = {
  // Primary colors
  primary: '#2563eb',
  primaryDark: '#1e40af',
  primaryLight: '#3b82f6',
  
  // Secondary colors
  secondary: '#64748b',
  secondaryDark: '#475569',
  secondaryLight: '#94a3b8',
  
  // Status colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Background colors
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundTertiary: '#f1f5f9',
  
  // Text colors
  text: '#0f172a',
  textSecondary: '#475569',
  textTertiary: '#94a3b8',
  textInverse: '#ffffff',
  
  // Border colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  
  // Card colors
  card: '#ffffff',
  cardShadow: 'rgba(0, 0, 0, 0.1)',
  
  // Column colors (for Kanban)
  columnTodo: '#e0f2fe',
  columnInProgress: '#fef3c7',
  columnDone: '#d1fae5',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  // Placeholder
  placeholder: '#94a3b8',
} as const;

export type ColorKey = keyof typeof colors;
