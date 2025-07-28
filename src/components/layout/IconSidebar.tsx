import React from "react";
import { LayoutDashboard, Settings, User } from "lucide-react";
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

  const structureComponent = {
    id: "structure",
    name: "Structure",
    icon: LayoutDashboard,
    description: "Add layout elements like columns and sections.",
  };

  return (
    <aside className="h-full bg-slate-900 border-r border-slate-800 flex flex-col items-center py-4 w-20 shadow-lg">
      {/* Logo */}
      <div className="w-12 h-12 mb-8 flex items-center justify-center">
        <img src="/vite.svg" alt="Logo" className="w-10 h-10" />
      </div>
      {/* Grouped Icons */}
      <div className="flex flex-col gap-3 flex-1 items-center w-full">
        {/* Structure */}
        <Tooltip
          key={structureComponent.id}
          title={structureComponent.name}
          description={structureComponent.description}
        >
          <button
            onClick={() => handleButtonClick(structureComponent.id)}
            className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 relative ${
              activeCategory === structureComponent.id
                ? "bg-blue-600 text-white ring-2 ring-blue-400"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <structureComponent.icon size={28} />
          </button>
        </Tooltip>
        {/* Content/Other Components */}
        <div className="flex flex-col gap-2 w-full items-center">
          {Object.values(componentRegistry).map((comp) => {
            if (!comp.icon || !comp.type) return null;
            const Icon = comp.icon;
            return (
              <Tooltip
                key={comp.type}
                title={comp.type}
                description={`Add a ${comp.type} component.`}
              >
                <div className="w-12 h-12">
                  <Draggable id={comp.type}>
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
      {/* Settings/Profile at the bottom */}
      <div className="flex flex-col items-center gap-3 mt-8 mb-2">
        <button
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          title="Global Styles"
        >
          <Settings size={24} />
        </button>
        <button
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          title="Profile"
        >
          <User size={24} />
        </button>
      </div>
    </aside>
  );
};
