import React from 'react';
import { LayoutDashboard, Type, Heading1, MousePointerClick, Image, Menu, Share2, Minus, Settings } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { Draggable } from './Draggable';

interface IconSidebarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const sidebarComponents = [
  { id: 'structure', name: 'Structure', icon: LayoutDashboard, description: 'Add layout elements like columns and sections.' },
  { id: 'Text', name: 'Text', icon: Type, description: 'Add text blocks.' },
  { id: 'Heading', name: 'Heading', icon: Heading1, description: 'Add headings.' },
  { id: 'Button', name: 'Button', icon: MousePointerClick, description: 'Add buttons.' },
  { id: 'Image', name: 'Image', icon: Image, description: 'Add images.' },
  { id: 'Divider', name: 'Divider', icon: Minus, description: 'Add dividers.' },
  { id: 'SocialMedia', name: 'Social', icon: Share2, description: 'Add social media sharing links.' },
  { id: 'Menu', name: 'Menu', icon: Menu, description: 'Add navigation menus.' },
];

export const IconSidebar: React.FC<IconSidebarProps> = ({ activeCategory, onCategoryChange }) => {
  const handleButtonClick = (category: string) => {
    if (activeCategory === category) {
      onCategoryChange(null); // Close if clicking the active category again
    } else {
      onCategoryChange(category);
    }
  };

  return (
    <aside className="fixed top-1/2 -translate-y-1/2 left-4 bg-white rounded-2xl p-2 shadow-lg z-20">
      <div className="flex flex-col items-center space-y-2">
        {/* Logo Placeholder */}
        <div className="w-12 h-12 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
          <div className="w-6 h-6 bg-gray-300 rounded-sm"></div>
        </div>

        {sidebarComponents.map((comp) => {
          const Icon = comp.icon;
          // Only "Structure" icon is a button that opens the flyout
          if (comp.id === 'structure') {
            const isActive = activeCategory === comp.id;
            return (
              <Tooltip key={comp.id} title={comp.name} description={comp.description}>
                <button
                  onClick={() => handleButtonClick(comp.id)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 relative ${
                    isActive
                      ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={24} />
                </button>
              </Tooltip>
            );
          }
          // All other icons are directly draggable
          return (
            <Tooltip key={comp.id} title={comp.name} description={comp.description}>
              <div className="w-12 h-12">
                <Draggable id={comp.id}>
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
