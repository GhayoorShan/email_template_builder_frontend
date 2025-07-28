import React from "react";
import { ComponentRenderer } from "../../../../features/canvas/ComponentRenderer";
import { useDroppable } from "@dnd-kit/core";
import type { ColumnComponent, CanvasComponent } from "../../../../types";
import { useStore } from "../../../../store";

interface ColumnProps {
  component: ColumnComponent;
  selectedId?: string | null;
}

export const Column: React.FC<ColumnProps> = ({ component, selectedId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
  });

  const setSelectedId = useStore(
    (state: { setSelectedId: (id: string) => void }) => state.setSelectedId
  );
  const isSelected = selectedId === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(component.id);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleClick}
      className={`
        min-h-[80px] w-full p-2 transition-all duration-200 border-2
        ${isSelected ? "border-blue-500 bg-blue-50" : "border-transparent"}
        ${isOver ? "border-green-400 bg-green-50" : ""}
        hover:border-gray-300
      `}
      style={{
        backgroundColor: component.props.backgroundColor,
        padding: `${component.props.paddingTop} ${component.props.paddingRight} ${component.props.paddingBottom} ${component.props.paddingLeft}`,
      }}
    >
      {component.children && component.children.length > 0 ? (
        component.children.map((child: CanvasComponent) => (
          <ComponentRenderer
            key={child.id}
            component={child}
            selectedId={selectedId || null}
          />
        ))
      ) : (
        <div className="flex items-center justify-center h-full text-xs text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
          <p>Drop content here</p>
        </div>
      )}
    </div>
  );
};

export default Column;
