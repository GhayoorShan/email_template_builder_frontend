import { useStore } from "../store";
import { ButtonProperties } from "./forms/ButtonProperties";
import { ImageProperties } from "./forms/ImageProperties";
import { TextProperties } from "./forms/TextProperties";
import { GeneralProperties } from "./forms/GeneralProperties";
import { SectionProperties } from "./forms/SectionProperties";
import { DividerProperties } from "./forms/DividerProperties";
import { SocialMediaProperties } from "./forms/SocialMediaProperties";
import { MenuProperties } from "./forms/MenuProperties";

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
    const commonProps = {
      onUpdate: (updates: any) => {
        useStore.getState().updateComponent(activeComponent.id, updates);
      },
    };

    switch (activeComponent.type) {
      case "Button":
        return <ButtonProperties component={activeComponent} {...commonProps} />;
      case "Text":
        return <TextProperties component={activeComponent} {...commonProps} />;
      case "Image":
        return <ImageProperties component={activeComponent} {...commonProps} />;
      case "Section":
        return <SectionProperties component={activeComponent} {...commonProps} />;
      case "Divider":
        return <DividerProperties component={activeComponent} {...commonProps} />;
      case "SocialMedia":
        return <SocialMediaProperties component={activeComponent} {...commonProps} />;
      case "Menu":
        return <MenuProperties component={activeComponent} {...commonProps} />;
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
