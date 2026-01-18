/**
 * Column Types
 */

export interface Column {
  id: string;
  title: string;
  position: number;
  board_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateColumnRequest {
  title: string;
  position: number;
  board_id: string;
}

export interface UpdateColumnRequest {
  title?: string;
  position?: number;
}

export interface ColumnResponse {
  success: boolean;
  message: string;
  data: Column;
}

export interface ColumnsResponse {
  success: boolean;
  message: string;
  data: Column[];
}
