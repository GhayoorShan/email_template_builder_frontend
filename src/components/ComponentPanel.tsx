// src/components/ComponentPanel.tsx

import React from "react";
import {
  ArrowDownTrayIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  RectangleGroupIcon,
  MinusIcon,
  ShareIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { Draggable } from "./Draggable";
import { useStore } from "../store";
import { generateMjml } from "../utils/mjmlGenerator";
import { compileMjml } from "../api";

export const availableComponents = [
  { id: "Section", name: "Section", icon: <RectangleGroupIcon className="h-5 w-5" /> },
  { id: "Text", name: "Text", icon: <DocumentTextIcon className="h-5 w-5" /> },
  { id: "Button", name: "Button", icon: <CursorArrowRaysIcon className="h-5 w-5" /> },
  { id: "Image", name: "Image", icon: <PhotoIcon className="h-5 w-5" /> },
  { id: "Divider", name: "Divider", icon: <MinusIcon className="h-5 w-5" /> },
  { id: "SocialMedia", name: "Social Media", icon: <ShareIcon className="h-5 w-5" /> },
  { id: "Menu", name: "Menu", icon: <Bars3Icon className="h-5 w-5" /> },
];

const ComponentPanel = () => {
  const components = useStore((state) => state.components);
  const globalStyles = useStore((state) => state.globalStyles);

  // Use the store methods directly
  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);
  const canUndo = useStore((state) => state.canUndo);
  const canRedo = useStore((state) => state.canRedo);

  const handleExportMjml = () => {
    const mjml = generateMjml(components, globalStyles);
    console.log(mjml);
  };

  const handleDownloadHtml = async () => {
    const mjml = generateMjml(components, globalStyles);
    try {
      const { html } = await compileMjml(mjml);
      const blob = new Blob([html], { type: "text/html" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "email-template.html";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to compile MJML:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Components</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-1 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Undo"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-1 rounded-md text-slate-600 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Redo"
          >
            <ArrowUturnRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {availableComponents.map((comp) => (
          <Draggable key={comp.id} id={comp.id}>
            <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:bg-slate-50 hover:border-blue-500 transition-all aspect-square">
              {React.cloneElement(comp.icon, {
                className: "h-7 w-7 text-slate-600 mb-2",
              })}
              <span className="font-medium text-sm text-slate-700">
                {comp.name}
              </span>
            </div>
          </Draggable>
        ))}
      </div>
      <hr className="my-4 border-slate-200" />
      <div className="space-y-2">
        <button
          onClick={handleExportMjml}
          className="w-full px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Export MJML to Console
        </button>
        <button
          onClick={handleDownloadHtml}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Download HTML
        </button>
      </div>
    </div>
  );
};

export { ComponentPanel };
