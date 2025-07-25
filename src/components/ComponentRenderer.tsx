import React, { useMemo } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { useStore } from '../store';
import type { CanvasComponent, StructureComponent, ColumnComponent, SectionComponent, OneColumnComponent, TwoColumnComponent } from '../store';

// Import your actual components
import { Text, Button, Image, Divider, Heading } from './renderer';

const StructureContainer: React.FC<{ component: StructureComponent }> = ({ component }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
    data: {
      isContainer: true,
      accepts: ['Column', 'Section', 'OneColumn', 'TwoColumn', 'Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`p-2 bg-gray-100 border border-dashed border-gray-400 rounded-lg min-h-[100px] ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="text-xs font-medium text-gray-500 mb-1">Structure</div>
      <SortableContext items={component.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {component.children.map(child => (
          <ComponentRenderer key={child.id} component={child} />
        ))}
        {component.children.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-gray-500 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
            <p className="font-semibold">Drop Components Here</p>
            <p className="text-sm">Drag blocks from the panel</p>
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const SectionContainer: React.FC<{ component: SectionComponent }> = ({ component }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
    data: {
      isContainer: true,
      accepts: ['Column', 'OneColumn', 'TwoColumn', 'Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });
  const style = {
    backgroundColor: component.backgroundColor || '#f9fafb',
    padding: component.padding || '16px',
    border: component.borderWidth ? `${component.borderWidth} solid ${component.borderColor || '#e5e7eb'}` : '1px solid #e5e7eb',
    borderRadius: component.borderRadius || '8px',
  };

  return (
    <div ref={setNodeRef} style={style} className={`mb-4 ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
      <div className="text-xs font-medium text-gray-500 mb-2">Section</div>
      <SortableContext items={component.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {component.children.map(child => (
          <ComponentRenderer key={child.id} component={child} />
        ))}
        {component.children.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-gray-500 bg-white/50 rounded">
            <p className="font-semibold">Drop Content Here</p>
            <p className="text-sm">Drag blocks or columns into this section</p>
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const OneColumnContainer: React.FC<{ component: OneColumnComponent }> = ({ component }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
    data: {
      isContainer: true,
      accepts: ['Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });
  
  return (
    <div ref={setNodeRef} className={`bg-white p-4 rounded-lg border border-gray-200 ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
      <div className="text-xs font-medium text-gray-500 mb-2">1-Column Layout</div>
      <div className="grid grid-cols-1 gap-4">
        <SortableContext items={component.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {component.children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
          {component.children.length === 0 && (
            <div className="flex flex-col items-center justify-center h-24 text-gray-500 bg-gray-50 rounded border-2 border-dashed border-gray-300">
              <p className="font-semibold">Drop Content Here</p>
              <p className="text-sm">This is a single column layout</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

const TwoColumnContainer: React.FC<{ component: TwoColumnComponent }> = ({ component }) => {
  const { setNodeRef: setLeftRef, isOver: isLeftOver } = useDroppable({
    id: `droppable-${component.id}-left`,
    data: {
      isContainer: true,
      accepts: ['Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });
  const { setNodeRef: setRightRef, isOver: isRightOver } = useDroppable({
    id: `droppable-${component.id}-right`,
    data: {
      isContainer: true,
      accepts: ['Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });
  
  // Split children into left and right columns
  const leftChildren = component.children.filter((_, index) => index % 2 === 0);
  const rightChildren = component.children.filter((_, index) => index % 2 !== 0);
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="text-xs font-medium text-gray-500 mb-2">2-Column Layout</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          ref={setLeftRef} 
          className={`p-3 min-h-[100px] rounded ${isLeftOver ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-gray-50'}`}
        >
          <div className="text-xs text-gray-400 mb-2">Left Column</div>
          <SortableContext items={leftChildren.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {leftChildren.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            ))}
            {leftChildren.length === 0 && (
              <div className="flex flex-col items-center justify-center h-20 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded p-2">
                <p>Left Column</p>
              </div>
            )}
          </SortableContext>
        </div>
        
        <div 
          ref={setRightRef} 
          className={`p-3 min-h-[100px] rounded ${isRightOver ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-gray-50'}`}
        >
          <div className="text-xs text-gray-400 mb-2">Right Column</div>
          <SortableContext items={rightChildren.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {rightChildren.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            ))}
            {rightChildren.length === 0 && (
              <div className="flex flex-col items-center justify-center h-20 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded p-2">
                <p>Right Column</p>
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

const ColumnContainer: React.FC<{ component: ColumnComponent }> = ({ component }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `droppable-${component.id}`,
    data: {
      isContainer: true,
      accepts: ['Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.id, // This ensures the component is added as a child of this column
    },
  });
  
  // Check if the currently dragged item is over this container
  const isActive = isOver && active?.data.current?.type;
  const canDrop = active?.data.current?.type && 
    ['Text', 'Button', 'Image', 'Divider', 'Heading'].includes(active.data.current.type);

  return (
    <div 
      ref={setNodeRef}
      className={`p-3 min-h-[80px] bg-white rounded-lg border transition-colors ${
        isOver && canDrop ? 'bg-blue-50 ring-2 ring-blue-400 border-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="text-xs text-gray-500 mb-2">Column</div>
      <SortableContext 
        items={component.children.map(c => c.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {component.children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
          {component.children.length === 0 && (
            <div className="flex flex-col items-center justify-center h-16 text-gray-400 text-sm bg-gray-50 rounded border-2 border-dashed border-gray-300">
              {isActive && canDrop ? 'Drop here' : 'Drop content here'}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const componentMap: { [key in CanvasComponent['type']]?: React.ComponentType<any> } = {
  Text,
  Button,
  Image,
  Divider,
  Heading,
  Structure: StructureContainer,
  Section: SectionContainer,
  OneColumn: OneColumnContainer,
  TwoColumn: TwoColumnContainer,
  Column: ColumnContainer,
};

export const ComponentRenderer: React.FC<{ component: CanvasComponent }> = ({ component }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: component.id,
    data: {
      type: component.type,
      component: component,
      parentId: component.parentId,
    },
  });
  
  const setActiveId = useStore(state => state.setActiveId);
  const moveComponent = useStore(state => state.moveComponent);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 'auto',
  };

  const RenderedComponent = componentMap[component.type];

  if (!RenderedComponent) {
    return <div className="p-4 bg-red-100 text-red-800 border border-red-200 rounded">Unknown component type: {component.type}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group"
      onClick={(e) => {
        e.stopPropagation();
        setActiveId(component.id);
      }}
    >
      <div className="relative">
        <RenderedComponent component={component} />
      </div>
    </div>
  );
};
