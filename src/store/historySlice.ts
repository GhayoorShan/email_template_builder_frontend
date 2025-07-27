import type { StateCreator } from 'zustand';
import type { CanvasComponent, GlobalStyles } from '../types';
import type { StoreState } from './index';

interface HistoryEntry {
  components: CanvasComponent[];
  globalStyles: GlobalStyles;
}

export interface HistorySlice {
  history: HistoryEntry[];
  historyIndex: number;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const createHistorySlice: StateCreator<StoreState, [], [], HistorySlice> = (
  set,
  get
) => ({
  history: [],
  historyIndex: -1,
  saveToHistory: () => {
    const { components, globalStyles } = get();
    const newHistory = get().history.slice(0, get().historyIndex + 1);
    newHistory.push({ components, globalStyles });

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
  undo: () => {
    if (get().canUndo()) {
      const newIndex = get().historyIndex - 1;
      const previousState = get().history[newIndex];
      set({ ...previousState, historyIndex: newIndex });
    }
  },
  redo: () => {
    if (get().canRedo()) {
      const newIndex = get().historyIndex + 1;
      const nextState = get().history[newIndex];
      set({ ...nextState, historyIndex: newIndex });
    }
  },
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
});
