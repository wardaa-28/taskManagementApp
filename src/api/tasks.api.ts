/**
 * Tasks API Service
 */

import apiClient from './axios';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
  TasksResponse,
} from '../types/task.types';

export const tasksApi = {
  /**
   * Create a new task
   */
  async createTask(data: CreateTaskRequest): Promise<TaskResponse> {
    const response = await apiClient.post<TaskResponse>('/api/tasks', data);
    return response.data;
  },

  /**
   * Get all tasks for a board
   */
  async getBoardTasks(boardId: string): Promise<TasksResponse> {
    const response = await apiClient.get<TasksResponse>(
      `/api/boards/${boardId}/tasks`
    );
    return response.data;
  },

  /**
   * Update task (supports drag & drop)
   */
  async updateTask(
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<TaskResponse> {
    const response = await apiClient.patch<TaskResponse>(
      `/api/tasks/${taskId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete task (OWNER only)
   */
  async deleteTask(taskId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/api/tasks/${taskId}`
    );
    return response.data;
  },
};
