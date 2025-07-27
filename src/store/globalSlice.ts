import type { StateCreator } from 'zustand';
import type { GlobalStyles } from '../types';
import type { StoreState } from './index';

export interface GlobalStylesSlice {
  globalStyles: GlobalStyles;
  updateGlobalStyles: (newStyles: Partial<GlobalStyles>) => void;
}

const initialGlobalStyles: GlobalStyles = {
  backgroundColor: '#ffffff',
  contentWidth: 600,
};

export const createGlobalStylesSlice: StateCreator<
  StoreState,
  [],
  [],
  GlobalStylesSlice
> = (set, get) => ({
  globalStyles: initialGlobalStyles,
  updateGlobalStyles: (newStyles) => {
    set((state: StoreState) => ({
      globalStyles: { ...state.globalStyles, ...newStyles },
    }));
    // Assuming history slice will have saveToHistory
    if ('saveToHistory' in get()) {
      (get() as any).saveToHistory();
    }
  },
});
