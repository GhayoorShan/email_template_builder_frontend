import React from "react";
import { ComponentRenderer } from "../../../../features/canvas/ComponentRenderer";
import { useDroppable } from "@dnd-kit/core";
import type { ContainerComponent, CanvasComponent } from "../../../../types";

interface ContainerProps {
  component: ContainerComponent;
  selectedId?: string | null;
}

export const Container: React.FC<ContainerProps> = ({
  component,
  selectedId,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
  });

  const isSelected = selectedId === component.id;

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full transition-all duration-200
        ${isSelected ? "ring-2 ring-blue-500" : ""}
        ${isOver ? "bg-blue-50" : ""}
      `}
      style={{
        backgroundColor: component.props.backgroundColor || "#ffffff",
        padding: component.props.padding || "20px",
        borderWidth: component.props.borderWidth
          ? parseInt(component.props.borderWidth)
          : 0,
        borderColor: component.props.borderColor || "#ffffff",
        borderRadius: component.props.borderRadius
          ? parseInt(component.props.borderRadius)
          : 0,
        direction: component.props.direction || "ltr",
        textAlign: component.props.textAlign || "left",
      }}
    >
      {component.children && component.children.length > 0 ? (
        <div className="flex flex-col gap-4">
          {component.children.map((child: CanvasComponent) => (
            <ComponentRenderer
              key={child.id}
              component={child}
              selectedId={selectedId || null}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
          <p>Drop components here</p>
        </div>
      )}
    </div>
  );
};

export default Container;
