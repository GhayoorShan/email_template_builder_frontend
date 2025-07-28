import React from "react";
import { useStore } from "../../../../store";
import type { StructureComponent, CanvasComponent } from "../../../../types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { ArrowsUpDownIcon, TrashIcon } from "@heroicons/react/24/outline";

// Tab navigation component for properties panel
const TabNavigation: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => (
  <div className="border-b border-gray-200 mb-4">
    <nav className="flex -mb-px">
      {["Settings", "Styles"].map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-2 font-medium text-sm border-b-2 ${
            activeTab === tab
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  </div>
);

// Stepper input component
interface StepperInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  min?: number;
  max?: number;
}

const StepperInput: React.FC<StepperInputProps> = ({
  label,
  value,
  onChange,
  unit = "px",
  min = 0,
  max = 100,
}) => {
  const numericValue = parseInt(value) || 0;

  return (
    <div className="flex items-center justify-between">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onChange(`${Math.max(min, numericValue - 1)}${unit}`)}
          className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
          disabled={numericValue <= min}
        >
          -
        </button>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 px-2 py-1 text-center border rounded"
        />
        <button
          onClick={() => onChange(`${Math.min(max, numericValue + 1)}${unit}`)}
          className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
          disabled={numericValue >= max}
        >
          +
        </button>
      </div>
    </div>
  );
};

// Container row component
interface ContainerRowProps {
  id: string;
  index: number;
  width: string;
  onRemove: (id: string) => void;
  onWidthChange: (id: string, width: string) => void;
}

const ContainerRow: React.FC<ContainerRowProps> = ({
  id,
  index,
  width,
  onRemove,
  onWidthChange,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-white hover:bg-gray-50 border-b"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-move p-1 text-gray-400 hover:text-gray-600"
        >
          <ArrowsUpDownIcon className="h-4 w-4" />
        </div>
        <span className="text-sm text-gray-600">Container {index + 1}</span>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={width}
          onChange={(e) => onWidthChange(id, e.target.value)}
          className="w-20 px-2 py-1 text-sm border rounded"
          placeholder="Width"
        />
        <button
          onClick={() => onRemove(id)}
          className="p-1 text-gray-400 hover:text-red-500"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

interface StructurePropertiesProps {
  component: StructureComponent;
}

export const StructureProperties: React.FC<StructurePropertiesProps> = ({
  component,
}) => {
  const [activeTab, setActiveTab] = React.useState("Settings");
  const updateComponent = useStore((state) => state.updateComponent);
  const MAX_CONTAINERS = 11;

  // Calculate total width of existing containers
  const getTotalWidth = (containers: CanvasComponent[] = []) => {
    return containers.reduce((total, container) => {
      const width = container.props.width || "100%";
      return total + (parseInt(width) || 0);
    }, 0);
  };

  // Distribute width evenly among containers
  const distributeWidthEvenly = (containers: CanvasComponent[]) => {
    const count = containers.length;
    const equalWidth = Math.floor(100 / count);
    const remainder = 100 - equalWidth * count;

    return containers.map((container, index) => ({
      ...container,
      props: {
        ...container.props,
        width: `${equalWidth + (index < remainder ? 1 : 0)}%`,
      },
    }));
  };

  // Add container while maintaining width constraints
  const addContainer = () => {
    if (!component.children || component.children.length >= MAX_CONTAINERS) {
      return;
    }

    const newContainers = [
      ...(component.children || []),
      {
        id: `container-${Date.now()}`,
        type: "Container" as const,
        parentId: component.id,
        props: {
          backgroundColor: "#ffffff",
          padding: "20px",
          width: "100%",
          textAlign: "left",
          direction: "ltr",
        },
        children: [],
      },
    ];

    // Redistribute widths evenly
    const adjustedContainers = distributeWidthEvenly(newContainers);
    updateComponent(component.id, { children: adjustedContainers });
  };

  // Update container width with validation
  const updateContainerWidth = (containerId: string, newWidth: string) => {
    if (!component.children) return;

    const numericWidth = parseInt(newWidth) || 0;
    if (numericWidth < 0) return;

    const otherContainers = component.children.filter(
      (c) => c.id !== containerId
    );
    const otherWidthTotal = getTotalWidth(otherContainers);

    if (numericWidth + otherWidthTotal > 100) {
      // If new width would exceed 100%, adjust it down
      const maxAllowedWidth = 100 - otherWidthTotal;
      if (maxAllowedWidth <= 0) return;

      const adjustedContainers = component.children.map((container) =>
        container.id === containerId
          ? {
              ...container,
              props: { ...container.props, width: `${maxAllowedWidth}%` },
            }
          : container
      );

      updateComponent(component.id, { children: adjustedContainers });
    } else {
      // Update width if it's valid
      const updatedContainers = component.children.map((container) =>
        container.id === containerId
          ? {
              ...container,
              props: { ...container.props, width: `${numericWidth}%` },
            }
          : container
      );

      updateComponent(component.id, { children: updatedContainers });
    }
  };

  // Handle container presets
  const addContainerPreset = (count: number) => {
    if (count > MAX_CONTAINERS) return;

    const equalWidth = Math.floor(100 / count);
    const remainder = 100 - equalWidth * count;

    const containers = Array.from({ length: count }, (_, index) => ({
      id: `container-${Date.now()}-${index}`,
      type: "Container" as const,
      parentId: component.id,
      props: {
        backgroundColor: "#ffffff",
        padding: "20px",
        width: `${equalWidth + (index < remainder ? 1 : 0)}%`,
        textAlign: "left",
        direction: "ltr",
      },
      children: [],
    }));

    updateComponent(component.id, { children: containers });
  };

  // Remove container and redistribute width
  const removeContainer = (containerId: string) => {
    if (!component.children || component.children.length <= 1) return;

    const remainingContainers = component.children.filter(
      (c) => c.id !== containerId
    );
    const adjustedContainers = distributeWidthEvenly(remainingContainers);

    updateComponent(component.id, { children: adjustedContainers });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || !active || active.id === over.id || !component.children)
      return;

    const oldIndex = component.children.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = component.children.findIndex(
      (item) => item.id === over.id
    );

    if (oldIndex !== -1 && newIndex !== -1) {
      updateComponent(component.id, {
        children: arrayMove(component.children, oldIndex, newIndex),
      });
    }
  };

  return (
    <div className="space-y-6 p-4">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Settings" && (
        <>
          {/* Container Management */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">
                Containers ({component.children?.length || 0}/{MAX_CONTAINERS})
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => addContainerPreset(1)}
                  className="px-2 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
                  disabled={component.children?.length === MAX_CONTAINERS}
                >
                  [1]
                </button>
                <button
                  onClick={() => addContainerPreset(2)}
                  className="px-2 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
                  disabled={2 > MAX_CONTAINERS}
                >
                  [2]
                </button>
                <button
                  onClick={addContainer}
                  className="px-2 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50"
                  disabled={component.children?.length === MAX_CONTAINERS}
                >
                  [+]
                </button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis]}
              >
                <SortableContext
                  items={(component.children || []).map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {(component.children || []).map((container, index) => (
                    <ContainerRow
                      key={container.id}
                      id={container.id}
                      index={index}
                      width={container.props.width || "100%"}
                      onRemove={removeContainer}
                      onWidthChange={updateContainerWidth}
                    />
                  ))}
                </SortableContext>
              </DndContext>
              {(!component.children || component.children.length === 0) && (
                <div className="p-4 text-center text-sm text-gray-500">
                  No containers. Add one using the buttons above.
                </div>
              )}
            </div>
          </div>

          {/* Structure Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900">
              Layout Settings
            </h3>
            <StepperInput
              label="Container Gap"
              value={component.props.containerGap || "20px"}
              onChange={(value) =>
                updateComponent(component.id, {
                  props: { ...component.props, containerGap: value },
                })
              }
            />
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">
                Container Padding
              </label>
              <div className="grid grid-cols-2 gap-2">
                <StepperInput
                  label="Top"
                  value={component.props.containerPadding?.top || "0px"}
                  onChange={(value) =>
                    updateComponent(component.id, {
                      props: {
                        ...component.props,
                        containerPadding: {
                          ...(component.props.containerPadding || {}),
                          top: value,
                        },
                      },
                    })
                  }
                />
                <StepperInput
                  label="Right"
                  value={component.props.containerPadding?.right || "0px"}
                  onChange={(value) =>
                    updateComponent(component.id, {
                      props: {
                        ...component.props,
                        containerPadding: {
                          ...(component.props.containerPadding || {}),
                          right: value,
                        },
                      },
                    })
                  }
                />
                <StepperInput
                  label="Bottom"
                  value={component.props.containerPadding?.bottom || "0px"}
                  onChange={(value) =>
                    updateComponent(component.id, {
                      props: {
                        ...component.props,
                        containerPadding: {
                          ...(component.props.containerPadding || {}),
                          bottom: value,
                        },
                      },
                    })
                  }
                />
                <StepperInput
                  label="Left"
                  value={component.props.containerPadding?.left || "0px"}
                  onChange={(value) =>
                    updateComponent(component.id, {
                      props: {
                        ...component.props,
                        containerPadding: {
                          ...(component.props.containerPadding || {}),
                          left: value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === "Styles" && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Style Settings</h3>
          <div className="space-y-2">
            <label className="block text-sm text-gray-600">
              Background Color
            </label>
            <input
              type="color"
              value={component.props.backgroundColor || "#ffffff"}
              onChange={(e) =>
                updateComponent(component.id, {
                  props: {
                    ...component.props,
                    backgroundColor: e.target.value,
                  },
                })
              }
              className="w-full h-8 rounded border"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StructureProperties;
