import React from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { useStore } from '../store';
import type { CanvasComponent, StructureComponent, ColumnComponent } from '../store';

// Import your actual components
import { Text, Button, Image, Divider } from './renderer';

const StructureContainer: React.FC<{ component: StructureComponent }> = ({ component }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `droppable-${component.id}` });

  return (
    <div ref={setNodeRef} className={`p-2 bg-gray-200 border border-dashed border-gray-400 rounded-lg ${isOver ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}>
      <SortableContext items={component.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {component.children.map(child => (
          <ComponentRenderer key={child.id} component={child} />
        ))}
        {component.children.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-gray-500 bg-gray-100 rounded-md border-2 border-dashed border-gray-300">
            <p className="font-semibold">Drop Columns Here</p>
            <p className="text-sm">Drag structural blocks from the panel</p>
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const ColumnContainer: React.FC<{ component: ColumnComponent }> = ({ component }) => {
  const { setNodeRef, isOver } = useDroppable({ id: `droppable-${component.id}` });

  return (
    <div ref={setNodeRef} className={`p-4 min-h-[100px] bg-gray-100 rounded-lg transition-colors ${isOver ? 'bg-blue-100 ring-2 ring-blue-400' : 'border border-dashed border-gray-300'}`}>
      <SortableContext items={component.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {component.children.map(child => (
          <ComponentRenderer key={child.id} component={child} />
        ))}
        {component.children.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-gray-500">
            <p className="font-semibold">Drop Content Here</p>
            <p className="text-sm">Drag blocks from the panel</p>
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const componentMap: { [key in CanvasComponent['type']]?: React.ComponentType<any> } = {
  Text,
  Button,
  Image,
  Divider,
  Structure: StructureContainer,
  Section: StructureContainer,
  OneColumn: StructureContainer,
  TwoColumn: StructureContainer,
  Column: ColumnContainer,
};

export const ComponentRenderer: React.FC<{ component: CanvasComponent }> = ({ component }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: component.id });
  const setActiveId = useStore(state => state.setActiveId);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const RenderedComponent = componentMap[component.type];

  if (!RenderedComponent) {
    return <div className="p-4 bg-red-200 text-red-800">Unknown component type: {component.type}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
        setActiveId(component.id);
      }}
    >
      <RenderedComponent component={component} />
    </div>
  );
};
