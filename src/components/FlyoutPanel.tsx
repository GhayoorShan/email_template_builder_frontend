import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store';
import type { CanvasComponent } from '../store';
import { Draggable } from './Draggable';

// Import all icons
import {
  RectangleHorizontal as SectionIcon,
  Rows as OneColumnIcon,
  Columns as TwoColumnIcon,
} from 'lucide-react';

// Only structure/layout components for the flyout panel
const layoutComponents = [
  { id: 'Section', name: 'Section', icon: <SectionIcon /> },
  { id: 'OneColumn', name: '1 Column', icon: <OneColumnIcon /> },
  { id: 'TwoColumn', name: '2 Column', icon: <TwoColumnIcon /> },
];

// Module item component for saved modules
const ModuleItem = ({ component }: { component: CanvasComponent }) => (
  <div className="p-2 text-center bg-white rounded-lg shadow-sm flex flex-col items-center justify-center h-24 cursor-grab active:cursor-grabbing">
    <span className="text-sm font-medium text-slate-700">{component.type}</span>
    <span className="text-xs text-slate-500">Module</span>
  </div>
);

interface FlyoutPanelProps {
  isOpen: boolean;
  activeTab: string;
  onClose: () => void;
}

const tabs = [
  { key: 'structure', icon: <SectionIcon />, label: 'Layouts' },
  { key: 'content', icon: <OneColumnIcon />, label: 'Content' },
  { key: 'media', icon: <TwoColumnIcon />, label: 'Media' },
];

export const FlyoutPanel: React.FC<FlyoutPanelProps> = ({ isOpen, activeTab, onClose }) => {
  if (!isOpen) return null;

  const modules = useStore((state) => state.modules);
  const [tab, setTab] = React.useState(activeTab || 'structure');
  React.useEffect(() => { setTab(activeTab); }, [activeTab]);

  if (activeTab.toLowerCase() === 'modules') {
    if (modules.length === 0) {
      return (
        <div className="p-4 text-center text-sm text-slate-500">
          <p>You haven't saved any modules yet.</p>
          <p className="mt-2">Select a component on the canvas and click "Save as Module" to get started.</p>
        </div>
      );
    }

    return (
      <div className="p-3">
        <div className="grid grid-cols-2 gap-3">
          {modules.map((module) => (
            <Draggable key={module.id} id={module.id}>
              <ModuleItem component={module} />
            </Draggable>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed top-6 left-24 h-[calc(100vh-48px)] bg-white rounded-2xl shadow-2xl z-30 transition-transform duration-300 ease-in-out border border-slate-200 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ width: 360 }}
    >
      <div className="flex flex-col h-full">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <button
            onClick={onClose}
            className="p-1 mr-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                  tab === t.key ? 'bg-blue-100 text-blue-600 shadow' : 'hover:bg-slate-100 text-slate-500'
                }`}
                onClick={() => setTab(t.key)}
                aria-label={t.label}
              >
                {React.cloneElement(t.icon, { size: 20 })}
              </button>
            ))}
          </div>
        </div>
        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'structure' && (
            <div className="flex flex-col gap-4">
              {layoutComponents.map((comp) => (
                <Draggable key={comp.id} id={comp.id}>
                  <div className="flex flex-col items-center cursor-grab active:cursor-grabbing">
                    {/* Visual layout representation */}
                    {comp.id === 'OneColumn' && (
                      <div className="w-full h-16 flex items-center justify-center">
                        <div className="flex-1 h-10 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/40" />
                      </div>
                    )}
                    {comp.id === 'TwoColumn' && (
                      <div className="w-full h-16 flex items-center gap-3 justify-center">
                        <div className="flex-1 h-10 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/40" />
                        <div className="flex-1 h-10 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/40" />
                      </div>
                    )}
                    {comp.id === 'Section' && (
                      <div className="w-full h-16 flex items-center justify-center">
                        <div className="flex-1 h-10 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/40" />
                      </div>
                    )}
                    <span className="mt-2 font-medium text-sm text-gray-600 text-center">
                      {comp.name}
                    </span>
                  </div>
                </Draggable>
              ))}
            </div>
          )}
          {tab !== 'structure' && (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-slate-400 text-sm">
              <span>Coming soon</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
