import React from 'react';
import type { ContainerComponent } from '../../../types';
import { useStore } from '../../../store';

interface ContainerPropertiesProps {
  component: ContainerComponent;
}

export const ContainerProperties: React.FC<ContainerPropertiesProps> = ({ component }) => {
  const updateComponent = useStore((state) => state.updateComponent);

  const handlePropChange = (key: string, value: string | boolean) => {
    updateComponent(component.id, {
      props: { ...component.props, [key]: value }
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Container Settings</h3>
      
      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <input
          type="color"
          value={component.props.backgroundColor || '#ffffff'}
          onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Padding */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Padding
        </label>
        <input
          type="text"
          value={component.props.padding || '20px'}
          onChange={(e) => handlePropChange('padding', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="20px"
        />
      </div>

      {/* Border Width */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Width
        </label>
        <input
          type="text"
          value={component.props.borderWidth || '0px'}
          onChange={(e) => handlePropChange('borderWidth', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0px"
        />
      </div>

      {/* Border Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Color
        </label>
        <input
          type="color"
          value={component.props.borderColor || '#ffffff'}
          onChange={(e) => handlePropChange('borderColor', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Border Radius
        </label>
        <input
          type="text"
          value={component.props.borderRadius || '0px'}
          onChange={(e) => handlePropChange('borderRadius', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0px"
        />
      </div>

      {/* Full Width */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={component.props.fullWidth || false}
            onChange={(e) => handlePropChange('fullWidth', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Full Width</span>
        </label>
      </div>

      {/* Direction */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Direction
        </label>
        <select
          value={component.props.direction || 'ltr'}
          onChange={(e) => handlePropChange('direction', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ltr">Left to Right</option>
          <option value="rtl">Right to Left</option>
        </select>
      </div>

      {/* Text Align */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Text Alignment
        </label>
        <select
          value={component.props.textAlign || 'left'}
          onChange={(e) => handlePropChange('textAlign', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );
};

export default ContainerProperties;
