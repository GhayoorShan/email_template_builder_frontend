import React from 'react';
import { X } from 'lucide-react';
import { ComponentPanel } from './ComponentPanel';

interface FlyoutPanelProps {
  isOpen: boolean;
  activeTab: string;
  onClose: () => void;
}

const categoryTitles: { [key: string]: string } = {
  content: 'Content Blocks',
  structure: 'Layout Structures',
  media: 'Media Elements',
  navigation: 'Navigation Menus',
  social: 'Social Media Links',
  dividers: 'Dividers & Spacers',
};

export const FlyoutPanel: React.FC<FlyoutPanelProps> = ({ isOpen, activeTab, onClose }) => {
  if (!isOpen) return null;

  const title = categoryTitles[activeTab] || 'Components';

  return (
    <div 
      className={`absolute top-0 left-16 h-full bg-white shadow-xl z-10 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width: '250px' }}
    >
      <div className="flex flex-col h-full">
        {/* Panel Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Component Panel Content */}
        <div className="flex-1 overflow-y-auto">
          <ComponentPanel activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
};
