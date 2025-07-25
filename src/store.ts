// src/store.ts

import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { devtools } from 'zustand/middleware';

// Type definitions remain the same
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

export interface SectionComponent {
  id: string;
  type: 'Section';
  backgroundColor: string;
  padding: string;
  borderWidth: string;
  borderColor: string;
  borderRadius: string;
  children: string[]; // IDs of child components
}

export interface DividerComponent {
  id: string;
  type: 'Divider';
  borderStyle: 'solid' | 'dashed' | 'dotted';
  borderWidth: string;
  borderColor: string;
  width: string;
  padding: string;
}

export interface SocialMediaComponent {
  id: string;
  type: 'SocialMedia';
  alignment: 'left' | 'center' | 'right';
  iconSize: string;
  iconSpacing: string;
  icons: Array<{
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'pinterest' | 'tiktok';
    url: string;
    altText: string;
  }>;
}

export interface MenuComponent {
  id: string;
  type: 'Menu';
  alignment: 'left' | 'center' | 'right';
  itemPadding: string;
  itemSpacing: string;
  textColor: string;
  hoverTextColor: string;
  items: Array<{
    text: string;
    url: string;
  }>;
}

export type CanvasComponent = 
  | TextComponent 
  | ButtonComponent 
  | ImageComponent
  | SectionComponent
  | DividerComponent
  | SocialMediaComponent
  | MenuComponent;

export interface GlobalStyles {
  backgroundColor: string;
  contentWidth: number;
}

interface HistoryState {
  components: CanvasComponent[];
  globalStyles: GlobalStyles;
}

export interface StoreState {
  // Current state
  components: CanvasComponent[];
  activeId: string | null;
  globalStyles: GlobalStyles;
  dropIndicatorId: string | null;
  
  // History management
  history: HistoryState[];
  historyIndex: number;
  
  // Actions
  addComponent: (type: CanvasComponent['type'], index?: number) => void;
  moveComponent: (fromIndex: number, toIndex: number) => void;
  setActiveId: (id: string | null) => void;
  updateComponent: (id: string, newProps: Partial<CanvasComponent>) => void;
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  updateGlobalStyles: (newStyles: Partial<GlobalStyles>) => void;
  setDropIndicatorId: (id: string | null) => void;
  
  // Undo/Redo actions
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Helper to save current state to history
  saveToHistory: () => void;
}

// Create the store with custom undo/redo logic
export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      components: [],
      activeId: null,
      dropIndicatorId: null,
      globalStyles: {
        backgroundColor: '#ffffff',
        contentWidth: 600,
      },
      
      // History management
      history: [{
        components: [],
        globalStyles: {
          backgroundColor: '#ffffff',
          contentWidth: 600,
        }
      }],
      historyIndex: 0,
      
      // Helper function to save current state to history
      saveToHistory: () => {
        const state = get();
        const newHistoryState: HistoryState = {
          components: JSON.parse(JSON.stringify(state.components)),
          globalStyles: JSON.parse(JSON.stringify(state.globalStyles)),
        };
        
        // Remove any history after current index
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(newHistoryState);
        
        // Limit history to 50 items
        if (newHistory.length > 50) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },
      
      // Undo/Redo implementation
      undo: () => {
        const state = get();
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1;
          const historyState = state.history[newIndex];
          set({
            components: JSON.parse(JSON.stringify(historyState.components)),
            globalStyles: JSON.parse(JSON.stringify(historyState.globalStyles)),
            historyIndex: newIndex,
            activeId: null,
          });
        }
      },
      
      redo: () => {
        const state = get();
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1;
          const historyState = state.history[newIndex];
          set({
            components: JSON.parse(JSON.stringify(historyState.components)),
            globalStyles: JSON.parse(JSON.stringify(historyState.globalStyles)),
            historyIndex: newIndex,
            activeId: null,
          });
        }
      },
      
      canUndo: () => {
        const state = get();
        return state.historyIndex > 0;
      },
      
      canRedo: () => {
        const state = get();
        return state.historyIndex < state.history.length - 1;
      },
      
      // Actions with history tracking
      moveComponent: (fromIndex, toIndex) => {
        set((state) => {
          const newComponents = [...state.components];
          const [movedItem] = newComponents.splice(fromIndex, 1);
          newComponents.splice(toIndex, 0, movedItem);
          return { components: newComponents };
        });
        get().saveToHistory();
      },
      
      addComponent: (type, index) => {
        set((state) => {
          let newComponent: CanvasComponent;
          const id = nanoid();
          switch (type) {
            case 'Section':
              newComponent = {
                id,
                type: 'Section',
                backgroundColor: '#ffffff',
                padding: '20px',
                borderWidth: '1px',
                borderColor: '#dddddd',
                borderRadius: '0',
                children: []
              };
              break;
              
            case 'Divider':
              newComponent = {
                id,
                type: 'Divider',
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#dddddd',
                width: '100%',
                padding: '10px 0'
              };
              break;
              
            case 'SocialMedia':
              newComponent = {
                id,
                type: 'SocialMedia',
                alignment: 'center',
                iconSize: '32px',
                iconSpacing: '15px',
                icons: [
                  { platform: 'facebook', url: '#', altText: 'Facebook' },
                  { platform: 'twitter', url: '#', altText: 'Twitter' },
                  { platform: 'instagram', url: '#', altText: 'Instagram' }
                ]
              };
              break;
              
            case 'Menu':
              newComponent = {
                id,
                type: 'Menu',
                alignment: 'center',
                itemPadding: '10px 15px',
                itemSpacing: '10px',
                textColor: '#333333',
                hoverTextColor: '#007bff',
                items: [
                  { text: 'Home', url: '#' },
                  { text: 'Products', url: '#' },
                  { text: 'About', url: '#' },
                  { text: 'Contact', url: '#' }
                ]
              };
              break;
              
            case 'Text':
              newComponent = {
                id: nanoid(),
                type: 'Text',
                text: 'Editable Text Block',
                align: 'left',
                paddingTop: '10px',
                paddingRight: '10px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                color: 'black'
              };
              break;
            case 'Button':
              newComponent = {
                id: nanoid(),
                type: 'Button',
                buttonText: 'Click Me',
                url: '#',
                align: 'center',
                paddingTop: '10px',
                paddingRight: '25px',
                paddingBottom: '10px',
                paddingLeft: '25px',
                backgroundColor: '#4CAF50',
                borderRadius: '5px',
                color: '#ffffff'
              };
              break;
            case 'Image':
              newComponent = {
                id: nanoid(),
                type: 'Image',
                src: 'https://via.placeholder.com/150',
                align: 'left'
              };
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
        get().saveToHistory();
      },
      
      setActiveId: (id) => set({ activeId: id }),
      setDropIndicatorId: (id) => set({ dropIndicatorId: id }),
      
      updateComponent: (id, newProps) => {
        set((state) => ({
          components: state.components.map((component) => {
            if (component.id !== id) return component;
            // Cast the result of spreading a union type back to CanvasComponent.
            return { ...component, ...newProps } as CanvasComponent;
          }),
        }));
        get().saveToHistory();
      },
      
      removeComponent: (id) => {
        set((state) => ({
          components: state.components.filter((component) => component.id !== id),
          activeId: state.activeId === id ? null : state.activeId,
        }));
        get().saveToHistory();
      },
      
      duplicateComponent: (id) => {
        set((state) => {
          const componentToDuplicate = state.components.find((c) => c.id === id);
          if (!componentToDuplicate) return state;
          // When spreading a union type like CanvasComponent, TypeScript creates a new,
          // less specific object type that combines all possible properties.
          // We must cast it back to CanvasComponent to ensure type compatibility.
          const newComponent = { ...componentToDuplicate, id: nanoid() } as CanvasComponent;
          const index = state.components.findIndex((c) => c.id === id);
          const newComponents = [...state.components];
          newComponents.splice(index + 1, 0, newComponent);
          return { components: newComponents };
        });
        get().saveToHistory();
      },
      
      updateGlobalStyles: (newStyles) => {
        set((state) => ({
          globalStyles: { ...state.globalStyles, ...newStyles },
        }));
        get().saveToHistory();
      },
    })
  )
);