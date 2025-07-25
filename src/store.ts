import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { devtools } from 'zustand/middleware';

// Base component interface with common properties
interface BaseComponent {
  id: string;
  parentId: string | null;
}

// --- Component Type Definitions ---

export interface TextComponent extends BaseComponent {
  type: 'Text';
  text: string;
  align: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  color: string;
}

export interface ButtonComponent extends BaseComponent {
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

export interface ImageComponent extends BaseComponent {
  type: 'Image';
  src: string;
  align: string;
}

export type DividerComponent = BaseComponent & { type: 'Divider'; borderStyle: 'solid' | 'dashed' | 'dotted'; borderWidth: string; borderColor: string; width: string; padding: string; };

export interface SocialMediaComponent extends BaseComponent {
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

export interface MenuComponent extends BaseComponent {
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

export interface StructureComponent extends BaseComponent {
  type: 'Structure';
  children: CanvasComponent[];
}

export interface SectionComponent extends BaseComponent {
  type: 'Section';
  children: CanvasComponent[];
}

export interface OneColumnComponent extends BaseComponent {
  type: 'OneColumn';
  children: CanvasComponent[];
}

export interface TwoColumnComponent extends BaseComponent {
  type: 'TwoColumn';
  children: CanvasComponent[];
}

export interface ColumnComponent extends BaseComponent {
  type: 'Column';
  children: CanvasComponent[];
}

// Union type for all possible canvas components
export type CanvasComponent =
  | TextComponent
  | ButtonComponent
  | ImageComponent
  | DividerComponent
  | SocialMediaComponent
  | MenuComponent
  | StructureComponent
  | ColumnComponent
  | SectionComponent
  | OneColumnComponent
  | TwoColumnComponent;

// --- Global and State Type Definitions ---

export interface GlobalStyles {
  backgroundColor: string;
  contentWidth: number;
}

interface HistoryState {
  components: CanvasComponent[];
  globalStyles: GlobalStyles;
}

export interface StoreState {
  modules: CanvasComponent[];
  components: CanvasComponent[];
  activeId: string | null;
  globalStyles: GlobalStyles;
  dropIndicatorId: string | null;
  history: HistoryState[];
  historyIndex: number;
  addComponent: (type: CanvasComponent['type'], parentId: string | null, index: number) => void;
  moveComponent: (componentId: string, targetContainerId: string | null, index: number) => void;
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  updateComponent: (id: string, newProps: Partial<CanvasComponent>) => void;
  findComponent: (id: string) => CanvasComponent | null;
  setActiveId: (id: string | null) => void;
  saveAsModule: (component: CanvasComponent) => void;
  updateGlobalStyles: (newStyles: Partial<GlobalStyles>) => void;
  setDropIndicatorId: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveToHistory: () => void;
}

// --- Zustand Store Implementation ---

const findComponent = (components: CanvasComponent[], id: string): CanvasComponent | null => {
  for (const component of components) {
    if (component.id === id) return component;
    if ('children' in component && Array.isArray(component.children)) {
      const found = findComponent(component.children as CanvasComponent[], id);
      if (found) return found;
    }
  }
  return null;
};

const findParent = (components: CanvasComponent[], id: string): (CanvasComponent & { children: CanvasComponent[] }) | null => {
  for (const component of components) {
    if ('children' in component && Array.isArray(component.children)) {
      if ((component.children as CanvasComponent[]).some(child => child.id === id)) {
        return component as CanvasComponent & { children: CanvasComponent[] };
      }
      const found = findParent(component.children as CanvasComponent[], id);
      if (found) return found;
    }
  }
  return null;
};

const removeComponentFromParent = (components: CanvasComponent[], id: string): CanvasComponent[] => {
  return components.filter(c => c.id !== id).map(c => {
    if ('children' in c && Array.isArray(c.children)) {
      (c as any).children = removeComponentFromParent(c.children as CanvasComponent[], id);
    }
    return c;
  });
};

const addComponentToParent = (components: CanvasComponent[], componentToAdd: CanvasComponent, parentId: string | null, index: number): CanvasComponent[] => {
  if (parentId === null) {
    const newComponents = [...components];
    newComponents.splice(index, 0, componentToAdd);
    return newComponents;
  }

  return components.map(c => {
    if (c.id === parentId) {
      const container = c as any;
      const newChildren = [...(container.children || [])];
      newChildren.splice(index, 0, componentToAdd);
      container.children = newChildren;
    }
    else if ('children' in c && Array.isArray(c.children)) {
      (c as any).children = addComponentToParent(c.children as CanvasComponent[], componentToAdd, parentId, index);
    }
    return c;
  });
};

export const useStore = create<StoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      components: [],
      modules: [],
      activeId: null,
      dropIndicatorId: null,
      globalStyles: {
        backgroundColor: '#f1f1f1',
        contentWidth: 600,
      },
      history: [{
        components: [],
        globalStyles: {
          backgroundColor: '#f1f1f1',
          contentWidth: 600,
        }
      }],
      historyIndex: 0,

      findComponent: (id) => {
        return findComponent(get().components, id);
      },

      // --- History Management ---
      saveToHistory: () => {
        set(state => {
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          const currentSnapshot = { 
            components: state.components, 
            globalStyles: state.globalStyles 
          };
          // Avoid saving duplicate states
          if (JSON.stringify(newHistory[newHistory.length - 1]) === JSON.stringify(currentSnapshot)) {
            return {};
          }
          newHistory.push(currentSnapshot);
          return {
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        });
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            const newIndex = state.historyIndex - 1;
            const previousState = state.history[newIndex];
            return {
              components: JSON.parse(JSON.stringify(previousState.components)),
              globalStyles: previousState.globalStyles,
              historyIndex: newIndex,
            };
          }
          return {};
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            const newIndex = state.historyIndex + 1;
            const nextState = state.history[newIndex];
            return {
              components: JSON.parse(JSON.stringify(nextState.components)),
              globalStyles: nextState.globalStyles,
              historyIndex: newIndex,
            };
          }
          return {};
        });
      },

      canUndo: () => get().historyIndex > 0,
      canRedo: () => get().historyIndex < get().history.length - 1,

      // --- Component Actions ---
      moveComponent: (componentId, targetContainerId, index) => {
        set(state => {
          const components = [...state.components];
          const componentToMove = findComponent(components, componentId);
          if (!componentToMove) return state;

          // 1. Remove from old parent
          const componentsWithoutMoved = removeComponentFromParent(components, componentId);
          
          // 2. Add to new parent
          const newComponents = addComponentToParent(
            componentsWithoutMoved,
            componentToMove,
            targetContainerId,
            index
          );

          return { components: newComponents };
        });
        get().saveToHistory();
      },

      addComponent: (type, parentId, index) => {
        set((state) => {
          let newComponent: CanvasComponent;
          const id = nanoid();

          switch (type) {
            case 'Text':
              newComponent = {
                id, parentId, type, text: 'Editable Text Block', align: 'left',
                paddingTop: '10px', paddingRight: '10px', paddingBottom: '10px', paddingLeft: '10px', color: '#000000',
              };
              break;
            case 'Button':
              newComponent = {
                id, parentId, type, buttonText: 'Click Me', url: '#', align: 'center',
                paddingTop: '10px', paddingRight: '10px', paddingBottom: '10px', paddingLeft: '10px',
                backgroundColor: '#007bff', borderRadius: '5px', color: '#ffffff',
              };
              break;
            case 'Image':
              newComponent = {
                id, parentId, type, src: 'https://via.placeholder.com/600x200', align: 'center',
              };
              break;
            case 'Section':
              newComponent = { id, parentId, type, children: [] };
              break;
            case 'OneColumn':
              newComponent = { id, parentId, type, children: [] };
              break;
            case 'TwoColumn':
              newComponent = { id, parentId, type, children: [] };
              break;
            case 'Divider':
              newComponent = {
                id, parentId, type, borderStyle: 'solid', borderWidth: '1px',
                borderColor: '#cccccc', width: '100%', padding: '10px 0',
              };
              break;
            case 'SocialMedia':
              newComponent = {
                id, parentId, type, alignment: 'center', iconSize: '32px', iconSpacing: '10px',
                icons: [
                  { platform: 'facebook', url: '#', altText: 'Facebook' },
                  { platform: 'twitter', url: '#', altText: 'Twitter' },
                  { platform: 'instagram', url: '#', altText: 'Instagram' },
                ],
              };
              break;
            case 'Menu':
              newComponent = {
                id, parentId, type, alignment: 'center', itemPadding: '10px', itemSpacing: '20px',
                textColor: '#000000', hoverTextColor: '#007bff',
                items: [
                  { text: 'Home', url: '#' },
                  { text: 'About', url: '#' },
                  { text: 'Contact', url: '#' },
                ],
              };
              break;
            case 'Structure':
              newComponent = { id, parentId, type, children: [] };
              break;
            case 'Column':
              newComponent = { id, parentId, type, children: [] };
              break;
            default:
              throw new Error(`Unknown component type: ${type}`);
          }

          const newComponents = addComponentToParent(
            state.components,
            newComponent,
            parentId,
            index
          );

          return { components: newComponents };
        });
        get().saveToHistory();
      },

      setActiveId: (id) => set({ activeId: id }),

    saveAsModule: (component) => {
      const newModule = {
        ...JSON.parse(JSON.stringify(component)), // Deep copy
        id: `module-${Date.now()}`,
      };
      set((state) => ({ modules: [...state.modules, newModule] }));
    },
      setDropIndicatorId: (id) => set({ dropIndicatorId: id }),

      updateComponent: (id, newProps) => {
        set((state) => ({
          components: state.components.map((component) =>
            component.id === id
              ? ({ ...component, ...newProps } as CanvasComponent)
              : component
          ),
        }));
        get().saveToHistory();
      },

      removeComponent: (id) => {
        set((state) => {
          const newComponents = removeComponentFromParent(state.components, id);
          return {
            components: newComponents,
            activeId: state.activeId === id ? null : state.activeId,
          };
        });
        get().saveToHistory();
      },

      duplicateComponent: (id: string) => {
        set((state) => {
          const componentToDuplicate = state.components.find((c) => c.id === id);
          if (!componentToDuplicate) return state;
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