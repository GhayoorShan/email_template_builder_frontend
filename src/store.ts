// src/store.ts

import { create, type StateCreator } from 'zustand'; // <-- IMPORT StateCreator
import { temporal, type TemporalState } from 'zundo';
import { nanoid } from 'nanoid';
import { devtools } from 'zustand/middleware'; // Optional: useful for debugging

// Your type definitions are perfect, no changes needed here
export interface TextComponent {
  id: string;
  type: 'Text';
  text: string;
  align: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  color: string;
}

export interface ButtonComponent {
  id: string;
  type: 'Button';
  buttonText: string;
  url: string;
  align: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  backgroundColor: string;
  borderRadius: string;
  color: string;
}

export interface ImageComponent {
  id: string;
  type: 'Image';
  src: string;
  align: string;
}

export type CanvasComponent = TextComponent | ButtonComponent | ImageComponent;

export interface GlobalStyles {
  backgroundColor: string;
  contentWidth: number;
}

export interface StoreState {
  components: CanvasComponent[];
  activeId: string | null;
  globalStyles: GlobalStyles;
  addComponent: (type: CanvasComponent['type'], index?: number) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  setActiveId: (id: string | null) => void;
  updateComponent: (id: string, newProps: Partial<CanvasComponent>) => void;
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  updateGlobalStyles: (newStyles: Partial<GlobalStyles>) => void;
  dropIndicatorId: string | null;
  setDropIndicatorId: (id: string | null) => void;
}

// Combine your state with the temporal state for the final store type
type PartializeState = Pick<StoreState, 'components' | 'globalStyles'>;
export type StoreWithTemporal = StoreState & TemporalState<PartializeState>;


// ---- THE FIX IS HERE ----
// Use StateCreator to correctly type the implementation function.
// It clearly defines that this function only works with the base StoreState.
const storeImplementation: StateCreator<StoreState> = (set) => ({
  components: [],
  activeId: null,
  dropIndicatorId: null,
  globalStyles: {
    backgroundColor: '#ffffff',
    contentWidth: 600,
  },
  moveComponent: (fromIndex, toIndex) => {
    set((state) => {
      const newComponents = [...state.components];
      const [movedItem] = newComponents.splice(fromIndex, 1);
      newComponents.splice(toIndex, 0, movedItem);
      return { components: newComponents };
    });
  },
  addComponent: (type, index) => {
    set((state) => {
      let newComponent: CanvasComponent;
      switch (type) {
        case 'Text':
          newComponent = { id: nanoid(), type: 'Text', text: 'Editable Text Block', align: 'left', paddingTop: '10px', paddingRight: '10px', paddingBottom: '10px', paddingLeft: '10px', color: 'black' };
          break;
        case 'Button':
          newComponent = { id: nanoid(), type: 'Button', buttonText: 'Click Me', url: '#', align: 'center', paddingTop: '10px', paddingRight: '25px', paddingBottom: '10px', paddingLeft: '25px', backgroundColor: '#4CAF50', borderRadius: '5px', color: '#ffffff' };
          break;
        case 'Image':
          newComponent = { id: nanoid(), type: 'Image', src: 'https://via.placeholder.com/150', align: 'left' };
          break;
        default:
          throw new Error(`Unknown component type: ${type}`);
      }
      const newComponents = [...state.components];
      if (index !== undefined) {
        newComponents.splice(index, 0, newComponent);
      } else {
        newComponents.push(newComponent);
      }
      return { components: newComponents };
    });
  },
  setActiveId: (id) => set({ activeId: id }),
  setDropIndicatorId: (id) => set({ dropIndicatorId: id }),
  updateComponent: (id, newProps) => {
    set((state) => ({
      components: state.components.map((component) =>
        component.id === id ? { ...component, ...newProps } : component
      ),
    }));
  },
  removeComponent: (id) => {
    set((state) => ({
      components: state.components.filter((component) => component.id !== id),
      activeId: state.activeId === id ? null : state.activeId,
    }));
  },
  duplicateComponent: (id) => {
    set((state) => {
      const componentToDuplicate = state.components.find((c) => c.id === id);
      if (!componentToDuplicate) return state;
      const newComponent = { ...componentToDuplicate, id: nanoid() };
      const index = state.components.findIndex((c) => c.id === id);
      const newComponents = [...state.components];
      newComponents.splice(index + 1, 0, newComponent);
      return { components: newComponents };
    });
  },
  updateGlobalStyles: (newStyles) => {
    set((state) => ({
      globalStyles: { ...state.globalStyles, ...newStyles },
    }));
  },
});

// Create the store with temporal middleware.
// The types now line up correctly.
// Create the store with temporal middleware
export const useStore = create<StoreWithTemporal>()(
  devtools(
    temporal(
      (set, get) => ({
        // Your store implementation here
        components: [],
        activeId: null,
        globalStyles: {
          backgroundColor: '#ffffff',
          contentWidth: 600,
        },
        // ... rest of your store methods
      } as unknown as StoreState), // Cast to StoreState to avoid circular type references
      {
        partialize: (state) => ({
          components: state.components,
          globalStyles: state.globalStyles,
        }),
        limit: 50,
      }
    )
  )
);