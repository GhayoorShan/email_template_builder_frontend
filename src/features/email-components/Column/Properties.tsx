import React from 'react';
import Label from '../../../components/ui/label';
import { useStore } from '../../../store';
import type { ColumnComponent } from '../../../types';

type ColumnPropertiesProps = {
  component: ColumnComponent;
};

export const ColumnProperties: React.FC<ColumnPropertiesProps> = ({ component }) => {
  const updateComponent = useStore((state) => state.updateComponent);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateComponent(component.id, {
      props: {
        ...component.props,
        width: e.target.value
      }
    });
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateComponent(component.id, {
      props: {
        ...component.props,
        backgroundColor: e.target.value
      }
    });
  };

  const handlePaddingChange = (side: string, value: string) => {
    updateComponent(component.id, {
      props: {
        ...component.props,
        [`padding${side}`]: value
      }
    });
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label>Column Width</Label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={component.props?.width || '100%'}
            onChange={handleWidthChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="e.g., 50% or 200px"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Background Color</Label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={component.props?.backgroundColor || '#ffffff'}
            onChange={handleBackgroundColorChange}
            className="w-10 h-10 p-1 border rounded-md"
          />
          <input
            type="text"
            value={component.props?.backgroundColor || '#ffffff'}
            onChange={handleBackgroundColorChange}
            className="flex-1 px-3 py-2 border rounded-md"
            placeholder="e.g., #ffffff or white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Padding</Label>
        <div className="grid grid-cols-2 gap-2">
          {['Top', 'Right', 'Bottom', 'Left'].map((side) => (
            <div key={side}>
              <Label>{side}</Label>
              <input
                type="text"
                value={component.props?.[`padding${side}` as keyof typeof component.props] || '0'}
                onChange={(e) => handlePaddingChange(side, e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
