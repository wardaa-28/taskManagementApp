/**
 * Boards API Service
 */

import apiClient from './axios';
import {
  CreateBoardRequest,
  Board,
  BoardResponse,
  BoardsResponse,
} from '../types/board.types';

export const boardsApi = {
  /**
   * Create a new board
   */
  async createBoard(data: CreateBoardRequest): Promise<BoardResponse> {
    const response = await apiClient.post<BoardResponse>('/api/boards', data);
    return response.data;
  },

  /**
   * Get all boards for the authenticated user
   */
  async getBoards(): Promise<BoardsResponse> {
    const response = await apiClient.get<BoardsResponse>('/api/boards');
    return response.data;
  },

  /**
   * Get board by ID
   */
  async getBoardById(boardId: string): Promise<BoardResponse> {
    const response = await apiClient.get<BoardResponse>(`/api/boards/${boardId}`);
    return response.data;
  },

  /**
   * Delete board (OWNER only)
   */
  async deleteBoard(boardId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/api/boards/${boardId}`
    );
    return response.data;
  },
};
