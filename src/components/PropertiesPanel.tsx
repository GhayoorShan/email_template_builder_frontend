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
import { StyledPropertiesPanel } from "./ui/PropertiesPanel";

export function PropertiesPanel() {
  const {
    activeComponent,
    updateComponent,
  } = useStore(
    useShallow((state) => ({
      activeComponent: state.activeId ? state.findComponent(state.activeId) : undefined,
      updateComponent: state.updateComponent,
      saveAsModule: state.saveAsModule,
    }))
  );

  if (!activeComponent) {
    return (
      <StyledPropertiesPanel>
        <GeneralProperties />
      </StyledPropertiesPanel>
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
          <div className="p-4 text-sm text-gray-500">
            No properties to edit for this component.
          </div>
        );
    }
  };

  return (
    <StyledPropertiesPanel>
      {renderPropertiesForm()}
    </StyledPropertiesPanel>
  );
}
