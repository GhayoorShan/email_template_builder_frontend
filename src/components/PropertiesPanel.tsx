import { useStore } from "../store";
import { useShallow } from 'zustand/react/shallow';
import { ButtonProperties } from "./forms/ButtonProperties";
import { ImageProperties } from "./forms/ImageProperties";
import { TextProperties } from "./forms/TextProperties";
import { GeneralProperties } from "./forms/GeneralProperties";
import { HeadingProperties } from "./forms/HeadingProperties";
import { SectionProperties } from "./forms/SectionProperties";
import { DividerProperties } from "./forms/DividerProperties";
import { SocialMediaProperties } from "./forms/SocialMediaProperties";
import { MenuProperties } from "./forms/MenuProperties";

export function PropertiesPanel() {
    const {
    activeComponent,
    updateComponent,
    saveAsModule,
  } = useStore(
    useShallow((state) => ({
      activeComponent: state.activeId ? state.findComponent(state.activeId) : undefined,
      updateComponent: state.updateComponent,
      saveAsModule: state.saveAsModule,
    }))
  );

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
        updateComponent(activeComponent.id, updates);
      },
    };

    switch (activeComponent.type) {
      case "Button":
        return <ButtonProperties component={activeComponent} {...commonProps} />;
      case "Text":
        return <TextProperties component={activeComponent} {...commonProps} />;
      case "Image":
        return <ImageProperties component={activeComponent} {...commonProps} />;
      case "Heading":
        return <HeadingProperties component={activeComponent} {...commonProps} />;
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
      <div className="mt-6">
        <button
          onClick={() => {
            if (activeComponent) {
              saveAsModule(activeComponent);
              alert(`${activeComponent.type} saved as a module!`);
            }
          }}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save as Module
        </button>
      </div>
    </div>
  );
}
