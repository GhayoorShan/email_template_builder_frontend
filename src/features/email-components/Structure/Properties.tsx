import React from "react";
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
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  TrashIcon,
  PlusIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";
import type { StructureComponent, CanvasComponent } from "../../../types";
import { useStore } from "../../../store";
import { useSortable } from "@dnd-kit/sortable";

interface SortableItemProps {
  id: string;
  index: number;
  onRemove: (id: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, index, onRemove }) => {
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
      className="flex items-center justify-between p-3 hover:bg-gray-50"
    >
      <div className="flex items-center">
        <div
          {...attributes}
          {...listeners}
          className="p-1 text-gray-400 hover:text-gray-600 cursor-move mr-2"
        >
          <ArrowsUpDownIcon className="h-4 w-4" />
        </div>
        <span className="text-sm text-gray-800">Container #{index + 1}</span>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="p-1 text-gray-400 hover:text-red-600"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

interface StructurePropertiesProps {
  component: StructureComponent;
}

export const StructureProperties: React.FC<StructurePropertiesProps> = ({
  component,
}) => {
  const updateComponent = useStore((state) => state.updateComponent);

  const handlePropChange = (key: string, value: string) => {
    updateComponent(component.id, {
      props: { ...component.props, [key]: value },
    });
  };

  // Ensure component.children is always an array
  const children = component.children || [];

  const addContainer = () => {
    const newContainer: CanvasComponent = {
      id: `container-${Date.now()}`,
      type: "Container",
      props: {
        padding: "20px 0",
        backgroundColor: "#ffffff",
        textAlign: "left",
      },
      children: [
        {
          id: `column-${Date.now()}`,
          type: "Column",
          props: {
            width: "100%",
            padding: "0 15px",
            verticalAlign: "top",
          },
          children: [],
          parentId: `container-${Date.now()}`,
        },
      ],
      parentId: component.id,
    };

    updateComponent(component.id, {
      children: [...(component.children || []), newContainer],
    });
  };

  const removeContainer = (containerId: string) => {
    updateComponent(component.id, {
      children: (component.children || []).filter(
        (child) => child.id !== containerId
      ),
    });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!component.children || active.id === over.id) {
      return;
    }

    const oldIndex = component.children.findIndex(
      (item) => item.id === active.id
    );
    const newIndex = component.children.findIndex(
      (item) => item.id === over.id
    );

    updateComponent(component.id, {
      children: arrayMove(component.children, oldIndex, newIndex),
    });
  };

  return (
    <div className="space-y-6">
      {/* Container Management */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Containers</h3>
        <div className="space-y-2">
          <button
            onClick={addContainer}
            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add New Container
          </button>
          <div className="border rounded-md divide-y divide-gray-200">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={children.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {children.length > 0 ? (
                  children.map((container, index) => (
                    <SortableItem
                      key={container.id}
                      id={container.id}
                      index={index}
                      onRemove={removeContainer}
                    />
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No containers yet. Add one to get started.
                  </div>
                )}
              </SortableContext>
            </DndContext>
            {children.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No containers added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureProperties;
