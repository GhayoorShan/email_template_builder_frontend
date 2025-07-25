import React from 'react';
import { Eye, Undo, Redo, Download, Monitor, Smartphone, Tablet, ChevronLeft } from 'lucide-react';
import { useStore } from '../store';

interface TopNavigationProps {
  onPreviewClick: () => void;
  onExportClick: () => void;
  viewMode: 'desktop' | 'tablet' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  onPreviewClick,
  onExportClick,
  viewMode,
  onViewModeChange,
}) => {
  const { undo, redo, canUndo, canRedo } = useStore();

  return (
    <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between shadow-md z-30">
      {/* Left Section - Back button and Title */}
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-md hover:bg-slate-700">
          <ChevronLeft size={20} />
        </button>
        <input 
          type="text" 
          defaultValue="New Message"
          className="bg-slate-700 rounded-md px-3 py-1.5 text-sm w-64 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Center Section - Undo/Redo and View Modes */}
      <div className="flex items-center space-x-6">
        {/* Undo/Redo */}
        <div className="flex items-center space-x-1">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className={`p-2 rounded-md transition-colors ${
              canUndo() 
                ? 'hover:bg-slate-700' 
                : 'text-slate-500 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo size={18} />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className={`p-2 rounded-md transition-colors ${
              canRedo() 
                ? 'hover:bg-slate-700' 
                : 'text-slate-500 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo size={18} />
          </button>
        </div>

        <div className="h-6 w-px bg-slate-600"></div>

        {/* View Mode Buttons */}
        <div className="flex items-center space-x-2 bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('desktop')}
            className={`p-2 rounded-md transition-colors text-sm flex items-center space-x-2 ${
              viewMode === 'desktop' 
                ? 'bg-slate-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white'
            }`}
            title="Desktop View"
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('tablet')}
            className={`p-2 rounded-md transition-colors text-sm flex items-center space-x-2 ${
              viewMode === 'tablet' 
                ? 'bg-slate-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white'
            }`}
            title="Tablet View"
          >
            <Tablet size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('mobile')}
            className={`p-2 rounded-md transition-colors text-sm flex items-center space-x-2 ${
              viewMode === 'mobile' 
                ? 'bg-slate-600 text-white shadow-sm' 
                : 'text-slate-300 hover:text-white'
            }`}
            title="Mobile View"
          >
            <Smartphone size={16} />
          </button>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onPreviewClick}
          className="flex items-center space-x-2 px-3 py-1.5 border border-slate-600 text-sm rounded-md hover:bg-slate-700 transition-colors"
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>
        <button
          onClick={onExportClick}
          className="flex items-center space-x-2 px-4 py-1.5 bg-green-600 text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
        >
          <Download size={16} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
