import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useStore } from '../store';
import { useShallow } from 'zustand/react/shallow';
import { ComponentRenderer } from './ComponentRenderer';

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
      className={`w-full h-full bg-gray-50 p-4 overflow-y-auto ${isOver && isEmpty ? 'bg-blue-50' : ''}`}>
      <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        {isEmpty ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-12">
              <p className="font-semibold">
                {isOver ? 'Drop here to start' : 'Drag content or structures here'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {components.map((component) => (
              <ComponentRenderer key={component.id} component={component} />
            ))}
          </div>
        )}
      </SortableContext>
    </div>
  );
};
