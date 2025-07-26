// src/components/ComponentPanel.tsx

'use client';

import React from 'react';
import {
  Heading1,
  Type,
  MousePointerClick,
  Image as ImageIcon,
  Divide as DividerIcon,
  Share2 as SocialIcon,
  Menu as MenuIcon,
  RectangleHorizontal as SectionIcon,
  Columns as TwoColumnIcon,
  Rows as OneColumnIcon,
} from 'lucide-react';
import { useStore } from '../store';
import type { CanvasComponent } from '../store';
import { Draggable } from './Draggable';

const availableComponents = [
  { id: 'Text', name: 'Text', category: 'Content', icon: <Type /> },
  { id: 'Heading', name: 'Heading', category: 'Content', icon: <Heading1 /> },
  {
    id: 'Button',
    name: 'Button',
    category: 'Content',
    icon: <MousePointerClick />,
  },
  { id: 'Image', name: 'Image', category: 'Content', icon: <ImageIcon /> },
  {
    id: 'Divider',
    name: 'Divider',
    category: 'Content',
    icon: <DividerIcon />,
  },
  {
    id: 'SocialMedia',
    name: 'Social',
    category: 'Content',
    icon: <SocialIcon />,
  },
  { id: 'Menu', name: 'Menu', category: 'Content', icon: <MenuIcon /> },
  {
    id: 'Section',
    name: 'Section',
    category: 'Structure',
    icon: <SectionIcon />,
  },
  {
    id: 'OneColumn',
    name: '1 Column',
    category: 'Structure',
    icon: <OneColumnIcon />,
  },
  {
    id: 'TwoColumn',
    name: '2 Columns',
    category: 'Structure',
    icon: <TwoColumnIcon />,
  },
] as const;

interface ComponentPanelProps {
  activeTab: string;
}

const ModuleItem = ({ component }: { component: CanvasComponent }) => (
  <div className="p-2 text-center bg-white rounded-lg shadow-sm flex flex-col items-center justify-center h-24 cursor-grab active:cursor-grabbing">
    <span className="text-sm font-medium text-slate-700">{component.type}</span>
    <span className="text-xs text-slate-500">Module</span>
  </div>
);

const ComponentPanel: React.FC<ComponentPanelProps> = ({ activeTab }) => {
  const modules = useStore((state) => state.modules);

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

  const filteredComponents = availableComponents.filter(
    (c) => c.category.toLowerCase() === activeTab.toLowerCase()
  );

  if (filteredComponents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">No components in this category</p>
      </div>
    );
  }

  const isStructureTab = activeTab.toLowerCase() === 'structure';

  return (
    <div className="p-3">
      <div className={`grid gap-3 ${isStructureTab ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {filteredComponents.map((comp) => (
          <Draggable key={comp.id} id={comp.id}>
            {isStructureTab ? (
              <div className="flex items-center justify-center p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-100 hover:border-blue-400 transition-all h-24">
                <span className="font-medium text-sm text-gray-500 text-center">
                  {comp.name}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:bg-slate-50 hover:border-blue-500 transition-all aspect-square">
                {React.cloneElement(comp.icon, {
                  className: 'h-6 w-6 text-slate-600 mb-2',
                })}
                <span className="font-medium text-xs text-slate-700 text-center">
                  {comp.name}
                </span>
              </div>
            )}
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export { ComponentPanel, availableComponents };
