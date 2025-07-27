import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type CanvasSlice, createCanvasSlice } from './canvasSlice';
import { type GlobalStylesSlice, createGlobalStylesSlice } from './globalSlice';
import { type HistorySlice, createHistorySlice } from './historySlice';

export type StoreState = CanvasSlice & GlobalStylesSlice & HistorySlice;

export const useStore = create<StoreState>()(
  devtools(
    (...a) => ({
      ...createCanvasSlice(...a),
      ...createGlobalStylesSlice(...a),
      ...createHistorySlice(...a),
    }),
    { name: 'Email Builder Store' }
  )
);
