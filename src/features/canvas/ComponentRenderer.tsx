import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '../../store';
import { componentRegistry } from '../../config/componentRegistry';
import type { CanvasComponent } from '../../types';
import { CSS } from '@dnd-kit/utilities';

interface ContainerProps {
  component: CanvasComponent;
  children: React.ReactNode;
}

const StructureContainer: React.FC<ContainerProps> = ({ component, children }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
      <div className="text-xs font-medium text-gray-500 mb-1">Structure</div>
      <SortableContext items={'children' in component && component.children ? component.children.map(c => c.id) : []} strategy={verticalListSortingStrategy}>
        {children}
        {'children' in component && component.children?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-gray-500 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
            <p className="text-sm">Drop content here</p>
          </div>
        )}
      </SortableContext>
    </div>
  );
};


const ColumnContainer: React.FC<ContainerProps> = ({ component, children }) => {
  return (
    <div className="p-3 min-h-[80px] bg-white rounded-lg border transition-colors border-gray-200 hover:border-gray-300">
      <div className="text-xs text-gray-500 mb-2">Column</div>
      <SortableContext items={'children' in component && component.children ? component.children.map(c => c.id) : []} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {children}
          {'children' in component && component.children?.length === 0 && (
            <div className="flex flex-col items-center justify-center h-16 text-gray-400 text-sm bg-gray-50 rounded border-2 border-dashed border-gray-300">
              Drop content here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const containerMap: { [key: string]: React.FC<ContainerProps> } = {
  Structure: StructureContainer,


  Column: ColumnContainer,
};

export interface ComponentRendererProps {
  component: CanvasComponent;
  selectedId: string | null;
}

export const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component, selectedId }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: component.id,
    data: { 
      component,
      isDraggable: componentRegistry[component.type]?.isDraggable ?? true,
    },
  });

  const setSelectedId = useStore(state => state.setSelectedId);


  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 'auto',
  };

  // If dragging a new component, show a placeholder instead of the full component.
  if (isDragging && selectedId === component.id) {
    const preview = componentRegistry[component.type]?.preview;
    if (preview) {
      return (
        <div ref={setNodeRef} style={style} className="opacity-50">
          <img src={preview} alt={`${component.type} preview`} className="w-full h-auto rounded-lg border-2 border-dashed border-blue-400" />
        </div>
      );
    }
  }

  const ContainerComponent = containerMap[component.type];
  const RenderedComponent = componentRegistry[component.type]?.renderer;

  if (!RenderedComponent) {
    return <div className="p-4 bg-red-100 text-red-800 border border-red-200 rounded">Unknown component type: {component.type}</div>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(component.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="component-renderer relative"
    >
      {/* Add a clickable overlay that handles selection */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()} // Prevent drag from this element
      />
      {/* Add drag handle */}
      <div
        className="absolute top-2 right-2 z-20 w-5 h-5 bg-blue-500 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity"
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      />
      <RenderedComponent component={component}>
        <div className="absolute top-2 left-2 z-20 text-xs text-white bg-blue-500 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {component.type}
        </div>
        {ContainerComponent && 'children' in component && component.children && (
          <ContainerComponent component={component}>
            {component.children.map((child: CanvasComponent) => (
              <ComponentRenderer key={child.id} component={child} selectedId={selectedId} />
            ))}
          </ContainerComponent>
        )}
      </RenderedComponent>
    </div>
  );
};
