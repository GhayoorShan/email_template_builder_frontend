import type { ImageComponent } from "../../store";
import { useStore } from "../../store";

interface ImagePropertiesProps {
  component: ImageComponent;
}

export function ImageProperties({ component }: ImagePropertiesProps) {
  const updateComponent = useStore((state) => state.updateComponent);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateComponent(component.id, { [name]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Image URL
        </label>
        <input
          type="text"
          name="src"
          className="mt-1 block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={component.src}
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
    </div>
  );
}
