import { Suspense } from "react";
import { useStore } from "../../store";
import { useShallow } from "zustand/react/shallow";
import { GeneralProperties } from "./GeneralProperties";
import { StyledPropertiesPanel } from "../../components/ui/PropertiesPanel";
import { componentRegistry } from "../../config/componentRegistry";

export function PropertiesPanel() {
  const { selectedId, components, updateComponent } = useStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      components: state.components,
      updateComponent: state.updateComponent,
    }))
  );

  const activeComponent = selectedId
    ? components.find((c) => c.id === selectedId)
    : null;

  if (!activeComponent) {
    return (
      <StyledPropertiesPanel>
        <GeneralProperties />
      </StyledPropertiesPanel>
    );
  }

  const renderPropertiesForm = () => {
    const config = componentRegistry[activeComponent.type];
    const PropertiesComponent = config?.properties;

    if (!PropertiesComponent) {
      return (
        <div className="p-4 text-sm text-gray-500">
          No properties to edit for this component.
        </div>
      );
    }

    const onUpdate = (updates: any) => {
      // If the updates contain props, update them properly
      if ("props" in updates) {
        updateComponent(activeComponent.id, {
          props: { ...activeComponent.props, ...updates.props },
        });
      } else {
        // For components that don't use the props structure
        updateComponent(activeComponent.id, updates);
      }
    };

    return (
      <Suspense fallback={<div>Loading properties...</div>}>
        <PropertiesComponent component={activeComponent} onUpdate={onUpdate} />
      </Suspense>
    );
  };

  return (
    <StyledPropertiesPanel>{renderPropertiesForm()}</StyledPropertiesPanel>
  );
}
