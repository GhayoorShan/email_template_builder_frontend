import React, { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { X } from "lucide-react";

interface LayoutPreset {
  id: string;
  name: string;
  description: string;
  columns: number;
  widths: string[];
  preview: JSX.Element;
}

const layoutPresets: LayoutPreset[] = [
  {
    id: "single-column",
    name: "1 Column",
    description: "Full width single column",
    columns: 1,
    widths: ["100%"],
    preview: (
      <div className="w-full h-12 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
    ),
  },
  {
    id: "two-columns-equal",
    name: "2 Columns",
    description: "Two equal width columns",
    columns: 2,
    widths: ["50%", "50%"],
    preview: (
      <div className="flex gap-2 w-full h-12">
        <div className="flex-1 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
        <div className="flex-1 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
      </div>
    ),
  },
  {
    id: "three-columns-equal",
    name: "3 Columns",
    description: "Three equal width columns",
    columns: 3,
    widths: ["33.33%", "33.33%", "33.33%"],
    preview: (
      <div className="flex gap-2 w-full h-12">
        <div className="flex-1 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
        <div className="flex-1 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
        <div className="flex-1 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
      </div>
    ),
  },
  {
    id: "two-columns-wide-narrow",
    name: "2 Columns (70/30)",
    description: "Two columns with wide/narrow split",
    columns: 2,
    widths: ["70%", "30%"],
    preview: (
      <div className="flex gap-2 w-full h-12">
        <div className="w-[70%] bg-gray-100 rounded border-2 border-dashed border-gray-300" />
        <div className="w-[30%] bg-gray-100 rounded border-2 border-dashed border-gray-300" />
      </div>
    ),
  },
  {
    id: "three-columns-wide-narrow",
    name: "3 Columns (50/25/25)",
    description: "Three columns with one wide column",
    columns: 3,
    widths: ["50%", "25%", "25%"],
    preview: (
      <div className="flex gap-2 w-full h-12">
        <div className="w-1/2 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
        <div className="w-1/4 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
        <div className="w-1/4 bg-gray-100 rounded border-2 border-dashed border-gray-300" />
      </div>
    ),
  },
];

const DraggablePreset: React.FC<{ preset: LayoutPreset }> = ({ preset }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: preset.id,
    data: {
      type: "Container",
      isNew: true,
      preset: {
        columns: preset.columns,
        widths: preset.widths,
      },
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing"
    >
      <div className="flex flex-col gap-3">
        <div className="mb-2">{preset.preview}</div>
        <div>
          <h3 className="font-medium text-sm text-gray-900">{preset.name}</h3>
          <p className="text-xs text-gray-500">{preset.description}</p>
        </div>
      </div>
    </div>
  );
};

const DraggableStripe: React.FC = () => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: "stripe-preset",
    data: {
      type: "Stripe",
      isNew: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-grab active:cursor-grabbing"
    >
      <div className="flex flex-col gap-3">
        <div className="mb-2">
          <div className="w-full h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
            <span className="text-gray-500 font-medium">Stripe</span>
          </div>
        </div>
        <div>
          <h3 className="font-medium text-sm text-gray-900">Stripe</h3>
          <p className="text-xs text-gray-500">Top-level email section</p>
        </div>
      </div>
    </div>
  );
};

interface FlyoutPanelProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const FlyoutPanel: React.FC<FlyoutPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-20 w-80 bg-white shadow-xl z-50 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Layout Presets</h2>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Email Sections</h3>
          <DraggableStripe />
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Layout Presets</h3>
          <div className="space-y-4">
            {layoutPresets.map((preset) => (
              <DraggablePreset key={preset.id} preset={preset} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
