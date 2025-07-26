import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { ComponentRenderer } from './ComponentRenderer';
import { DropPlaceholder } from './DropPlaceholder';

export const Canvas: React.FC = () => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
  });

      const components = useStore(
    useShallow((state) => state.components.filter((c) => c.parentId === null))
  );
  const isEmpty = components.length === 0;

  return (
    <div
      ref={setNodeRef}
      className="w-full min-h-screen bg-gray-50 flex flex-col items-center p-6"
    >
      <div className="max-w-[800px] w-full mx-auto bg-white rounded-xl shadow-lg py-8 px-6 min-h-[600px] flex flex-col">
        <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {components.map((component) => (
              <ComponentRenderer key={component.id} component={component} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
