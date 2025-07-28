import React, { useState } from "react";
import { useStore } from "../../../../store";
import type { ContainerComponent } from "../../../../types";

interface ContainerPropertiesProps {
  component: ContainerComponent;
}

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

export const ContainerProperties: React.FC<ContainerPropertiesProps> = ({
  component,
}) => {
  const [activeTab, setActiveTab] = useState("Settings");
  const updateComponent = useStore((state) => state.updateComponent);

  const updateProps = (key: string, value: any) => {
    updateComponent(component.id, {
      props: { ...component.props, [key]: value },
    });
  };

  return (
    <div className="space-y-6 p-4">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Settings" && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">
            Container Settings
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">
                Container Width
              </label>
              <input
                type="text"
                value={component.props.width || "100%"}
                onChange={(e) => updateProps("width", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-600">
                Text Alignment
              </label>
              <select
                value={component.props.textAlign || "left"}
                onChange={(e) => updateProps("textAlign", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Direction</label>
              <select
                value={component.props.direction || "ltr"}
                onChange={(e) => updateProps("direction", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="ltr">Left to Right</option>
                <option value="rtl">Right to Left</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Padding</label>
              <div className="grid grid-cols-2 gap-2">
                <StepperInput
                  label="Top"
                  value={component.props.paddingTop || "0px"}
                  onChange={(value) => updateProps("paddingTop", value)}
                />
                <StepperInput
                  label="Right"
                  value={component.props.paddingRight || "0px"}
                  onChange={(value) => updateProps("paddingRight", value)}
                />
                <StepperInput
                  label="Bottom"
                  value={component.props.paddingBottom || "0px"}
                  onChange={(value) => updateProps("paddingBottom", value)}
                />
                <StepperInput
                  label="Left"
                  value={component.props.paddingLeft || "0px"}
                  onChange={(value) => updateProps("paddingLeft", value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Styles" && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Style Settings</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-600">
                Background Color
              </label>
              <input
                type="color"
                value={component.props.backgroundColor || "#ffffff"}
                onChange={(e) => updateProps("backgroundColor", e.target.value)}
                className="w-full h-8 rounded border"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-600">
                Border Width
              </label>
              <StepperInput
                label="Width"
                value={component.props.borderWidth || "0px"}
                onChange={(value) => updateProps("borderWidth", value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-600">
                Border Color
              </label>
              <input
                type="color"
                value={component.props.borderColor || "#000000"}
                onChange={(e) => updateProps("borderColor", e.target.value)}
                className="w-full h-8 rounded border"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-600">
                Border Radius
              </label>
              <StepperInput
                label="Radius"
                value={component.props.borderRadius || "0px"}
                onChange={(value) => updateProps("borderRadius", value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-600">Full Width</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={component.props.fullWidth || false}
                  onChange={(e) => updateProps("fullWidth", e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Extend container to full width
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContainerProperties;
