import "./App.css";
import { useState, useEffect, useRef } from 'react';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor, closestCenter } from '@dnd-kit/core';
import { useStore } from './store';
import type { CanvasComponent } from './store';
import { PropertiesPanel } from './components/PropertiesPanel';
import { TopNavigation } from "./components/TopNavigation";
import { PreviewModal } from "./components/PreviewModal";
import { generateMjml } from "./utils/mjmlGenerator";
import { compileMjml } from './api';
import { availableComponents } from "./components/ComponentPanel";
import { Canvas } from './components/Canvas';
import { useDebounce } from './hooks/useDebounce';
import { IconSidebar } from './components/IconSidebar';
import { FlyoutPanel } from './components/FlyoutPanel';

function App() {
  const components = useStore((state) => state.components);
  const globalStyles = useStore((state) => state.globalStyles);
  const addComponent = useStore((state) => state.addComponent);
  const moveComponent = useStore((state) => state.moveComponent);
  const setActiveId = useStore((state) => state.setActiveId);

  const [activeComponent, setActiveComponent] = useState<CanvasComponent | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRightSidebarOpen] = useState(true);
  const [compiledHtml, setCompiledHtml] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const debouncedComponents = useDebounce(components, 500);
  const debouncedGlobalStyles = useDebounce(globalStyles, 500);

  useEffect(() => {
    const mjml = generateMjml(debouncedComponents, debouncedGlobalStyles);
    compileMjml(mjml)
      .then(({ html }) => setCompiledHtml(html))
      .catch(err => {
        console.error(err);
        setCompiledHtml('<html><body><h1>Error compiling MJML</h1></body></html>');
      });
  }, [debouncedComponents, debouncedGlobalStyles]);

  // Track if a drag is in progress
  const isDraggingRef = useRef(false);

  const handleDragStart = (event: DragStartEvent) => {
    isDraggingRef.current = true;
    const { active } = event;
    setActiveId(active.id as string);
    const isNew = availableComponents.some(c => c.id === active.id);
    if (isNew) {
      const componentType = active.id as CanvasComponent['type'];
      setActiveComponent({ id: `new-${componentType}`, parentId: null, type: componentType } as CanvasComponent);
    } else {
      const component = useStore.getState().findComponent(active.id as string);
      if (component) setActiveComponent(component);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isDraggingRef.current) {
      setActiveId(null);
      setActiveComponent(null);
      isDraggingRef.current = false;
    }
    const { active, over } = event;

    if (!over) return;

    const isNewComponent = availableComponents.some(c => c.id === active.id);
    const overId = over.id as string;
    const componentId = active.id as string;

    let parentId: string | null = null;
    if (overId === 'canvas-root') {
      parentId = null;
    } else if (overId.startsWith('droppable-')) {
      parentId = overId.replace('droppable-', '').replace(/-(left|right)$/, '');
    }

    const targetIndex = 999; // Simplified: always append

    if (isNewComponent) {
      const componentType = active.id as CanvasComponent['type'];
      addComponent(componentType, parentId, targetIndex);
    } else {
      if (componentId !== parentId) {
        moveComponent(componentId, parentId, targetIndex);
      }
    }
  };

  const handleExport = () => {
    const mjml = generateMjml(components, globalStyles);
    console.log(mjml);
  };

  const getCanvasWidth = () => {
    switch (viewMode) {
      case 'desktop': return '100%';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-screen bg-slate-100 font-sans">
        <IconSidebar activeCategory={activeTab} onCategoryChange={setActiveTab} />
        <FlyoutPanel 
          isOpen={activeTab !== null} 
          activeTab={activeTab || ''} 
          onClose={() => setActiveTab(null)} 
        />

        <div className="flex-1 flex flex-col">
          <TopNavigation 
            onPreviewClick={() => setIsPreviewOpen(true)} 
            onExportClick={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          <main className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div 
              className="bg-white shadow-lg transition-all duration-300 ease-in-out"
              style={{ width: getCanvasWidth(), height: 'calc(100vh - 80px)' }}
            >
              <Canvas />
            </div>
          </main>
        </div>

        {isRightSidebarOpen && (
          <div className="w-80 bg-white border-l border-slate-200 p-4 overflow-y-auto">
            <PropertiesPanel />
          </div>
        )}

        <PreviewModal 
          isOpen={isPreviewOpen} 
          onClose={() => setIsPreviewOpen(false)} 
          compiledHtml={compiledHtml}
        />

        <DragOverlay>
          {activeComponent ? (
            <div className="bg-white p-2 shadow-lg rounded-md opacity-90">
              <p className="font-semibold">{activeComponent.type}</p>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default App;
