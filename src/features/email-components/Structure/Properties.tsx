import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { TrashIcon, PlusIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import type { StructureComponent, CanvasComponent } from '../../../types';
import { useStore } from '../../../store';

interface StructurePropertiesProps {
  component: StructureComponent;
}

export const StructureProperties: React.FC<StructurePropertiesProps> = ({ component }) => {
  const updateComponent = useStore((state) => state.updateComponent);

  const handlePropChange = (key: string, value: string) => {
    updateComponent(component.id, {
      props: { ...component.props, [key]: value }
    });
  };
  
  // Ensure component.children is always an array
  const children = component.children || [];

  const addContainer = () => {
    const newContainer: CanvasComponent = {
      id: `container-${Date.now()}`,
      type: 'Container',
      props: {
        padding: '20px 0',
        backgroundColor: '#ffffff',
        textAlign: 'left'
      },
      children: [
        {
          id: `column-${Date.now()}`,
          type: 'Column',
          props: {
            width: '100%',
            padding: '0 15px',
            verticalAlign: 'top'
          },
          children: [],
          parentId: `container-${Date.now()}`
        }
      ],
      parentId: component.id
    };

    updateComponent(component.id, {
      children: [...(component.children || []), newContainer]
    });
  };

  const removeContainer = (containerId: string) => {
    updateComponent(component.id, {
      children: (component.children || []).filter(child => child.id !== containerId)
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

    const oldIndex = component.children.findIndex(item => item.id === active.id);
    const newIndex = component.children.findIndex(item => item.id === over.id);
    
    updateComponent(component.id, {
      children: arrayMove(component.children, oldIndex, newIndex)
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
                {children.map((container, index) => (
                  <div
                    key={container.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div className="p-1 text-gray-400 hover:text-gray-600 cursor-move mr-2">
                        <ArrowsUpDownIcon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Container {index + 1}
                      </span>
                    </div>
                    <button
                      onClick={() => removeContainer(container.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove container"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
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

      {/* Email-wide settings */}
      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Email Settings</h3>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Width
          </label>
          <input
            type="text"
            value={component.props.emailWidth || '600px'}
            onChange={(e) => handlePropChange('emailWidth', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email Background Color
          </label>
          <input
            type="color"
            value={component.props.emailBackgroundColor || '#f4f4f4'}
            onChange={(e) => handlePropChange('emailBackgroundColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Content Background Color
          </label>
          <input
            type="color"
            value={component.props.backgroundColor || '#ffffff'}
            onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Font Family
          </label>
          <select
            value={component.props.fontFamily || 'Arial, sans-serif'}
            onChange={(e) => handlePropChange('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="Tahoma, sans-serif">Tahoma</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Default Font Size
          </label>
          <input
            type="text"
            value={component.props.fontSize || '14px'}
            onChange={(e) => handlePropChange('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="14px"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Line Height
          </label>
          <input
            type="text"
            value={component.props.lineHeight || '1.5'}
            onChange={(e) => handlePropChange('lineHeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1.5"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Default Text Color
          </label>
          <input
            type="color"
            value={component.props.textColor || '#333333'}
            onChange={(e) => handlePropChange('textColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Link Color
          </label>
          <input
            type="color"
            value={component.props.linkColor || '#007bff'}
            onChange={(e) => handlePropChange('linkColor', e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Email Alignment
          </label>
          <select
            value={component.props.align || 'center'}
            onChange={(e) => handlePropChange('align', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StructureProperties;
