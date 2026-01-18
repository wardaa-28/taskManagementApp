/**
 * Board Types
 */

export interface Board {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
}

export interface CreateBoardRequest {
  title: string;
  description?: string;
}

export interface BoardResponse {
  success: boolean;
  message: string;
  data: Board;
}

export interface BoardsResponse {
  success: boolean;
  message: string;
  data: Board[];
}

export interface BoardMember {
  id: string;
  user_id: string;
  board_id: string;
  role: 'OWNER' | 'MEMBER';
  user: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
  };
  created_at: string;
}

export interface AddMemberRequest {
  email: string;
  role?: 'OWNER' | 'MEMBER';
}

export interface MembersResponse {
  success: boolean;
  message: string;
  data: BoardMember[];
}
