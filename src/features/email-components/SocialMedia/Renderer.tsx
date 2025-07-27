import React from "react";
import type { SocialMediaComponent } from "../../../types";

export const SocialMedia: React.FC<{ component: SocialMediaComponent }> = ({ component }) => {
  // Ensure we have valid values with defaults
  const { alignment, iconSize, iconSpacing, icons } = component.props;
  const alignmentValue = alignment || 'left';
  const iconSizeValue = iconSize || '24px';
  const iconSpacingValue = iconSpacing || '8px';

  // Generate dynamic class for alignment
  const alignmentClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[alignmentValue] || 'justify-start';

  return (
    <div className={`flex gap-2 ${alignmentClass}`}>
      {icons.map((icon: { platform: string; url: string; altText: string }, idx: number) => (
        <a 
          key={idx} 
          href={icon.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            marginRight: idx < icons.length - 1 ? iconSpacingValue : '0',
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
