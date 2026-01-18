/**
 * Columns API Service
 */

import apiClient from './axios';
import {
  CreateColumnRequest,
  UpdateColumnRequest,
  ColumnResponse,
  ColumnsResponse,
} from '../types/column.types';

export const columnsApi = {
  /**
   * Create a new column
   */
  async createColumn(data: CreateColumnRequest): Promise<ColumnResponse> {
    const response = await apiClient.post<ColumnResponse>('/api/columns', data);
    return response.data;
  },

  /**
   * Get all columns for a board
   */
  async getBoardColumns(boardId: string): Promise<ColumnsResponse> {
    const response = await apiClient.get<ColumnsResponse>(
      `/api/boards/${boardId}/columns`
    );
    return response.data;
  },

  /**
   * Update column (rename/reorder)
   */
  async updateColumn(
    columnId: string,
    data: UpdateColumnRequest
  ): Promise<ColumnResponse> {
    const response = await apiClient.patch<ColumnResponse>(
      `/api/columns/${columnId}`,
      data
    );
    return response.data;
  },
};
