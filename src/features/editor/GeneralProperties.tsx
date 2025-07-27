// src/components/GeneralProperties.tsx

import React from "react";
import { useStore } from "../../store";

const GeneralProperties = () => {
  // Access individual properties instead of the whole object
  const backgroundColor = useStore(
    (state) => state.globalStyles.backgroundColor
  );
  const contentWidth = useStore((state) => state.globalStyles.contentWidth);
  const updateGlobalStyles = useStore((state) => state.updateGlobalStyles);

  const handleBackgroundColorChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateGlobalStyles({ backgroundColor: e.target.value });
  };

  const handleContentWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value, 10);
    if (!isNaN(width) && width > 0) {
      updateGlobalStyles({ contentWidth: width });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-900">General Settings</h3>

      <div>
        <label
          htmlFor="backgroundColor"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Background Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            id="backgroundColor"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            className="h-10 w-20 border border-slate-300 rounded-md cursor-pointer"
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={handleBackgroundColorChange}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contentWidth"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Content Width (px)
        </label>
        <input
          type="number"
          id="contentWidth"
          value={contentWidth}
          onChange={handleContentWidthChange}
          min="320"
          max="1200"
          step="10"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="mt-1 text-xs text-slate-500">
          Recommended: 600px for most email clients
        </p>
      </div>
    </div>
  );
};

export { GeneralProperties };
