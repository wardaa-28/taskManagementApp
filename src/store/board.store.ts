/**
 * Board Store
 * Manages boards state and API integration
 */

import { create } from 'zustand';
import { Board } from '../types/board.types';
import { boardsApi } from '../api';

interface BoardStore {
  boards: Board[];
  selectedBoard: Board | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBoards: () => Promise<void>;
  createBoard: (title: string, description?: string) => Promise<Board>;
  getBoardById: (boardId: string) => Promise<Board>;
  deleteBoard: (boardId: string) => Promise<void>;
  setSelectedBoard: (board: Board | null) => void;
  clearError: () => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  boards: [],
  selectedBoard: null,
  isLoading: false,
  error: null,

  fetchBoards: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await boardsApi.getBoards();
      set({
        boards: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch boards',
      });
      throw error;
    }
  },

  createBoard: async (title: string, description?: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await boardsApi.createBoard({ title, description });
      const newBoard = response.data;
      
      set((state) => ({
        boards: [...state.boards, newBoard],
        isLoading: false,
        error: null,
      }));
      
      return newBoard;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create board',
      });
      throw error;
    }
  },

  getBoardById: async (boardId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await boardsApi.getBoardById(boardId);
      const board = response.data;
      
      set({ isLoading: false, error: null });
      return board;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch board',
      });
      throw error;
    }
  },

  deleteBoard: async (boardId: string) => {
    try {
      set({ isLoading: true, error: null });
      await boardsApi.deleteBoard(boardId);
      
      set((state) => ({
        boards: state.boards.filter((board) => board.id !== boardId),
        selectedBoard:
          state.selectedBoard?.id === boardId ? null : state.selectedBoard,
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to delete board',
      });
      throw error;
    }
  },

  setSelectedBoard: (board: Board | null) => {
    set({ selectedBoard: board });
  },

  clearError: () => set({ error: null }),
}));
