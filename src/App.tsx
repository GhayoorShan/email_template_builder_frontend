import "./App.css";
import { Suspense, useState, useEffect, useRef, useTransition } from "react";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  closestCenter,
} from "@dnd-kit/core";
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
    const { active, over } = event;
    if (!over) return;

    const overId = over.id.toString();

    // Check if dragging a new component
    const componentType = active.data?.current?.type || active.id;
    const isNew = active.data?.current?.isNew;
    const preset = active.data?.current?.preset;

    if (isNew) {
      startTransition(() => {
        // For layout presets, create a structure with containers
        if (componentType === "Structure" && preset) {
          const structureId = nanoid();
          const structure: CanvasComponent = {
            id: structureId,
            type: "Structure",
            parentId: null,
            children: [],
            props: {
              backgroundColor: "#ffffff",
              padding: "0px",
              emailWidth: "600px",
              emailBackgroundColor: "#f4f4f4",
              fontFamily: "Arial, sans-serif",
              fontSize: "14px",
              lineHeight: "1.5",
              textColor: "#333333",
              linkColor: "#007bff",
              maxWidth: "600px",
              align: "center",
              containerGap: "20px",
              containerPadding: {
                top: "0px",
                right: "0px",
                bottom: "0px",
                left: "0px",
              },
            },
          };

          // Create containers based on preset
          const containers = preset.widths.map((width: string) => ({
            id: nanoid(),
            type: "Container",
            parentId: structureId,
            children: [],
            props: {
              backgroundColor: "#ffffff",
              padding: "20px",
              width,
              textAlign: "left",
            },
          }));

          structure.children = containers;
          addComponent(structure.type, null, 0, structure);
        }
        // For Stripe components
        else if (componentType === "Stripe") {
          const stripeId = nanoid();
          const stripe: CanvasComponent = {
            id: stripeId,
            type: "Stripe",
            parentId: null,
            children: [],
            props: {
              backgroundColor: "#ffffff",
              padding: "0px",
              stripeType: "content",
            },
          };
          addComponent(stripe.type, null, 0, stripe);
        }
        // For regular components
        else if (overId === "canvas-root" || overId === "root") {
          addComponent(componentType as CanvasComponent["type"], "root", 0);
        } else if (overId.startsWith("droppable-")) {
          const parentId = overId.replace("droppable-", "");
          addComponent(componentType as CanvasComponent["type"], parentId, 0);
        }
      });

      setActiveComponent(null);
      return;
    }

    // Handle existing components
    const existingComponent = useStore
      .getState()
      .findComponent(active.id as string);
    if (existingComponent) {
      // If we have a valid drop target and it's different from current position, move the component
      if (over && active.id !== over.id) {
        let targetParentId: string | null = null;

        if (overId === "canvas-root" || overId === "root") {
          targetParentId = "root";
        } else if (overId.startsWith("droppable-")) {
          targetParentId = overId.replace("droppable-", "");
        }

        if (targetParentId) {
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
function nanoid(size: number = 10): string {
  let id = "";
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < size; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
