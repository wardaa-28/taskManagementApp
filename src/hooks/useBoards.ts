/**
 * Boards Hook
 * Provides easy access to boards state and actions
 */

import { useEffect } from 'react';
import { useBoardStore } from '../store/board.store';

export const useBoards = () => {
  const {
    boards,
    selectedBoard,
    isLoading,
    error,
    fetchBoards,
    createBoard,
    getBoardById,
    deleteBoard,
    setSelectedBoard,
    clearError,
  } = useBoardStore();

  // Fetch boards on mount if authenticated
  useEffect(() => {
    fetchBoards().catch(() => {
      // Error handled by store
    });
  }, [fetchBoards]);

  return {
    boards,
    selectedBoard,
    isLoading,
    error,
    fetchBoards,
    createBoard,
    getBoardById,
    deleteBoard,
    setSelectedBoard,
    clearError,
  };
};
