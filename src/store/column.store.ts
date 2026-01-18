/**
 * Column Store
 * Manages columns state and API integration
 */

import { create } from 'zustand';
import { Column } from '../types/column.types';
import { columnsApi } from '../api';

interface ColumnStore {
  columns: Column[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBoardColumns: (boardId: string) => Promise<void>;
  createColumn: (
    title: string,
    position: number,
    boardId: string
  ) => Promise<Column>;
  updateColumn: (
    columnId: string,
    updates: { title?: string; position?: number }
  ) => Promise<Column>;
  
  // Helpers
  getColumnsByBoard: (boardId: string) => Column[];
  
  clearError: () => void;
}

export const useColumnStore = create<ColumnStore>((set, get) => ({
  columns: [],
  isLoading: false,
  error: null,

  fetchBoardColumns: async (boardId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await columnsApi.getBoardColumns(boardId);
      set({
        columns: response.data.sort((a, b) => a.position - b.position),
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch columns',
      });
      throw error;
    }
  },

  createColumn: async (title: string, position: number, boardId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await columnsApi.createColumn({
        title,
        position,
        board_id: boardId,
      });
      const newColumn = response.data;
      
      set((state) => ({
        columns: [...state.columns, newColumn].sort(
          (a, b) => a.position - b.position
        ),
        isLoading: false,
        error: null,
      }));
      
      return newColumn;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create column',
      });
      throw error;
    }
  },

  updateColumn: async (
    columnId: string,
    updates: { title?: string; position?: number }
  ) => {
    try {
      set({ isLoading: true, error: null });
      const response = await columnsApi.updateColumn(columnId, updates);
      const updatedColumn = response.data;
      
      set((state) => ({
        columns: state.columns
          .map((col) => (col.id === columnId ? updatedColumn : col))
          .sort((a, b) => a.position - b.position),
        isLoading: false,
        error: null,
      }));
      
      return updatedColumn;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to update column',
      });
      throw error;
    }
  },

  getColumnsByBoard: (boardId: string) => {
    return get()
      .columns.filter((col) => col.board_id === boardId)
      .sort((a, b) => a.position - b.position);
  },

  clearError: () => set({ error: null }),
}));
