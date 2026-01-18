/**
 * Tasks Hook
 * Provides easy access to tasks state and actions
 */

import { useEffect } from 'react';
import { useTaskStore } from '../store/task.store';
import { TaskStatus } from '../types/task.types';

export const useTasks = (boardId: string | null) => {
  const {
    tasks,
    isLoading,
    error,
    fetchBoardTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    getTasksByBoard,
    getTasksByColumn,
    getTasksByStatus,
    clearError,
  } = useTaskStore();

  // Fetch tasks when boardId changes
  useEffect(() => {
    if (boardId) {
      fetchBoardTasks(boardId).catch(() => {
        // Error handled by store
      });
    }
  }, [boardId, fetchBoardTasks]);

  const boardTasks = boardId ? getTasksByBoard(boardId) : [];
  const getTasksForColumn = (columnId: string) => getTasksByColumn(columnId);
  const getTasksForStatus = (status: TaskStatus) =>
    boardId ? getTasksByStatus(boardId, status) : [];

  return {
    tasks: boardTasks,
    isLoading,
    error,
    fetchBoardTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    getTasksForColumn,
    getTasksForStatus,
    clearError,
  };
};
