import { create } from 'zustand';

// Use nanoid for generating unique IDs for components.
import { nanoid } from 'nanoid';

// Define specific component types for better type safety and property management.
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

// Defines the shape of our store's state.
interface StoreState {
  components: CanvasComponent[];
  activeId: string | null;
  addComponent: (type: CanvasComponent['type']) => void;
  setActiveId: (id: string | null) => void;
  updateComponent: (id: string, newProps: Partial<CanvasComponent>) => void;
}

export const useStore = create<StoreState>()((set, get) => ({
  components: [], // This will hold all components on the canvas
  activeId: null, // This will hold the ID of the selected component

  addComponent: (type: CanvasComponent['type']) => {
    let newComponent: CanvasComponent;

    // Create a new component with default properties based on its type
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

    set((state) => ({
      components: [...state.components, newComponent],
    }));
  },

  // Sets the currently selected component ID
  setActiveId: (id: string | null) => {
    set({ activeId: id });
  },

   // Updates the properties of a specific component
   updateComponent: (id: string, newProps: Partial<CanvasComponent>) => {
    set((state) => ({
      components: state.components.map((component) => {
        if (component.id === id) {
          return { ...component, ...newProps } as CanvasComponent;
        }
        return component;
      }),
    }));
  },
}));