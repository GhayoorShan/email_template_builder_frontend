import React from "react";
import type { SocialMediaComponent } from "../../store";

export const SocialMedia: React.FC<{ component: SocialMediaComponent }> = ({ component }) => {
  // Ensure we have valid values with defaults
  const alignment = component.alignment || 'left';
  const iconSize = component.iconSize || '24px';
  const iconSpacing = component.iconSpacing || '8px';

  // Generate dynamic class for alignment
  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[alignment] || 'justify-start';

  return (
    <div className={`flex gap-2 ${alignmentClass}`}>
      {component.icons?.map((icon, idx) => (
        <a 
          key={idx} 
          href={icon.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            marginRight: idx < component.icons.length - 1 ? iconSpacing : '0',
            display: 'inline-flex',
            alignItems: 'center'
          }}
        >
          <img
            src={`/${icon.platform}.svg`}
            alt={icon.altText || icon.platform}
            style={{ 
              width: iconSize,
              height: iconSize,
              display: 'block'
            }}
          />
        </a>
      ))}
    </div>
  );
};
