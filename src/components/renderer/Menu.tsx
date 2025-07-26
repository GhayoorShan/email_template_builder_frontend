import React from "react";
import type { MenuComponent } from "../../store";

export const Menu: React.FC<{ component: MenuComponent }> = ({ component }) => {
  return (
    <nav className="flex gap-4 justify-{component.alignment}">
      {component.items?.map((item, idx) => (
        <a
          key={idx}
          href={item.url}
          className="text-blue-600 hover:text-blue-800 transition"
          style={{ padding: component.itemPadding || '0 8px', color: component.textColor || '#333' }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
};
