import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {
  RectangleHorizontal as SectionIcon,
  Rows as OneColumnIcon,
  Columns as TwoColumnIcon,
} from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('FlyoutPanel Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500">Something went wrong in this panel.</div>;
    }
    return this.props.children;
  }
}

// Layout components for the flyout panel
const layoutComponents = [
  { 
    id: 'Section', 
    name: 'Section', 
    type: 'Section',
    icon: <SectionIcon />,
    preview: (
      <div className="w-full h-16 flex items-center justify-center">
        <div className="flex-1 h-10 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/40" />
      </div>
    )
  },
  { 
    id: 'OneColumn', 
    name: '1 Column',
    type: 'OneColumn',
    icon: <OneColumnIcon />,
    preview: (
      <div className="w-full h-16 flex items-center justify-center">
        <div className="flex-1 h-10 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/40" />
      </div>
    )
  },
  { 
    id: 'TwoColumn', 
    name: '2 Column',
    type: 'TwoColumn',
    icon: <TwoColumnIcon />,
    preview: (
      <div className="w-full h-16 flex items-center gap-3 justify-center">
        <div className="flex-1 h-10 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/40" />
        <div className="flex-1 h-10 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/40" />
      </div>
    )
  },
];

const tabs = [
  { key: 'structure', label: 'Layouts' },
  { key: 'content', label: 'Content' },
  { key: 'media', label: 'Media' },
];

interface FlyoutPanelProps {
  isOpen: boolean;
  activeTab: string;
  onClose?: () => void;
}

const DraggableComponent = ({ component }: { component: typeof layoutComponents[0] }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: component.id,
    data: {
      type: component.type,
      isNew: true
    }
  });

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing"
      {...listeners}
      {...attributes}
    >
      {component.preview}
      <span className="mt-2 text-sm font-medium text-gray-700">
        {component.name}
      </span>
    </div>
  );
};

const LayoutComponentsList = () => {
  return (
    <div className="grid gap-4">
      {layoutComponents.map((comp) => (
        <DraggableComponent key={comp.id} component={comp} />
      ))}
    </div>
  );
};

export const FlyoutPanel: React.FC<FlyoutPanelProps> = ({ isOpen, activeTab }) => {
  const [tab, setTab] = useState(activeTab || 'structure');
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Ensure we're on the client before rendering
    setIsClient(true);
    setTab(activeTab);
  }, [activeTab]);
  
  // Don't render anything on the server
  if (!isClient || !isOpen) return null;
  


  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Tabs */}
      <div className="flex-shrink-0 flex border-b border-gray-200">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === tabItem.key
                ? 'text-green-600 border-b-2 border-green-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
            aria-label={tabItem.label}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        <ErrorBoundary>
          {tab === 'structure' && <LayoutComponentsList />}
          
          {tab === 'content' && (
            <div className="flex items-center justify-center h-40 text-gray-400">
              <p>Content components coming soon</p>
            </div>
          )}
          
          {tab === 'media' && (
            <div className="flex items-center justify-center h-40 text-gray-400">
              <p>Media components coming soon</p>
            </div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
};
