import React from 'react';
import { Type, Image, Layout, Divide, Share2, Menu } from 'lucide-react';
import { BookmarkSquareIcon } from "@heroicons/react/24/outline";

interface ComponentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ComponentTabs: React.FC<ComponentTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'content', label: 'Content', icon: Type },
    { id: 'structure', label: 'Structure', icon: Layout },
    { id: 'modules', label: 'Modules', icon: BookmarkSquareIcon },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'navigation', label: 'Navigation', icon: Menu },
    { id: 'social', label: 'Social', icon: Share2 },
    { id: 'dividers', label: 'Dividers', icon: Divide },
  ];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center space-x-1 px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
