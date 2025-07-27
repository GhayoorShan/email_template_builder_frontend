import React from 'react';
import type { StructureComponent } from '../../../types';
import { ComponentRenderer } from '../../canvas/ComponentRenderer';
import { useDroppable } from '@dnd-kit/core';

interface StructureProps {
  component: StructureComponent;
  selectedId?: string | null;
}

export const Structure: React.FC<StructureProps> = ({ component, selectedId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
  });

  const isSelected = selectedId === component.id;

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[200px] w-full transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isOver ? 'bg-blue-50' : ''}
      `}
      style={{
        backgroundColor: component.props.emailBackgroundColor || '#f4f4f4',
        padding: component.props.padding || '0px',
        fontFamily: component.props.fontFamily || 'Arial, sans-serif',
        fontSize: component.props.fontSize || '14px',
        lineHeight: component.props.lineHeight || '1.5',
        color: component.props.textColor || '#333333',
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: component.props.maxWidth || '600px',
          width: component.props.emailWidth || '600px',
          textAlign: component.props.align || 'center',
        }}
      >
        {component.children?.map((child) => (
          <ComponentRenderer
            key={child.id}
            component={child}
            selectedId={selectedId || null}
          />
        ))}
        
        {(!component.children || component.children.length === 0) && (
          <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
            <p>Drop containers here to start building your email</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Structure;
