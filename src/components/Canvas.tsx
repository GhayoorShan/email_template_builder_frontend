import { useDroppable } from "@dnd-kit/core";
import { useStore } from "../store";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

// Simple drop indicator component
function DropIndicator() {
  return (
    <div className="relative py-2 my-2">
      <div className="h-1 bg-blue-500 rounded-full w-full animate-pulse"></div>
    </div>
  );
}

export function Canvas() {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-drop-area",
  });

  const components = useStore((state) => state.components);
  const removeComponent = useStore((state) => state.removeComponent);
  const dropIndicatorId = useStore((state) => state.dropIndicatorId);
  const activeId = useStore((state) => state.activeId);

  const isEmpty = components.length === 0;

  return (
    <div
      ref={setNodeRef}
      className={`w-full h-full bg-white border-2 rounded-lg p-4 space-y-2 shadow-sm transition-colors ${
        isOver && isEmpty
          ? "border-blue-500 bg-blue-50"
          : "border-dashed border-slate-300"
      }`}
    >
      <SortableContext
        items={components.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {isEmpty ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-400 border-2 border-dashed border-gray-300 rounded-lg p-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
              </svg>
              <p className="mt-4 font-semibold">
                {isOver ? "Drop to add your first component" : "Drag components here"}
              </p>
              <p className="text-sm">Build your email by dragging blocks from the left panel.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {components.map((component) => (
              <div key={component.id} className="relative">
                {dropIndicatorId === component.id && component.id !== activeId && (
                  <DropIndicator />
                )}
                <SortableItem
                  id={component.id}
                  component={component}
                  onDelete={removeComponent}
                />
              </div>
            ))}
            {/* Show indicator at the end if dragging over canvas area or last item */}
            {isOver && dropIndicatorId === 'canvas-drop-area' && (
              <DropIndicator />
            )}
          </div>
        )}
      </SortableContext>
    </div>
  );
}
