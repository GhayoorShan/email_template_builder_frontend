import React from 'react';
import { LayoutDashboard, Settings } from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';
import { Draggable } from '../ui/Draggable';
import { componentRegistry } from '../../config/componentRegistry';

interface IconSidebarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const IconSidebar: React.FC<IconSidebarProps> = ({ activeCategory, onCategoryChange }) => {
  const handleButtonClick = (category: string) => {
    if (activeCategory === category) {
      onCategoryChange(null); // Close if clicking the active category again
    } else {
      onCategoryChange(category);
    }
  };

  const structureComponent = {
    id: 'structure',
    name: 'Structure',
    icon: LayoutDashboard,
    description: 'Add layout elements like columns and sections.',
  };

  return (
    <aside className="h-full bg-white border-r border-gray-200 p-2 shadow-sm">
      <div className="flex flex-col items-center space-y-2">
        {/* Logo Placeholder */}
        <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
          <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
        </div>

        {/* Structure Button */}
        <Tooltip key={structureComponent.id} title={structureComponent.name} description={structureComponent.description}>
          <button
            onClick={() => handleButtonClick(structureComponent.id)}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 relative ${
              activeCategory === structureComponent.id
                ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            <structureComponent.icon size={24} />
          </button>
        </Tooltip>

        {/* Dynamic Draggable Components */}
        {Object.values(componentRegistry).map((comp) => {
          if (!comp.icon || !comp.type) return null;
          const Icon = comp.icon;
          return (
            <Tooltip key={comp.type} title={comp.type} description={`Add a ${comp.type} component.`}>
              <div className="w-12 h-12">
                <Draggable id={comp.type}>
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-grab active:cursor-grabbing">
                    <Icon size={24} />
                  </div>
                </Draggable>
              </div>
            </Tooltip>
          );
        })}

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Settings Button */}
        <button
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
          title="Global Styles"
        >
          <Settings size={24} />
        </button>
      </div>
    </aside>
  );
};
