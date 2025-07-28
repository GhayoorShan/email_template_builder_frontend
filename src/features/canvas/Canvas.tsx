import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useStore } from "../../store";
import { useShallow } from "zustand/react/shallow";
import { ComponentRenderer } from "./ComponentRenderer";
import type { CanvasComponent } from "../../types";

interface CanvasProps {
  selectedId: string | null;
}

export const Canvas: React.FC<CanvasProps> = ({ selectedId }) => {
  const { setNodeRef } = useDroppable({
    id: "canvas-root",
  });

  const components = useStore(
    useShallow((state) =>
      state.components.filter((c: CanvasComponent) => c.parentId === null)
    )
  );

  return (
    <div
      ref={setNodeRef}
      className="w-full min-h-screen bg-slate-100 flex flex-col items-center p-0"
    >
      <div
        className="max-w-[800px] w-full mx-auto bg-white border border-slate-300 shadow-xl min-h-[600px] flex flex-col transition-all duration-300"
        style={{ marginTop: "32px", marginBottom: "32px" }}
      >
        <SortableContext
          items={components.map((c: CanvasComponent) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4 p-8">
            {components.map((component: CanvasComponent) => (
              <ComponentRenderer
                key={component.id}
                component={component}
                selectedId={selectedId}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};
