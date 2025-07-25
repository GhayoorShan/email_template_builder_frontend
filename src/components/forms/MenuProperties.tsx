import React from 'react';
import type { MenuComponent } from '../../store';

type MenuPropertiesProps = {
  component: MenuComponent;
  onUpdate: (updates: Partial<MenuComponent>) => void;
};

export const MenuProperties: React.FC<MenuPropertiesProps> = ({ 
  component, 
  onUpdate 
}) => {
  const updateItem = (index: number, updates: Partial<MenuComponent['items'][0]>) => {
    const newItems = [...component.items];
    newItems[index] = { ...newItems[index], ...updates };
    onUpdate({ items: newItems });
  };

  const addItem = () => {
    onUpdate({
      items: [...component.items, { text: 'New Item', url: '#' }]
    });
  };

  const removeItem = (index: number) => {
    const newItems = component.items.filter((_, i) => i !== index);
    onUpdate({ items: newItems });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Alignment</label>
          <select
            value={component.alignment}
            onChange={(e) => onUpdate({ alignment: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Item Spacing</label>
          <input
            type="text"
            value={component.itemSpacing}
            onChange={(e) => onUpdate({ itemSpacing: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="e.g., 10px"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Text Color</label>
          <input
            type="color"
            value={component.textColor}
            onChange={(e) => onUpdate({ textColor: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Hover Color</label>
          <input
            type="color"
            value={component.hoverTextColor}
            onChange={(e) => onUpdate({ hoverTextColor: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Item Padding</label>
        <input
          type="text"
          value={component.itemPadding}
          onChange={(e) => onUpdate({ itemPadding: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          placeholder="e.g., 10px 15px"
        />
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Menu Items</h4>
          <button
            type="button"
            onClick={addItem}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Add Item
          </button>
        </div>
        
        <div className="space-y-3">
          {component.items.map((item, index) => (
            <div key={index} className="p-3 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Item {index + 1}
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              <div className="space-y-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => updateItem(index, { text: e.target.value })}
                  placeholder="Menu Text"
                  className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
                />
                
                <input
                  type="text"
                  value={item.url}
                  onChange={(e) => updateItem(index, { url: e.target.value })}
                  placeholder="URL"
                  className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
