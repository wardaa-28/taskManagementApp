/**
 * Columns Hook
 * Provides easy access to columns state and actions
 */

import { useEffect } from 'react';
import { useColumnStore } from '../store/column.store';

export const useColumns = (boardId: string | null) => {
  const {
    columns,
    isLoading,
    error,
    fetchBoardColumns,
    createColumn,
    updateColumn,
    getColumnsByBoard,
    clearError,
  } = useColumnStore();

  // Fetch columns when boardId changes
  useEffect(() => {
    if (boardId) {
      fetchBoardColumns(boardId).catch(() => {
        // Error handled by store
      });
    }
  }, [boardId, fetchBoardColumns]);

  const boardColumns = boardId ? getColumnsByBoard(boardId) : [];

  return {
    columns: boardColumns,
    isLoading,
    error,
    fetchBoardColumns,
    createColumn,
    updateColumn,
    clearError,
  };
};
