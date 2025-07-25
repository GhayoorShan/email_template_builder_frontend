import React from 'react';
import type { SocialMediaComponent } from '../../store';

type SocialMediaPropertiesProps = {
  component: SocialMediaComponent;
  onUpdate: (updates: Partial<SocialMediaComponent>) => void;
};

const platforms = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'tiktok', label: 'TikTok' },
];

export const SocialMediaProperties: React.FC<SocialMediaPropertiesProps> = ({ 
  component, 
  onUpdate 
}) => {
  const updateIcon = (index: number, updates: Partial<SocialMediaComponent['icons'][0]>) => {
    const newIcons = [...component.icons];
    newIcons[index] = { ...newIcons[index], ...updates };
    onUpdate({ icons: newIcons });
  };

  const addIcon = () => {
    onUpdate({
      icons: [...component.icons, { platform: 'facebook', url: '#', altText: 'Social Icon' }]
    });
  };

  const removeIcon = (index: number) => {
    const newIcons = component.icons.filter((_, i) => i !== index);
    onUpdate({ icons: newIcons });
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
          <label className="block text-sm font-medium text-gray-700">Icon Size</label>
          <input
            type="text"
            value={component.iconSize}
            onChange={(e) => onUpdate({ iconSize: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="e.g., 24px"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Icon Spacing</label>
          <input
            type="text"
            value={component.iconSpacing}
            onChange={(e) => onUpdate({ iconSpacing: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="e.g., 10px"
          />
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-700">Social Icons</h4>
          <button
            type="button"
            onClick={addIcon}
            className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            Add Icon
          </button>
        </div>
        
        <div className="space-y-3">
          {component.icons.map((icon, index) => (
            <div key={index} className="p-3 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Icon {index + 1}
                </label>
                <button
                  type="button"
                  onClick={() => removeIcon(index)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              <div className="space-y-2">
                <select
                  value={icon.platform}
                  onChange={(e) => updateIcon(index, { platform: e.target.value as any })}
                  className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
                >
                  {platforms.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  value={icon.url}
                  onChange={(e) => updateIcon(index, { url: e.target.value })}
                  placeholder="URL"
                  className="block w-full rounded-md border-gray-300 shadow-sm text-sm"
                />
                
                <input
                  type="text"
                  value={icon.altText}
                  onChange={(e) => updateIcon(index, { altText: e.target.value })}
                  placeholder="Alt Text"
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
