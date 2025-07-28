import React, { useEffect, useRef } from "react";
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

  const hasInitialized = useRef(false);

  const components = useStore(
    useShallow((state) =>
      state.components.filter((c: CanvasComponent) => c.parentId === null)
    )
  );

  // Add initial structure with container on mount if canvas is empty
  useEffect(() => {
    if (!hasInitialized.current && components.length === 0) {
      const addComponent = useStore.getState().addComponent;
      const structureId = `structure-${Date.now()}`;
      const containerId = `container-${Date.now()}`;

      const structure: CanvasComponent = {
        id: structureId,
        type: "Structure",
        parentId: null,
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
        children: [
          {
            id: containerId,
            type: "Container",
            parentId: structureId,
            props: {
              backgroundColor: "#ffffff",
              padding: "20px",
              width: "100%",
              textAlign: "left",
              direction: "ltr",
            },
            children: [],
          },
        ],
      };

      addComponent("Structure", null, 0, structure);
      hasInitialized.current = true;
    }
  }, [components.length]);

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
