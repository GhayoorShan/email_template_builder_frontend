import React from 'react';
import type { CanvasComponent } from '../../types';

interface ComponentPreviewProps {
  component: Partial<CanvasComponent>;
}

export const ComponentPreview: React.FC<ComponentPreviewProps> = ({ component }) => {
  if (!component) return null;

  return (
    <div className="p-4 bg-white border-2 border-dashed border-blue-400 rounded-lg shadow-lg">
      <p className="text-sm font-medium text-gray-700">Adding {component.type} Component</p>
    </div>
  );
};
