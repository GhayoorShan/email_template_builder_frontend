import { useDroppable } from "@dnd-kit/core";
import { useStore } from "../store";
import { CanvasItem } from "./CanvasItem";

export function Canvas() {
  const { setNodeRef } = useDroppable({
    id: "canvas-drop-area",
  });

  const components = useStore((state) => state.components);

  return (
    <div
      ref={setNodeRef}
      className="w-full h-full bg-white border-2 border-dashed border-slate-300 rounded-lg p-4 space-y-4 shadow-sm"
    >
      {components.length === 0 ? (
        <p className="text-center text-gray-400">Drop components here</p>
      ) : (
        components.map((component) => (
          <CanvasItem key={component.id} component={component} />
        ))
      )}
    </div>
  );
}
