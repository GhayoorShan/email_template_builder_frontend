import React from 'react';
import type { MenuComponent } from "../../store";

export const Menu: React.FC<{ component: MenuComponent }> = ({ component }) => {
  // Ensure we have valid values with defaults
  const alignment = component.alignment || 'left';
  const itemSpacing = component.itemSpacing || '16px';
  const itemPadding = component.itemPadding || '0 8px';
  const textColor = component.textColor || '#333';
  const hoverTextColor = component.hoverTextColor || '#1d4ed8';

  // Generate dynamic class for alignment
  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[alignment] || 'justify-start';

  // Create a style object for the menu items
  const menuItemStyle: React.CSSProperties = {
    padding: itemPadding,
    color: textColor,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    transition: 'color 0.2s ease-in-out',
  };

  return (
    <nav className={`flex ${alignmentClass}`}>
      {component.items?.map((item, idx) => (
        <a
          key={idx}
          href={item.url}
          style={{
            ...menuItemStyle,
            marginRight: idx < component.items.length - 1 ? itemSpacing : '0',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = hoverTextColor;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = textColor;
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
};
