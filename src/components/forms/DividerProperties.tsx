import React from 'react';
import type { DividerComponent } from '../../store';

type DividerPropertiesProps = {
  component: DividerComponent;
  onUpdate: (updates: Partial<DividerComponent>) => void;
};

export const DividerProperties: React.FC<DividerPropertiesProps> = ({ component, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Style</label>
        <select
          value={component.borderStyle}
          onChange={(e) => onUpdate({ borderStyle: e.target.value as any })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Width</label>
          <input
            type="text"
            value={component.width}
            onChange={(e) => onUpdate({ width: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="e.g., 100% or 200px"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Thickness</label>
          <input
            type="text"
            value={component.borderWidth}
            onChange={(e) => onUpdate({ borderWidth: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="e.g., 1px"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <input
          type="color"
          value={component.borderColor}
          onChange={(e) => onUpdate({ borderColor: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Vertical Spacing</label>
        <input
          type="text"
          value={component.padding}
          onChange={(e) => onUpdate({ padding: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="e.g., 20px or 10px 0"
        />
      </div>
    </div>
  );
};
