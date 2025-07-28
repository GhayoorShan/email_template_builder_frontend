import React from "react";
import type { CanvasComponent } from "../../../../types";
import { ComponentRenderer } from "../../../../features/canvas/ComponentRenderer";
import { useDroppable } from "@dnd-kit/core";

interface StripeProps {
  component: CanvasComponent;
  selectedId?: string | null;
}

export const Stripe: React.FC<StripeProps> = ({
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
        w-full transition-all duration-200 border-2 border-transparent
        ${isSelected ? "border-blue-500 bg-blue-50" : ""}
        ${isOver ? "border-green-400 bg-green-50" : ""}
        hover:border-gray-300
      `}
      style={{
        backgroundColor: component.props.backgroundColor || "#ffffff",
        padding: component.props.padding || "0px",
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
          <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg w-full">
            <p>Drop structures here to start building your email</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stripe;
