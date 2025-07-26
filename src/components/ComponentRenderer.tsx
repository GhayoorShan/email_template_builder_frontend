import React, { useMemo } from 'react';
import { useSortable, SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { useStore } from '../store';
import type { CanvasComponent, StructureComponent, ColumnComponent, SectionComponent, OneColumnComponent, TwoColumnComponent } from '../store';

// Import your actual components
import { Text, Button, Image, Divider, Heading, SocialMedia, Menu } from './renderer';

const StructureContainer: React.FC<{ component: StructureComponent }> = ({ component }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
    data: {
      isContainer: true,
      accepts: ['Column', 'Section', 'OneColumn', 'TwoColumn', 'Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });

  return (
    <div 
      ref={setNodeRef}
      className={`p-2 bg-gray-100 border border-dashed border-gray-400 rounded-lg min-h-[100px] ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="text-xs font-medium text-gray-500 mb-1">Structure</div>
      <SortableContext items={component.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {component.children.map(child => (
          <ComponentRenderer key={child.id} component={child} />
        ))}
        {component.children.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-gray-500 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
            <p className="font-semibold">Drop Components Here</p>
            <p className="text-sm">Drag blocks from the panel</p>
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const SectionContainer: React.FC<{ component: SectionComponent }> = ({ component }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
    data: {
      isContainer: true,
      accepts: ['Column', 'OneColumn', 'TwoColumn', 'Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });
  const style = {
    backgroundColor: component.backgroundColor || '#f9fafb',
    padding: component.padding || '16px',
    border: component.borderWidth ? `${component.borderWidth} solid ${component.borderColor || '#e5e7eb'}` : '1px solid #e5e7eb',
    borderRadius: component.borderRadius || '8px',
  };

  return (
    <div ref={setNodeRef} style={style} className={`mb-4 ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
      <div className="text-xs font-medium text-gray-500 mb-2">Section</div>
      <SortableContext items={component.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {component.children.map(child => (
          <ComponentRenderer key={child.id} component={child} />
        ))}
        {component.children.length === 0 && (
          <div className="flex flex-col items-center justify-center h-24 text-gray-500 bg-white/50 rounded">
            <p className="font-semibold">Drop Content Here</p>
            <p className="text-sm">Drag blocks or columns into this section</p>
          </div>
        )}
      </SortableContext>
    </div>
  );
};

const OneColumnContainer: React.FC<{ component: OneColumnComponent }> = ({ component }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${component.id}`,
    data: {
      isContainer: true,
      accepts: ['Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });
  
  return (
    <div ref={setNodeRef} className={`bg-white p-4 rounded-lg border border-gray-200 ${isOver ? 'ring-2 ring-blue-400' : ''}`}>
      <div className="text-xs font-medium text-gray-500 mb-2">1-Column Layout</div>
      <div className="grid grid-cols-1 gap-4">
        <SortableContext items={component.children.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {component.children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
          {component.children.length === 0 && (
            <div className="flex flex-col items-center justify-center h-24 text-gray-500 bg-gray-50 rounded border-2 border-dashed border-gray-300">
              <p className="font-semibold">Drop Content Here</p>
              <p className="text-sm">This is a single column layout</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};

const TwoColumnContainer: React.FC<{ component: TwoColumnComponent }> = ({ component }) => {
  const { setNodeRef: setLeftRef, isOver: isLeftOver } = useDroppable({
    id: `droppable-${component.id}-left`,
    data: {
      isContainer: true,
      accepts: ['Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });
  const { setNodeRef: setRightRef, isOver: isRightOver } = useDroppable({
    id: `droppable-${component.id}-right`,
    data: {
      isContainer: true,
      accepts: ['Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.parentId,
    },
  });
  
  // Split children into left and right columns
  const leftChildren = component.children.filter((_, index) => index % 2 === 0);
  const rightChildren = component.children.filter((_, index) => index % 2 !== 0);
  
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="text-xs font-medium text-gray-500 mb-2">2-Column Layout</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          ref={setLeftRef} 
          className={`p-3 min-h-[100px] rounded ${isLeftOver ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-gray-50'}`}
        >
          <div className="text-xs text-gray-400 mb-2">Left Column</div>
          <SortableContext items={leftChildren.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {leftChildren.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            ))}
            {leftChildren.length === 0 && (
              <div className="flex flex-col items-center justify-center h-20 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded p-2">
                <p>Left Column</p>
              </div>
            )}
          </SortableContext>
        </div>
        
        <div 
          ref={setRightRef} 
          className={`p-3 min-h-[100px] rounded ${isRightOver ? 'bg-blue-50 ring-2 ring-blue-400' : 'bg-gray-50'}`}
        >
          <div className="text-xs text-gray-400 mb-2">Right Column</div>
          <SortableContext items={rightChildren.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {rightChildren.map(child => (
              <ComponentRenderer key={child.id} component={child} />
            ))}
            {rightChildren.length === 0 && (
              <div className="flex flex-col items-center justify-center h-20 text-gray-400 text-sm border-2 border-dashed border-gray-300 rounded p-2">
                <p>Right Column</p>
              </div>
            )}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

const ColumnContainer: React.FC<{ component: ColumnComponent }> = ({ component }) => {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `droppable-${component.id}`,
    data: {
      isContainer: true,
      accepts: ['Text', 'Button', 'Image', 'Divider', 'Heading'],
      parentId: component.id, // This ensures the component is added as a child of this column
    },
  });
  
  // Check if the currently dragged item is over this container
  const isActive = isOver && active?.data.current?.type;
  const canDrop = active?.data.current?.type && 
    ['Text', 'Button', 'Image', 'Divider', 'Heading'].includes(active.data.current.type);

  return (
    <div 
      ref={setNodeRef}
      className={`p-3 min-h-[80px] bg-white rounded-lg border transition-colors ${
        isOver && canDrop ? 'bg-blue-50 ring-2 ring-blue-400 border-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="text-xs text-gray-500 mb-2">Column</div>
      <SortableContext 
        items={component.children.map(c => c.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {component.children.map(child => (
            <ComponentRenderer key={child.id} component={child} />
          ))}
          {component.children.length === 0 && (
            <div className="flex flex-col items-center justify-center h-16 text-gray-400 text-sm bg-gray-50 rounded border-2 border-dashed border-gray-300">
              {isActive && canDrop ? 'Drop here' : 'Drop content here'}
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const componentMap: { [key in CanvasComponent['type']]?: React.ComponentType<any> } = {
  Text,
  Button,
  Image,
  Divider,
  Heading,
  SocialMedia,
  Menu,
  Structure: StructureContainer,
  Section: SectionContainer,
  OneColumn: OneColumnContainer,
  TwoColumn: TwoColumnContainer,
  Column: ColumnContainer,
};

export const ComponentRenderer: React.FC<{ component: CanvasComponent }> = ({ component }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: component.id,
    data: {
      type: component.type,
      component: component,
      parentId: component.parentId,
    },
  });
  
  const setActiveId = useStore(state => state.setActiveId);
  const moveComponent = useStore(state => state.moveComponent);
  const removeComponent = useStore(state => state.removeComponent);
  const duplicateComponent = useStore(state => state.duplicateComponent);
  const activeId = useStore(state => state.activeId);
  const components = useStore(state => state.components);

  // Move up/down helpers
  function moveUp() {
    const parentId = component.parentId || null;
    const parent = parentId ? findParent(components, parentId) : { children: components };
    if (!parent || !Array.isArray(parent.children)) return;
    const idx = parent.children.findIndex((c: any) => c.id === component.id);
    if (idx > 0) {
      moveComponent(component.id, parentId, idx - 1);
    }
  }
  function moveDown() {
    const parentId = component.parentId || null;
    const parent = parentId ? findParent(components, parentId) : { children: components };
    if (!parent || !Array.isArray(parent.children)) return;
    const idx = parent.children.findIndex((c: any) => c.id === component.id);
    if (idx < parent.children.length - 1) {
      moveComponent(component.id, parentId, idx + 1);
    }
  }
  function findParent(tree: any[], id: string): any | null {
    for (const node of tree) {
      if (node.id === id) return node;
      if (Array.isArray(node.children)) {
        const found = findParent(node.children, id);
        if (found) return found;
      }
    }
    return null;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 'auto',
  };

  const RenderedComponent = componentMap[component.type];

  if (!RenderedComponent) {
    return <div className="p-4 bg-red-100 text-red-800 border border-red-200 rounded">Unknown component type: {component.type}</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${activeId === component.id ? 'ring-2 ring-indigo-500' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        setActiveId(component.id);
      }}
    >
      {/* Drag handle for dnd-kit */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 w-3 h-3 bg-indigo-400 rounded-full cursor-grab opacity-70 hover:opacity-100 z-20 drag-handle"
        title="Drag to move"
        onClick={e => e.stopPropagation()} // Prevent drag handle click from selecting
      />
      {/* Floating Toolbar for selected component */}
      {activeId === component.id && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 bg-white/90 rounded shadow p-1 border border-slate-200 animate-fade-in">
          <button
            onClick={e => { e.stopPropagation(); duplicateComponent(component.id); }}
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            title="Duplicate"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8a2 2 0 002-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" /></svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); removeComponent(component.id); }}
            className="p-1 hover:bg-slate-100 rounded text-red-500"
            title="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); moveUp(); }}
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            title="Move Up"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); moveDown(); }}
            className="p-1 hover:bg-slate-100 rounded text-slate-600"
            title="Move Down"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      )}
      <div className="relative">
        <RenderedComponent component={component} />
      </div>
    </div>
  );
};
