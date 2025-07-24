import { useStore } from "../store";
import type { CanvasComponent } from "../store";

interface CanvasItemProps {
  component: CanvasComponent;
}

export function CanvasItem({ component }: CanvasItemProps) {
  const activeId = useStore((state) => state.activeId);
  const setActiveId = useStore((state) => state.setActiveId);

  const isSelected = activeId === component.id;

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

  return (
    <div
      onClick={() => setActiveId(component.id)}
      className={`cursor-pointer transition-all bg-white ${
        isSelected
          ? "ring-2 ring-indigo-600"
          : "ring-1 ring-transparent hover:ring-slate-300"
      }`}
      style={{
        textAlign: component.align as React.CSSProperties["textAlign"],
      }}
    >
      {renderContent()}
    </div>
  );
}
