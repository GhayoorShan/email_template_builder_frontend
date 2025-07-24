import { useStore } from "../store";
import type { CanvasComponent } from "../store";

interface CanvasItemProps {
  component: CanvasComponent;
  isDragging?: boolean;
}

export function CanvasItem({ component, isDragging = false }: CanvasItemProps) {
  const activeId = useStore((state) => state.activeId);
  const setActiveId = useStore((state) => state.setActiveId);

  const isSelected = activeId === component.id && !isDragging;

  // Render the actual component based on its type and properties
  const renderContent = () => {
    switch (component.type) {
      case "Text":
        return (
          <p
            style={{
              textAlign: component.align as React.CSSProperties["textAlign"],
              paddingTop: component.paddingTop,
              paddingRight: component.paddingRight,
              paddingBottom: component.paddingBottom,
              paddingLeft: component.paddingLeft,
              color: component.color,
            }}
          >
            {component.text}
          </p>
        );
      case "Button":
        return (
          <button
            style={{
              paddingTop: component.paddingTop,
              paddingRight: component.paddingRight,
              paddingBottom: component.paddingBottom,
              paddingLeft: component.paddingLeft,
              backgroundColor: component.backgroundColor,
              borderRadius: component.borderRadius,
              color: component.color,
              border: "none",
            }}
          >
            {component.buttonText}
          </button>
        );
      case "Image":
        return (
          <img
            src={component.src}
            alt="placeholder"
            className="max-w-full h-auto"
          />
        );
      default:
        return <p>Unknown component type</p>;
    }
  };

  const baseClasses = "w-full text-center cursor-pointer bg-white rounded-md shadow-sm transition-all";
  const typeClasses = {
    Text: "p-6",
    Button: "p-4",
    Image: "p-4",
  };

  // Note: The hover border is now handled by SortableItem's `group-hover`.
  // CanvasItem handles its own padding, background, and selection state.
  return (
    <div
      onClick={() => setActiveId(component.id)}
      className={`
        ${baseClasses} 
        ${typeClasses[component.type]} 
        ${isDragging ? 'opacity-50' : ''}
        ${isSelected ? 'bg-blue-50' : 'bg-white'}
      `}
      style={{
        // Inline styles from component properties are still applied
        textAlign: component.align as React.CSSProperties["textAlign"],
      }}
    >
      {renderContent()}
    </div>
  );
}
