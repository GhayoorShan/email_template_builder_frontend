import type { HeadingComponent } from "../../../types";
import { useStore } from "../../../store";
import React from "react";

interface HeadingPropertiesProps {
  component: HeadingComponent;
  onUpdate?: (updates: Partial<HeadingComponent>) => void;
}

export const HeadingProperties: React.FC<HeadingPropertiesProps> = ({ component, onUpdate }) => {
  const updateComponent = useStore((state) => state.updateComponent);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newProps = { ...component.props, [name]: value };

    if (onUpdate) {
      onUpdate({ props: newProps });
    } else {
      updateComponent(component.id, { props: newProps });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Heading Text
        </label>
        <input
          type="text"
          name="text"
          className="mt-1 block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={component.props.text}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Heading Level
        </label>
        <select
          name="level"
          className="mt-1 block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={component.props.level}
          onChange={e => handleChange({
            ...e,
            target: { ...e.target, name: 'level', value: Number(e.target.value) }
          } as any)}
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
          <option value={5}>H5</option>
          <option value={6}>H6</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Text Align
        </label>
        <select
          name="align"
          className="mt-1 block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={component.props.align || "left"}
          onChange={handleChange}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Color
        </label>
        <input
          type="color"
          name="color"
          className="mt-1 block w-16 h-10 rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={component.props.color ?? "#000000"}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
