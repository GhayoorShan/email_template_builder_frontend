import React from 'react';
import type { ContainerComponent } from '../../../types';
import { ComponentRenderer } from '../../canvas/ComponentRenderer';
import { useDroppable } from '@dnd-kit/core';

interface ContainerProps {
  component: ContainerComponent;
  selectedId?: string | null;
}

export const Container: React.FC<ContainerProps> = ({ component, selectedId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
  });

  const isSelected = selectedId === component.id;

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[100px] w-full transition-all duration-200 border-2 border-transparent
        ${isSelected ? 'border-blue-500 bg-blue-50' : ''}
        ${isOver ? 'border-blue-300 bg-blue-25' : ''}
        hover:border-gray-300
      `}
      style={{
        backgroundColor: component.props.backgroundColor || '#ffffff',
        padding: component.props.padding || '20px',
        borderWidth: component.props.borderWidth || '0px',
        borderColor: component.props.borderColor || '#ffffff',
        borderRadius: component.props.borderRadius || '0px',
        direction: component.props.direction || 'ltr',
        textAlign: component.props.textAlign || 'left',
        width: component.props.fullWidth ? '100%' : 'auto',
      }}
    >
      <div className="flex flex-nowrap">
        {component.children?.map((child) => (
          <div 
            key={child.id} 
            className="px-1" 
            style={{ flexBasis: child.props.width, flexShrink: 0 }}
          >
            <ComponentRenderer
              component={child}
              selectedId={selectedId || null}
            />
          </div>
        ))}
        
        {(!component.children || component.children.length === 0) && (
          <div className="flex items-center justify-center h-24 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg w-full">
            <p>Select a column layout to add columns.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Container;
