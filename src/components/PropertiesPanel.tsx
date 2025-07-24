import { useStore } from "../store";
import { ButtonProperties } from "./forms/ButtonProperties";
import { ImageProperties } from "./forms/ImageProperties";
import { TextProperties } from "./forms/TextProperties";
import { GeneralProperties } from "./forms/GeneralProperties";

export function PropertiesPanel() {
  const components = useStore((state) => state.components);
  const activeId = useStore((state) => state.activeId);

  const activeComponent = components.find((c) => c.id === activeId);

  if (!activeComponent) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-4 text-slate-900">General Settings</h3>
        <GeneralProperties />
      </div>
    );
  }

  const renderPropertiesForm = () => {
    switch (activeComponent.type) {
      case "Button":
        return <ButtonProperties component={activeComponent} />;
      case "Text":
        return <TextProperties component={activeComponent} />;
      case "Image":
        return <ImageProperties component={activeComponent} />;
      default:
        return (
          <p className="text-sm text-gray-500">
            No properties to edit for this component.
          </p>
        );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-slate-900">
        Editing: {activeComponent.type}
      </h3>
      {renderPropertiesForm()}
    </div>
  );
}
