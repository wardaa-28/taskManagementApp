/**
 * Board Members API Service
 */

import apiClient from './axios';
import {
  AddMemberRequest,
  MembersResponse,
} from '../types/board.types';

export const membersApi = {
  /**
   * Add a member to a board (OWNER only)
   */
  async addMember(
    boardId: string,
    data: AddMemberRequest
  ): Promise<{ success: boolean; message: string; data: any }> {
    const response = await apiClient.post<{ success: boolean; message: string; data: any }>(
      `/boards/${boardId}/members`,
      data
    );
    return response.data;
  },

  /**
   * Get all members of a board
   */
  async getBoardMembers(boardId: string): Promise<MembersResponse> {
    const response = await apiClient.get<MembersResponse>(
      `/boards/${boardId}/members`
    );
    return response.data;
  },
};
