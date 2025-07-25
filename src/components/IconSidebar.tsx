import React from 'react';
import { LayoutDashboard, Type, Image, Menu, Share2, Minus, Settings } from 'lucide-react';

interface IconSidebarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: 'structure', name: 'Structure', icon: LayoutDashboard },
  { id: 'content', name: 'Content', icon: Type },
  { id: 'media', name: 'Media', icon: Image },
  { id: 'navigation', name: 'Navigation', icon: Menu },
  { id: 'social', name: 'Social', icon: Share2 },
  { id: 'dividers', name: 'Dividers', icon: Minus },
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
    <aside className="w-16 bg-slate-800 text-white flex flex-col items-center py-4 space-y-2 shadow-lg z-20">
      {/* Logo Placeholder */}
      <div className="w-8 h-8 bg-slate-600 rounded-lg mb-4"></div>

      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            onClick={() => handleButtonClick(cat.id)}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out transform hover:scale-110 hover:bg-slate-600 ${
              activeCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
            title={cat.name}
          >
            <Icon size={20} />
          </button>
        );
      })}

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Settings Button */}
      <button
        className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-700 text-slate-300 transition-colors hover:bg-slate-600"
        title="Global Styles"
      >
        <Settings size={20} />
      </button>
    </aside>
  );
};
