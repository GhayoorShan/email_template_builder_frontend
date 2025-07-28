import "./App.css";
import { Suspense, useState, useEffect, useRef, useTransition } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor, closestCenter } from "@dnd-kit/core";
import { useStore } from "./store";
import type { CanvasComponent } from "./types";
import { PropertiesPanel } from "./features/editor/PropertiesPanel";
import { TopNavigation } from "./components/layout/TopNavigation";
import { PreviewModal } from "./features/editor/PreviewModal";
import { generateMjml } from "./utils/mjmlGenerator";
import { compileMjml } from "./api";
// import { availableComponents } from "./features/editor/ComponentPanel"; // This will be replaced by the component registry
import { Canvas } from "./features/canvas/Canvas";
import { useDebounce } from "./hooks/useDebounce";
import { IconSidebar } from "./components/layout/IconSidebar";
import { FlyoutPanel } from "./features/editor/FlyoutPanel";
import { ComponentPreview } from "./features/canvas/ComponentPreview";
import { ComponentRenderer } from "./features/canvas/ComponentRenderer";
import { componentRegistry } from "./config/componentRegistry";

function App() {
  const components = useStore((state) => state.components);
  const globalStyles = useStore((state) => state.globalStyles);
  const { addComponent, moveComponent, setSelectedId } = useStore();
  const [, startTransition] = useTransition();

  const [activeComponent, setActiveComponent] =
    useState<Partial<CanvasComponent> | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [compiledHtml, setCompiledHtml] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const debouncedComponents = useDebounce(components, 500);
  const debouncedGlobalStyles = useDebounce(globalStyles, 500);

  useEffect(() => {
    const structureComponent = debouncedComponents.find(
      (c) => c.type === "Structure"
    );
    const structureProps = structureComponent ? structureComponent.props : {};
    const mjml = generateMjml(debouncedComponents, structureProps);
    compileMjml(mjml)
      .then(({ html }) => setCompiledHtml(html))
      .catch((err) => {
        console.error(err);
        setCompiledHtml(
          "<html><body><h1>Error compiling MJML</h1></body></html>"
        );
      });
  }, [debouncedComponents, debouncedGlobalStyles]);

  // Track if a drag is in progress
  const isDraggingRef = useRef(false);

  // Check if a component can be dropped in a target location (Stripo-like rules)
  const checkDropAllowed = (componentType: string, targetComponent: CanvasComponent | null): boolean => {
    // Structure can only contain Container components
    if (targetComponent?.type === 'Structure') {
      return componentType === 'Container';
    }
    
    // Container can contain Column components or content components
    if (targetComponent?.type === 'Container') {
      return componentType === 'Column' || 
             componentType === 'Text' || 
             componentType === 'Heading' || 
             componentType === 'Button' || 
             componentType === 'Image' || 
             componentType === 'Divider' || 
             componentType === 'SocialMedia' || 
             componentType === 'Menu';
    }
    
    // Column can only contain content components
    if (targetComponent?.type === 'Column') {
      return componentType === 'Text' || 
             componentType === 'Heading' || 
             componentType === 'Button' || 
             componentType === 'Image' || 
             componentType === 'Divider' || 
             componentType === 'SocialMedia' || 
             componentType === 'Menu';
    }
    
    // Root level can only contain Structure components
    if (!targetComponent) {
      return componentType === 'Structure';
    }
    
    // Default: allow drop
    return true;
  };

  const handleDragStart = (event: DragStartEvent) => {
    isDraggingRef.current = true;
    const { active } = event;

    // Check if it's a new component from the sidebar
    const componentType =
      active.data?.current?.type || (active.id as CanvasComponent["type"]);
    const isNew =
      componentType in componentRegistry || active.data?.current?.isNew;

    if (isNew) {
      // For new components, set the active component with a temporary ID
      setActiveComponent({
        id: `new-${Date.now()}`,
        parentId: null,
        type: componentType as CanvasComponent["type"],
      });
    } else {
      // For existing components, find and set the component
      setSelectedId(active.id as string);
      const component = useStore.getState().findComponent(active.id as string);
      if (component) setActiveComponent(component);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    isDraggingRef.current = false;
    const { active, over } = event;
    if (!over) {
      // Clear selection if dropped outside
      setSelectedId(null);
      setActiveComponent(null);
      return;
    }

    const overId = over.id.toString();

    // Check if dragging a new component
    const componentType = active.data?.current?.type || active.id;
    const isNew = active.data?.current?.isNew;
    const preset = active.data?.current?.preset;

    if (isNew) {
      startTransition(() => {
        // Handle dropping new components with Stripo-like restrictions
        if (overId === "canvas-root" || overId.startsWith("droppable-")) {
          let parentId: string | null = null;
          let index = 0;

          if (overId === "canvas-root") {
            parentId = null;
          } else {
            parentId = overId.replace("droppable-", "");
          }

          // Enforce drop restrictions based on component type
          const targetComponent = parentId 
            ? useStore.getState().findComponent(parentId)
            : null;
          
          // Check if the drop is allowed based on Stripo-like rules
          const isDropAllowed = checkDropAllowed(componentType as string, targetComponent);
          
          if (isDropAllowed) {
            addComponent(
              componentType as CanvasComponent["type"],
              parentId,
              index,
              preset
            );
          }
        }
      });
    } else {
      // Handle moving existing components
      const existingComponent = useStore
        .getState()
        .findComponent(active.id as string);

      if (existingComponent) {
        // If we have a valid drop target and it's different from current position, move the component
        if (over && active.id !== over.id) {
          let targetParentId: string | null = null;

          if (overId === "canvas-root" || overId === "root") {
            targetParentId = null;
          } else if (overId.startsWith("droppable-")) {
            targetParentId = overId.replace("droppable-", "");
          }

          // Enforce drop restrictions for moving components
          const targetComponent = targetParentId 
            ? useStore.getState().findComponent(targetParentId)
            : null;
            
          const isDropAllowed = checkDropAllowed(existingComponent.type, targetComponent);
          
          if (targetParentId && isDropAllowed) {
            moveComponent(active.id as string, targetParentId, 0);
          }
        }

        // Always maintain selection for existing components (whether moved or just clicked)
        setSelectedId(active.id as string);
        setActiveComponent(existingComponent);
      } else {
        // If component not found, clear selection
        setSelectedId(null);
        setActiveComponent(null);
      }
    }
  };

  const handleExport = () => {
    const structureComponent = components.find((c) => c.type === "Structure");
    const structureProps = structureComponent ? structureComponent.props : {};
    const mjml = generateMjml(components, structureProps);
    console.log(mjml);
  };

  const getCanvasWidth = () => {
    switch (viewMode) {
      case "desktop":
        return "100%";
      case "tablet":
        return "768px";
      case "mobile":
        return "375px";
      default:
        return "100%";
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-[auto_1fr_auto] h-screen bg-slate-100 font-sans overflow-hidden">
        {/* Left Sidebar */}
        <div className="h-full flex">
          <IconSidebar
            activeCategory={activeTab}
            onCategoryChange={setActiveTab}
          />
          <FlyoutPanel
            isOpen={activeTab !== null}
            onClose={() => setActiveTab(null)}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-shrink-0">
            <TopNavigation
              onPreviewClick={() => setIsPreviewOpen(true)}
              onExportClick={handleExport}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>

          <main className="flex-1 overflow-auto p-4">
            <div className="flex items-start justify-center min-h-full">
              <div
                className="bg-white shadow-lg transition-all duration-300 ease-in-out overflow-auto"
                style={{
                  width: getCanvasWidth(),
                  minHeight: "calc(100vh - 120px)",
                }}
              >
                <Suspense fallback={<div>Loading...</div>}>
                  <Canvas selectedId={activeComponent?.id ?? null} />
                </Suspense>
              </div>
            </div>
          </main>
        </div>

        {/* Right Sidebar */}
        <div className="h-full overflow-y-auto">
          <PropertiesPanel />
        </div>

        <PreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          compiledHtml={compiledHtml}
        />

        <DragOverlay>
          {activeComponent && activeComponent.id ? (
            <div className="pointer-events-none">
              {activeComponent.id.startsWith("new-") ? (
                <ComponentPreview component={activeComponent} />
              ) : (
                <ComponentRenderer
                  component={activeComponent as CanvasComponent}
                  selectedId={activeComponent.id}
                />
              )}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default App;
