import { Suspense } from 'react';
import { useStore } from "../../store";
import { useShallow } from 'zustand/react/shallow';
import { GeneralProperties } from "./GeneralProperties";
import { StyledPropertiesPanel } from "../../components/ui/PropertiesPanel";
import { componentRegistry } from "../../config/componentRegistry";

export function PropertiesPanel() {
  const {
    activeComponent,
    updateComponent,
  } = useStore(
    useShallow((state) => ({
      activeComponent: state.activeId ? state.findComponent(state.activeId) : undefined,
      updateComponent: state.updateComponent,
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
      updateComponent(activeComponent.id, updates);
    };

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <PropertiesComponent component={activeComponent} onUpdate={onUpdate} />
      </Suspense>
    );
  };

  return (
    <StyledPropertiesPanel>
      {renderPropertiesForm()}
    </StyledPropertiesPanel>
  );
}
