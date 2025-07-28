import React from "react";
import type { CanvasComponent } from "../../../../types";
import { useStore } from "../../../../store";

interface StripePropertiesProps {
  component: CanvasComponent;
}

export const StripeProperties: React.FC<StripePropertiesProps> = ({
  component,
}) => {
  const updateComponent = useStore((state) => state.updateComponent);

  const handleChange = (key: string, value: string) => {
    updateComponent(component.id, {
      ...component,
      props: {
        ...component.props,
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Stripe Properties</h3>
        <p className="text-sm text-gray-500 mb-4">
          Configure the stripe settings for your email section.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Background Color
          </label>
          <input
            type="color"
            value={component.props.backgroundColor || "#ffffff"}
            onChange={(e) => handleChange("backgroundColor", e.target.value)}
            className="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Padding
          </label>
          <input
            type="text"
            value={component.props.padding || "0px"}
            onChange={(e) => handleChange("padding", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 10px 20px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stripe Type
          </label>
          <select
            value={component.props.stripeType || "content"}
            onChange={(e) => handleChange("stripeType", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="header">Header</option>
            <option value="content">Content</option>
            <option value="footer">Footer</option>
            <option value="info">Info Area</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StripeProperties;
