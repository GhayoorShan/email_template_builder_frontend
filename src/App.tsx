import "./App.css";
import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { useStore, type CanvasComponent } from "./store";
import { useDebounce } from "./hooks/useDebounce";
import { generateMjml } from "./utils/mjmlGenerator";
import { ComponentPanel, availableComponents } from "./components/ComponentPanel";
import { Canvas } from "./components/Canvas";
import { PropertiesPanel } from "./components/PropertiesPanel";
import { compileMjml } from "./api";

function App() {
  const { components, addComponent, moveComponent } = useStore();
  const [compiledHtml, setCompiledHtml] = useState(
    "<html><body><p>Preview will appear here.</p></body></html>"
  );
  const debouncedComponents = useDebounce(components, 500);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Scenario 1: Dragging a new component from the panel
        const isNewComponent = availableComponents.some((c: { id: string }) => c.id === activeId);

    if (isNewComponent) {
      const componentType = activeId as CanvasComponent['type'];
      const overIndex = components.findIndex((c) => c.id === overId);
      
      // If dropped on the canvas drop area directly or on the last item, append it
      if (overId === 'canvas-drop-area' || overIndex === components.length - 1) {
        addComponent(componentType);
      } else {
        // Otherwise, insert it at the position of the item it was dropped on
        addComponent(componentType, overIndex);
      }
      return;
    }

    // Scenario 2: Reordering an existing component
    const activeIndex = components.findIndex((c) => c.id === activeId);
    const overIndex = components.findIndex((c) => c.id === overId);

    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      moveComponent(activeIndex, overIndex);
    }
  }

  useEffect(() => {
    if (debouncedComponents.length === 0) {
      setCompiledHtml(
        "<html><body><p>Add components to see a preview.</p></body></html>"
      );
      return;
    }

    const mjml = generateMjml(debouncedComponents);

    const doCompile = async () => {
      try {
        const { html } = await compileMjml(mjml);
        setCompiledHtml(html);
      } catch (error: any) {
        console.error("Error compiling MJML:", error);
        // The error from api.ts will be more descriptive and include server output
        setCompiledHtml(
          `<html><body><h1>Compilation Error</h1><pre>${error.message}</pre></body></html>`
        );
      }
    };

    doCompile();
  }, [debouncedComponents]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-row h-screen overflow-hidden bg-slate-100 font-sans text-gray-900">
        {/* Left Sidebar: Fixed width, scrolls internally */}
        <aside className="w-64 flex-shrink-0 overflow-y-auto bg-white p-4 border-r border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">
            Components
          </h2>
          <ComponentPanel />
        </aside>

        {/* Center Area: Canvas and Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas on top */}
          <main className="h-1/2 overflow-y-auto p-4 bg-slate-200">
            <Canvas />
          </main>

          {/* Preview on bottom */}
          <div className="h-1/2 bg-white border-t-2 border-slate-300">
            <iframe
              title="Email Preview"
              className="w-full h-full border-0"
              srcDoc={compiledHtml}
            />
          </div>
        </div>

        {/* Right Sidebar: Fixed width, scrolls internally */}
        <aside className="w-80 flex-shrink-0 overflow-y-auto bg-white p-4 border-l border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-slate-900">
            Properties
          </h2>
          <PropertiesPanel />
        </aside>
      </div>
    </DndContext>
  );
}

export default App;
