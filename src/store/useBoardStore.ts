import { create } from 'zustand';
import { Board } from '../data/mockData';
import { mockBoards } from '../data/mockData';

interface BoardStore {
  boards: Board[];
  selectedBoard: Board | null;
  setBoards: (boards: Board[]) => void;
  addBoard: (board: Board) => void;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setSelectedBoard: (board: Board | null) => void;
  initializeBoards: () => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  boards: [],
  selectedBoard: null,
  
  setBoards: (boards) => set({ boards }),
  
  addBoard: (board) =>
    set((state) => ({
      boards: [...state.boards, board],
    })),
  
  updateBoard: (id, updates) =>
    set((state) => ({
      boards: state.boards.map((board) =>
        board.id === id ? { ...board, ...updates } : board
      ),
    })),
  
  deleteBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== id),
      selectedBoard:
        state.selectedBoard?.id === id ? null : state.selectedBoard,
    })),
  
  setSelectedBoard: (board) => set({ selectedBoard: board }),
  
  initializeBoards: () => set({ boards: mockBoards }),
}));
