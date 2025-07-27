import React from 'react';
import type { MenuComponent } from '../../../types';

export const Menu: React.FC<{ component: MenuComponent }> = ({ component }) => {
  // Ensure we have valid values with defaults
  const { alignment = 'left', itemSpacing = '16px', itemPadding = '0 8px', textColor = '#333', hoverTextColor = '#1d4ed8', items } = component.props;

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
      {items?.map((item: { text: string; url: string }, idx: number) => (
        <a
          key={idx}
          href={item.url}
          style={{
            ...menuItemStyle,
            marginRight: idx < items.length - 1 ? itemSpacing : '0',
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
