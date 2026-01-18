/**
 * Task Types
 */

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  column_id: string;
  board_id: string;
  position: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  column_id: string;
  board_id: string;
  position: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  column_id?: string;
  position?: number;
}

export interface TaskResponse {
  success: boolean;
  message: string;
  data: Task;
}

export interface TasksResponse {
  success: boolean;
  message: string;
  data: Task[];
}
