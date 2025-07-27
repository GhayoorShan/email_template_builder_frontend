import type { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import type { CanvasComponent } from '../types';
import type { StoreState } from './index';

// --- Helper Functions (originally in store.ts) ---

const findComponent = (
  components: CanvasComponent[],
  id: string
): CanvasComponent | null => {
  for (const component of components) {
    if (component.id === id) return component;
    if ('children' in component && component.children) {
      const found = findComponent(component.children, id);
      if (found) return found;
    }
  }
  return null;
};

const removeComponentFromParent = (
  components: CanvasComponent[],
  id: string
): CanvasComponent[] => {
  return components.reduce((acc, comp) => {
    if (comp.id === id) return acc; // Skip the component to be removed
    if ('children' in comp && comp.children) {
      comp.children = removeComponentFromParent(comp.children, id);
    }
    acc.push(comp);
    return acc;
  }, [] as CanvasComponent[]);
};

const addComponentToParent = (
  components: CanvasComponent[],
  componentToAdd: CanvasComponent,
  parentId: string | null,
  index: number
): CanvasComponent[] => {
  if (!parentId) {
    const newComponents = [...components];
    newComponents.splice(index, 0, componentToAdd);
    return newComponents;
  }

  return components.map((comp) => {
    // If this is the parent component, add the new component to its children
    if (comp.id === parentId && 'children' in comp) {
      const newChildren = [...(comp.children || [])];
      newChildren.splice(index, 0, componentToAdd);
      return { ...comp, children: newChildren };
    }
    
    // If this component has children, recursively process them
    if ('children' in comp) {
      const children = comp.children || [];
      return {
        ...comp,
        children: addComponentToParent(
          children,
          componentToAdd,
          parentId,
          index
        ),
      };
    }
    
    // For components without children, return them as-is
    return comp;
  });
};

// --- Canvas Slice Definition ---

export interface CanvasSlice {
  components: CanvasComponent[];
  selectedId: string | null;
  modules: CanvasComponent[];
  dropIndicatorId: string | null;
  addComponent: (
    type: CanvasComponent['type'],
    parentId: string | null,
    index: number
  ) => void;
  moveComponent: (
    componentId: string,
    targetContainerId: string | null,
    index: number
  ) => void;
  removeComponent: (id: string) => void;
  duplicateComponent: (id: string) => void;
  updateComponent: (id: string, newProps: Partial<CanvasComponent>) => void;
  findComponent: (id: string) => CanvasComponent | null;
  setSelectedId: (id: string | null) => void;
  saveAsModule: (component: CanvasComponent) => void;
  setDropIndicatorId: (id: string | null) => void;
}

export const createCanvasSlice: StateCreator<StoreState, [], [], CanvasSlice> = (
  set,
  get
) => ({
  components: [
    {
      id: 'root',
      type: 'Structure',
      parentId: null,
      children: [],
      props: {
        backgroundColor: '#ffffff',
        padding: '0px',
        emailWidth: '600px',
        emailBackgroundColor: '#f4f4f4',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        lineHeight: '1.5',
        textColor: '#333333',
        linkColor: '#007bff',
        maxWidth: '600px',
        align: 'center'
      }
    },
  ],
  selectedId: null,
  modules: [],
  dropIndicatorId: null,

  findComponent: (id) => {
    return findComponent(get().components, id);
  },

  setSelectedId: (id) => set({ selectedId: id }),

  setDropIndicatorId: (id) => set({ dropIndicatorId: id }),

  addComponent: (type, parentId, index) => {
    const id = nanoid();
    let newComponent: CanvasComponent;

    // Helper function to create a column with a component inside it
    const createColumnWithComponent = (component: CanvasComponent): CanvasComponent => {
      const columnId = nanoid();
      const column: CanvasComponent = {
        id: columnId,
        parentId: component.parentId,
        type: 'Column',
        children: [component],
        props: {
          width: '100%',
          backgroundColor: 'transparent',
          paddingTop: '0',
          paddingRight: '0',
          paddingBottom: '0',
          paddingLeft: '0'
        }
      };
      
      // Update the component's parentId to point to the new column
      component.parentId = columnId;
      
      return column;
    };

    // Default props logic
    switch (type) {
        case 'Text':
            const textComponent: CanvasComponent = {
              id,
              parentId: null, // Will be set by createColumnWithComponent
              type,
              props: {
                text: 'Some text',
                align: 'left',
                paddingTop: '10px',
                paddingRight: '10px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                color: '#000000',
              },
            };
            // Wrap text in a column
            newComponent = createColumnWithComponent(textComponent);
            break;
        case 'Button':
            const buttonComponent: CanvasComponent = {
              id,
              parentId: null, // Will be set by createColumnWithComponent
              type,
              props: {
                buttonText: 'Click me',
                url: '#',
                align: 'center',
                paddingTop: '10px',
                paddingRight: '10px',
                paddingBottom: '10px',
                paddingLeft: '10px',
                backgroundColor: '#007bff',
                borderRadius: '5px',
                color: '#ffffff',
              },
            };
            // Wrap button in a column
            newComponent = createColumnWithComponent(buttonComponent);
            break;
        case 'Image':
            const imageComponent: CanvasComponent = {
              id,
              parentId: null, // Will be set by createColumnWithComponent
              type,
              props: {
                src: 'https://via.placeholder.com/150',
                align: 'center',
              },
            };
            // Wrap image in a column
            newComponent = createColumnWithComponent(imageComponent);
            break;
        case 'Structure':
            newComponent = {
              id,
              parentId,
              type,
              children: [],
              props: {
                backgroundColor: '#ffffff',
                padding: '0px',
                emailWidth: '600px',
                emailBackgroundColor: '#f4f4f4',
                fontFamily: 'Arial, sans-serif',
                fontSize: '14px',
                lineHeight: '1.5',
                textColor: '#333333',
                linkColor: '#007bff',
                maxWidth: '600px',
                align: 'center'
              }
            };
            break;
        case 'Container':
            newComponent = {
              id,
              parentId,
              type,
              children: [],
              props: {
                backgroundColor: '#ffffff',
                padding: '20px',
                borderWidth: '0px',
                borderColor: '#ffffff',
                borderRadius: '0px',
                fullWidth: false,
                direction: 'ltr',
                textAlign: 'left'
              }
            };
            break;
        case 'Divider':
            const dividerComponent: CanvasComponent = {
              id,
              parentId: null, // Will be set by createColumnWithComponent
              type,
              props: {
                borderStyle: 'solid',
                borderWidth: '1px',
                borderColor: '#cccccc',
                width: '100%',
                padding: '10px 0',
              },
            };
            // Wrap divider in a column
            newComponent = createColumnWithComponent(dividerComponent);
            break;
        case 'SocialMedia':
            newComponent = {
              id,
              parentId,
              type,
              props: {
                alignment: 'center',
                iconSize: '32px',
                iconSpacing: '10px',
                icons: [
                  { platform: 'facebook', url: '#', altText: 'Facebook' },
                  { platform: 'twitter', url: '#', altText: 'Twitter' },
                  { platform: 'instagram', url: '#', altText: 'Instagram' },
                ],
              },
            };
            break;
        case 'Menu':
            newComponent = {
              id,
              parentId,
              type,
              props: {
                alignment: 'center',
                itemPadding: '10px',
                itemSpacing: '20px',
                textColor: '#000000',
                hoverTextColor: '#007bff',
                items: [
                  { text: 'Home', url: '#' },
                  { text: 'About', url: '#' },
                  { text: 'Contact', url: '#' },
                ],
              },
            };
            break;
        case 'Column':
            newComponent = {
              id,
              parentId,
              type,
              children: [],
              props: {
                width: '100%',
                backgroundColor: 'transparent',
                paddingTop: '0',
                paddingRight: '0',
                paddingBottom: '0',
                paddingLeft: '0'
              }
            };
            break;
        case 'Heading':
            const headingComponent: CanvasComponent = {
              id,
              parentId: null, // Will be set by createColumnWithComponent
              type,
              props: {
                text: 'Heading',
                level: 1,
                align: 'left',
                color: '#000000',
              },
            };
            // Wrap heading in a column
            newComponent = createColumnWithComponent(headingComponent);
            break;
        default:
            throw new Error(`Unknown component type: ${type}`);
    }

    const newComponents = addComponentToParent(
      get().components,
      newComponent,
      parentId,
      index
    );

    set({ components: newComponents });
    if ('saveToHistory' in get()) {
      (get() as any).saveToHistory();
    }
  },

  moveComponent: (componentId, targetContainerId, index) => {
    const componentToMove = findComponent(get().components, componentId);
    if (!componentToMove) return;

    // 1. Remove from old parent
    const tempComponents = removeComponentFromParent(get().components, componentId);

    // 2. Update parentId and add to new parent
    const movedComponent = { ...componentToMove, parentId: targetContainerId };
    const newComponents = addComponentToParent(
      tempComponents,
      movedComponent,
      targetContainerId,
      index
    );

    set({ components: newComponents, selectedId: componentId });
    if ('saveToHistory' in get()) {
      (get() as any).saveToHistory();
    }
  },

  updateComponent: (id, newProps) => {
    const components = get().components;
    const update = (comps: CanvasComponent[]): CanvasComponent[] => {
        return comps.map(c => {
            if (c.id === id) {
                return { ...c, ...newProps } as CanvasComponent;
            }
            if ('children' in c && c.children) {
                return { ...c, children: update(c.children) };
            }
            return c;
        });
    }
    set({ components: update(components) });
    if ('saveToHistory' in get()) {
      (get() as any).saveToHistory();
    }
  },

  removeComponent: (id) => {
    set((state: StoreState) => ({
      components: removeComponentFromParent(state.components, id),
      selectedId: state.selectedId === id ? null : state.selectedId,
    }));
    if ('saveToHistory' in get()) {
      (get() as any).saveToHistory();
    }
  },

  duplicateComponent: (id) => {
    const componentToDuplicate = findComponent(get().components, id);
    if (!componentToDuplicate) return;

    const newId = nanoid();
    const duplicatedComponent = { ...componentToDuplicate, id: newId };

    // This is a simplified duplication, it just inserts after the original
    const insert = (comps: CanvasComponent[]): CanvasComponent[] => {
      const newComps: CanvasComponent[] = [];
      for (const comp of comps) {
        newComps.push(comp);
        if (comp.id === id) {
          newComps.push(duplicatedComponent);
        }
        if ('children' in comp && comp.children) {
          comp.children = insert(comp.children);
        }
      }
      return newComps;
    };

    set({ components: insert(get().components) });
    if ('saveToHistory' in get()) {
      (get() as any).saveToHistory();
    }
  },

  saveAsModule: (component) => {
    const newModule = {
      ...JSON.parse(JSON.stringify(component)), // Deep copy
      id: `module-${Date.now()}`,
    };
    set((state: StoreState) => ({ modules: [...state.modules, newModule] }));
  },
});
