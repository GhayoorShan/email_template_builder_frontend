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
        min-h-[100px] w-full transition-all duration-200 border-2 border-transparent
        ${isSelected ? "border-blue-500 bg-blue-50" : ""}
        ${isOver ? "border-blue-300 bg-blue-25" : ""}
        hover:border-gray-300
      `}
      style={{
        backgroundColor: component.props.backgroundColor || "#ffffff",
        padding: component.props.padding || "20px",
        borderWidth: component.props.borderWidth || "0px",
        borderColor: component.props.borderColor || "#ffffff",
        borderRadius: component.props.borderRadius || "0px",
      }}
    >
      <div className="w-full">
        {component.children?.map((child: CanvasComponent) => (
          <ComponentRenderer
            key={child.id}
            component={child}
            selectedId={selectedId || null}
          />
        ))}

        {(!component.children || component.children.length === 0) && (
          <div className="flex items-center justify-center h-24 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
            <p>Drop content here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Container;
