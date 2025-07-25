import React from 'react';
import type { SectionComponent } from '../../store';

type SectionPropertiesProps = {
  component: SectionComponent;
  onUpdate: (updates: Partial<SectionComponent>) => void;
};

export const SectionProperties: React.FC<SectionPropertiesProps> = ({ component, onUpdate }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Background Color</label>
        <input
          type="color"
          value={component.backgroundColor}
          onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Padding</label>
        <input
          type="text"
          value={component.padding}
          onChange={(e) => onUpdate({ padding: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="e.g., 20px or 10px 20px"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Border Width</label>
          <input
            type="text"
            value={component.borderWidth}
            onChange={(e) => onUpdate({ borderWidth: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="e.g., 1px"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Border Color</label>
          <input
            type="color"
            value={component.borderColor}
            onChange={(e) => onUpdate({ borderColor: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Border Radius</label>
        <input
          type="text"
          value={component.borderRadius}
          onChange={(e) => onUpdate({ borderRadius: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="e.g., 4px"
        />
      </div>
    </div>
  );
};
