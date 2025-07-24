import { useStore } from "../../store";

export function GeneralProperties() {
  const { globalStyles, updateGlobalStyles } = useStore((state) => ({
    globalStyles: state.globalStyles,
    updateGlobalStyles: state.updateGlobalStyles,
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const isNumber = e.target.type === 'number';
    updateGlobalStyles({ [name]: isNumber ? parseInt(value, 10) : value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Background Color
        </label>
        <input
          type="color"
          name="backgroundColor"
          className="mt-1 block w-full h-10 rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={globalStyles.backgroundColor}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Content Width (px)
        </label>
        <input
          type="number"
          name="contentWidth"
          className="mt-1 block w-full rounded-md bg-slate-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          value={globalStyles.contentWidth}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
