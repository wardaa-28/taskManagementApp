/**
 * Task Store
 * Manages tasks state and API integration
 * Supports drag & drop with optimistic updates
 */

import { create } from 'zustand';
import { Task, TaskStatus } from '../types/task.types';
import { tasksApi } from '../api';

interface TaskStore {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBoardTasks: (boardId: string) => Promise<void>;
  createTask: (
    title: string,
    description: string | undefined,
    columnId: string,
    boardId: string,
    position: number
  ) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
  deleteTask: (taskId: string) => Promise<void>;
  
  // Drag & Drop
  moveTask: (
    taskId: string,
    columnId: string,
    position: number,
    status?: TaskStatus
  ) => Promise<void>;
  reorderTasks: (
    taskIds: string[],
    columnId: string,
    boardId: string,
    status: TaskStatus
  ) => Promise<void>;
  
  // Helpers
  getTasksByBoard: (boardId: string) => Task[];
  getTasksByColumn: (columnId: string) => Task[];
  getTasksByStatus: (boardId: string, status: TaskStatus) => Task[];
  
  clearError: () => void;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchBoardTasks: async (boardId: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tasksApi.getBoardTasks(boardId);
      set({
        tasks: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to fetch tasks',
      });
      throw error;
    }
  },

  createTask: async (
    title: string,
    description: string | undefined,
    columnId: string,
    boardId: string,
    position: number
  ) => {
    try {
      set({ isLoading: true, error: null });
      const response = await tasksApi.createTask({
        title,
        description,
        column_id: columnId,
        board_id: boardId,
        position,
      });
      const newTask = response.data;
      
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
        error: null,
      }));
      
      return newTask;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to create task',
      });
      throw error;
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    const previousTasks = get().tasks;
    try {
      set({ isLoading: true, error: null });
      
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        ),
      }));
      
      // Prepare API update payload
      const apiUpdates: any = {};
      if (updates.title !== undefined) apiUpdates.title = updates.title;
      if (updates.description !== undefined) apiUpdates.description = updates.description;
      if (updates.status !== undefined) apiUpdates.status = updates.status;
      if (updates.column_id !== undefined) apiUpdates.column_id = updates.column_id;
      if (updates.position !== undefined) apiUpdates.position = updates.position;
      
      const response = await tasksApi.updateTask(taskId, apiUpdates);
      const updatedTask = response.data;
      
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task
        ),
        isLoading: false,
        error: null,
      }));
      
      return updatedTask;
    } catch (error: any) {
      // Rollback on error
      set({
        tasks: previousTasks,
        isLoading: false,
        error: error.message || 'Failed to update task',
      });
      throw error;
    }
  },

  deleteTask: async (taskId: string) => {
    try {
      set({ isLoading: true, error: null });
      await tasksApi.deleteTask(taskId);
      
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to delete task',
      });
      throw error;
    }
  },

  moveTask: async (
    taskId: string,
    columnId: string,
    position: number,
    status?: TaskStatus
  ) => {
    const task = get().tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    
    const previousTasks = get().tasks;
    try {
      // Determine status from column or use provided status
      const newStatus = status || task.status;
      
      // Optimistic update
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? { ...t, column_id: columnId, position, status: newStatus }
            : t
        ),
      }));
      
      // API call
      await tasksApi.updateTask(taskId, {
        column_id: columnId,
        position,
        status: newStatus,
      });
    } catch (error: any) {
      // Rollback on error
      set({ tasks: previousTasks });
      throw error;
    }
  },

  reorderTasks: async (
    taskIds: string[],
    columnId: string,
    boardId: string,
    status: TaskStatus
  ) => {
    const previousTasks = get().tasks;
    try {
      // Optimistic update
      set((state) => {
        const updatedTasks = [...state.tasks];
        taskIds.forEach((taskId, index) => {
          const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);
          if (taskIndex !== -1) {
            updatedTasks[taskIndex] = {
              ...updatedTasks[taskIndex],
              column_id: columnId,
              status,
              position: index,
            };
          }
        });
        return { tasks: updatedTasks };
      });
      
      // Update each task via API
      await Promise.all(
        taskIds.map((taskId, index) =>
          tasksApi.updateTask(taskId, {
            column_id: columnId,
            position: index,
            status,
          })
        )
      );
    } catch (error: any) {
      // Rollback on error
      set({ tasks: previousTasks });
      throw error;
    }
  },

  getTasksByBoard: (boardId: string) => {
    return get().tasks.filter((task) => task.board_id === boardId);
  },

  getTasksByColumn: (columnId: string) => {
    return get()
      .tasks.filter((task) => task.column_id === columnId)
      .sort((a, b) => a.position - b.position);
  },

  getTasksByStatus: (boardId: string, status: TaskStatus) => {
    return get()
      .tasks.filter((task) => task.board_id === boardId && task.status === status)
      .sort((a, b) => a.position - b.position);
  },

  clearError: () => set({ error: null }),
}));
