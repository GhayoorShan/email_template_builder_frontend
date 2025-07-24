import {
  BeakerIcon,
  ArrowDownTrayIcon,
  PhotoIcon,
  CursorArrowRaysIcon,
} from "@heroicons/react/24/outline";
import { Draggable } from "./Draggable";
import { useStore } from "../store";
import { generateMjml } from "../utils/mjmlGenerator";
import { compileMjml } from "../api";

export const availableComponents = [
  { id: "Text", icon: <BeakerIcon className="h-6 w-6 mr-2" /> },
  { id: "Button", icon: <CursorArrowRaysIcon className="h-6 w-6 mr-2" /> },
  { id: "Image", icon: <PhotoIcon className="h-6 w-6 mr-2" /> },
];

export function ComponentPanel() {
  const components = useStore((state) => state.components);

  const handleExportMjml = () => {
    const mjml = generateMjml(components);
    console.log(mjml);
    // In a real app, you might download this as a file or send to an API
  };

  const handleDownloadHtml = async () => {
    // 1. Get the latest state and generate MJML
    const currentComponents = useStore.getState().components;
    if (currentComponents.length === 0) {
      alert("Please add components to the canvas before downloading.");
      return;
    }
    const mjml = generateMjml(currentComponents);

    // 2. POST to the compile endpoint using the new API function
    try {
      const { html } = await compileMjml(mjml);

      // 3. Create a blob and trigger download
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "template.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Could not download HTML. See console for details.");
    }
  };

  return (
    <>
      <div className="space-y-2">
        {availableComponents.map((comp) => (
          <Draggable key={comp.id} id={comp.id}>
            <div className="flex items-center p-2 bg-white border border-slate-300 rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:bg-slate-100 transition-colors">
              {comp.icon}
              <span className="font-medium">{comp.id}</span>
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
    </>
  );
}
