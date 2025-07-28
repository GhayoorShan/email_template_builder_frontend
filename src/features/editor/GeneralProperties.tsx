// src/components/GeneralProperties.tsx

import React, { useMemo } from "react";
import { useStore } from "../../store";
import { useShallow } from "zustand/react/shallow";

const GeneralProperties = () => {
  const { components, updateComponent } = useStore(
    useShallow((state) => ({
      components: state.components,
      updateComponent: state.updateComponent,
    }))
  );

  // Find and memoize the Structure component
  const structureComponent = useMemo(
    () => components.find((c) => c.type === "Structure"),
    [components]
  );

  if (!structureComponent) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">
          General Settings
        </h3>
        <p className="text-sm text-slate-600">
          No email structure found. Please add a structure component first.
        </p>
      </div>
    );
  }

  const handlePropChange = React.useCallback(
    (key: string, value: string) => {
      updateComponent(structureComponent.id, {
        props: { ...structureComponent.props, [key]: value },
      });
    },
    [updateComponent, structureComponent.id, structureComponent.props]
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">
        {" "}
        General Settings
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email Width
          </label>
          <input
            type="text"
            value={structureComponent.props.emailWidth || "600px"}
            onChange={(e) => handlePropChange("emailWidth", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="600px"
          />
          <p className="mt-1 text-xs text-slate-500">
            Recommended: 600px for most email clients
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email Background Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={structureComponent.props.emailBackgroundColor || "#f4f4f4"}
              onChange={(e) =>
                handlePropChange("emailBackgroundColor", e.target.value)
              }
              className="h-10 w-20 border border-slate-300 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={structureComponent.props.emailBackgroundColor || "#f4f4f4"}
              onChange={(e) =>
                handlePropChange("emailBackgroundColor", e.target.value)
              }
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Content Background Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={structureComponent.props.backgroundColor || "#ffffff"}
              onChange={(e) =>
                handlePropChange("backgroundColor", e.target.value)
              }
              className="h-10 w-20 border border-slate-300 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={structureComponent.props.backgroundColor || "#ffffff"}
              onChange={(e) =>
                handlePropChange("backgroundColor", e.target.value)
              }
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Font Family
          </label>
          <select
            value={structureComponent.props.fontFamily || "Arial, sans-serif"}
            onChange={(e) => handlePropChange("fontFamily", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Times New Roman, serif">Times New Roman</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="Tahoma, sans-serif">Tahoma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Default Font Size
          </label>
          <input
            type="text"
            value={structureComponent.props.fontSize || "14px"}
            onChange={(e) => handlePropChange("fontSize", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="14px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Line Height
          </label>
          <input
            type="text"
            value={structureComponent.props.lineHeight || "1.5"}
            onChange={(e) => handlePropChange("lineHeight", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Default Text Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={structureComponent.props.textColor || "#333333"}
              onChange={(e) => handlePropChange("textColor", e.target.value)}
              className="h-10 w-20 border border-slate-300 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={structureComponent.props.textColor || "#333333"}
              onChange={(e) => handlePropChange("textColor", e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Link Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={structureComponent.props.linkColor || "#007bff"}
              onChange={(e) => handlePropChange("linkColor", e.target.value)}
              className="h-10 w-20 border border-slate-300 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={structureComponent.props.linkColor || "#007bff"}
              onChange={(e) => handlePropChange("linkColor", e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email Alignment
          </label>
          <select
            value={structureComponent.props.align || "center"}
            onChange={(e) => handlePropChange("align", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

export { GeneralProperties };
