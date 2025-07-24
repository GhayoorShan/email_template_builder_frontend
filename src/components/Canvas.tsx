import { useDroppable } from "@dnd-kit/core";
import { useStore } from "../store";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";

export function Canvas() {
  const { setNodeRef } = useDroppable({
    id: "canvas-drop-area",
  });

  const components = useStore((state) => state.components);
  const removeComponent = useStore((state) => state.removeComponent);

  return (
    <div
      ref={setNodeRef}
      className="w-full h-full bg-white border-2 border-dashed border-slate-300 rounded-lg p-4 space-y-4 shadow-sm"
    >
      <SortableContext
        items={components.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {components.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-gray-400">Drop components here</p>
          </div>
        ) : (
          components.map((component) => (
            <SortableItem
              key={component.id}
              id={component.id}
              component={component}
              onDelete={removeComponent}
            />
          ))
        )}
      </SortableContext>
    </div>
  );
}
