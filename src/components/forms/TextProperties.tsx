import type { TextComponent } from "../../store";
import { useStore } from "../../store";

interface TextPropertiesProps {
  component: TextComponent;
}

export function TextProperties({ component }: TextPropertiesProps) {
  const updateComponent = useStore((state) => state.updateComponent);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    updateComponent(component.id, { [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Text Content
        </label>
        <textarea
          name="text"
          className="mt-1 block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={component.text}
          rows={5}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Align
        </label>
        <select
          name="align"
          className="mt-1 block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={component.align}
          onChange={handleChange}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Padding
        </label>
        <div className="grid grid-cols-2 gap-x-2 gap-y-3 mt-1">
          <div>
            <span className="text-xs text-gray-500">Top</span>
            <input
              type="text"
              name="paddingTop"
              className="block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              value={component.paddingTop}
              onChange={handleChange}
            />
          </div>
          <div>
            <span className="text-xs text-gray-500">Right</span>
            <input
              type="text"
              name="paddingRight"
              className="block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              value={component.paddingRight}
              onChange={handleChange}
            />
          </div>
          <div>
            <span className="text-xs text-gray-500">Bottom</span>
            <input
              type="text"
              name="paddingBottom"
              className="block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              value={component.paddingBottom}
              onChange={handleChange}
            />
          </div>
          <div>
            <span className="text-xs text-gray-500">Left</span>
            <input
              type="text"
              name="paddingLeft"
              className="block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              value={component.paddingLeft}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Text Color
        </label>
        <input
          type="color"
          name="color"
          className="mt-1 block w-full h-10 rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={component.color}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
