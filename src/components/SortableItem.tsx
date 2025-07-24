// src/components/SortableItem.tsx
import { useSortable } from '@dnd-kit/sortable';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store';
import type { CanvasComponent } from '../store';
import { CanvasItem } from './CanvasItem';

interface SortableItemProps {
  id: string;
  component: CanvasComponent;
  onDelete: (id: string) => void;
}

export function SortableItem({ id, component, onDelete }: SortableItemProps) {
  const duplicateComponent = useStore((state) => state.duplicateComponent);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
      {...attributes} // Spread attributes for ARIA roles
    >
      <div className="relative border-2 border-transparent group-hover:border-blue-500 transition-colors rounded-md">
        <CanvasItem component={component} isDragging={isDragging} />
        
        {/* Action Toolbar - visible on hover */}
        <div className="absolute -top-3 -right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Drag Handle */}
          <button 
            {...listeners} // Spread listeners to the drag handle
            className="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 cursor-move focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Drag to reorder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          {/* Duplicate Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateComponent(id);
            }}
            className="bg-green-500 text-white p-1 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label="Duplicate component"
          >
            <DocumentDuplicateIcon className="h-4 w-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete component"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}