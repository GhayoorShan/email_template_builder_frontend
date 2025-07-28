import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Box, Columns, Layout } from 'lucide-react';


// Error Boundary Component
interface LayoutComponent {
  id: string;
  name: string;
  type: string;
  icon: React.ReactNode;
  description: string;
}

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
const layoutComponents: LayoutComponent[] = [
  {
    id: 'structure',
    name: 'Structure',
    type: 'Structure',
    icon: <Layout className="w-6 h-6" />,
    description: 'Basic email structure'
  },
  {
    id: 'container',
    name: 'Container',
    type: 'Container',
    icon: <Box className="w-6 h-6" />,
    description: 'Content container with customizable layout'
  },
  {
    id: 'column',
    name: 'Column',
    type: 'Column',
    icon: <Columns className="w-6 h-6" />,
    description: 'Column layout for content'
  }
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

const DraggableComponent = ({ component }: { component: LayoutComponent }) => {
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
      className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-all hover:border-blue-400"
      {...listeners}
      {...attributes}
    >
      <div className="mb-3">{component.icon}</div>
      <span className="text-sm font-medium text-gray-700 mb-1">
        {component.name}
      </span>
      <p className="text-xs text-gray-500 text-center">
        {component.description}
      </p>
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
    setIsClient(true);
    setTab(activeTab);
  }, [activeTab]);

  if (!isClient || !isOpen) return null;

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 shadow-sm flex flex-col">
      <div className="flex-shrink-0 flex border-b border-gray-200">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === tabItem.key
                ? 'text-blue-600 border-b-2 border-blue-500'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
            aria-label={tabItem.label}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

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
