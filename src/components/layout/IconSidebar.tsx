import React from "react";
import { Settings, LayoutDashboard } from "lucide-react";
import { Tooltip } from "../ui/Tooltip";
import { Draggable } from "../ui/Draggable";
import { componentRegistry } from "../../config/componentRegistry";

interface IconSidebarProps {
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export const IconSidebar: React.FC<IconSidebarProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const handleButtonClick = (category: string) => {
    if (activeCategory === category) {
      onCategoryChange(null);
    } else {
      onCategoryChange(category);
    }
  };

  // Layout section is special - it only opens the flyout panel
  const layoutSection = {
    id: "layouts",
    name: "Layouts",
    icon: LayoutDashboard,
    description: "Add layout elements like columns and sections",
  };

  // Filter out layout components from the registry
  const draggableComponents = Object.entries(componentRegistry).filter(
    ([_, config]) => !["Structure", "Container", "Column"].includes(config.type)
  );

  return (
    <aside className="h-full bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 w-20 shadow-lg">
      {/* Logo */}
      <div className="w-12 h-12 mb-8 flex items-center justify-center">
        <img src="/vite.svg" alt="Logo" className="w-10 h-10" />
      </div>

      {/* Grouped Icons */}
      <div className="flex flex-col gap-3 flex-1 items-center w-full">
        {/* Layout section - clickable only */}
        <Tooltip
          title={layoutSection.name}
          description={layoutSection.description}
        >
          <button
            onClick={() => handleButtonClick("layouts")}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out ${
              activeCategory === "layouts"
                ? "bg-blue-600 text-white ring-2 ring-blue-400"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <layoutSection.icon size={24} />
          </button>
        </Tooltip>

        {/* Draggable component icons */}
        <div className="flex flex-col gap-3">
          {draggableComponents.map(([id, config]) => {
            if (!config.icon) return null;
            const Icon = config.icon;

            return (
              <Tooltip
                key={id}
                title={config.type}
                description={`Add a ${config.type} component`}
              >
                <div className="w-12 h-12">
                  <Draggable id={config.type}>
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-grab active:cursor-grabbing">
                      <Icon size={24} />
                    </div>
                  </Draggable>
                </div>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Settings at the bottom */}
      <button
        className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 mt-auto"
        title="Settings"
      >
        <Settings size={24} />
      </button>
    </aside>
  );
};
