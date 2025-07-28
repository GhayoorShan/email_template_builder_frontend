import React from "react";
import type { StructureComponent, CanvasComponent } from "../../../../types";
import { ComponentRenderer } from "../../../../features/canvas/ComponentRenderer";
import { useDroppable } from "@dnd-kit/core";

interface StructureProps {
  component: StructureComponent;
  selectedId?: string | null;
}

export const Structure: React.FC<StructureProps> = ({
  component,
  selectedId,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
  });

  const isSelected = selectedId === component.id;

  // Calculate total width to enforce 100% limit
  const totalWidth =
    component.children?.reduce((total, child) => {
      const width = parseInt(child.props.width || "100");
      return total + width;
    }, 0) || 0;

  // Adjust widths if total exceeds 100%
  const adjustedChildren = component.children?.map((child) => {
    if (totalWidth > 100) {
      const currentWidth = parseInt(child.props.width || "100");
      const adjustedWidth = Math.floor((currentWidth / totalWidth) * 100);
      return {
        ...child,
        props: {
          ...child.props,
          width: `${adjustedWidth}%`,
        },
      };
    }
    return child;
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        min-h-[200px] w-full transition-all duration-200
        ${isSelected ? "ring-2 ring-blue-500" : ""}
        ${isOver ? "bg-blue-50" : ""}
      `}
      style={{
        backgroundColor: component.props.emailBackgroundColor || "#f4f4f4",
        padding: component.props.padding || "0px",
        fontFamily: component.props.fontFamily || "Arial, sans-serif",
        fontSize: component.props.fontSize || "14px",
        lineHeight: component.props.lineHeight || "1.5",
        color: component.props.textColor || "#333333",
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: component.props.maxWidth || "600px",
          width: component.props.emailWidth || "600px",
          textAlign: component.props.align || "center",
        }}
      >
        <div className="flex flex-row flex-wrap" style={{ margin: "0 -10px" }}>
          {adjustedChildren?.map((child: CanvasComponent) => (
            <div
              key={child.id}
              style={{
                padding: `${component.props.containerPadding?.top || "0px"} ${
                  component.props.containerPadding?.right || "0px"
                } ${component.props.containerPadding?.bottom || "0px"} ${
                  component.props.containerPadding?.left || "0px"
                }`,
                width: `${child.props.width || "100%"}`,
                paddingLeft: "10px",
                paddingRight: "10px",
                boxSizing: "border-box",
              }}
            >
              <ComponentRenderer
                component={child}
                selectedId={selectedId || null}
              />
            </div>
          ))}

          {(!component.children || component.children.length === 0) && (
            <div className="flex items-center justify-center h-32 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg w-full">
              <p>Drop containers here to start building your email</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Structure;
