import React from "react";
import type { SocialMediaComponent } from "../../store";

export const SocialMedia: React.FC<{ component: SocialMediaComponent }> = ({ component }) => {
  return (
    <div className="flex gap-2 justify-{component.alignment}">
      {component.icons?.map((icon, idx) => (
        <a key={idx} href={icon.url} target="_blank" rel="noopener noreferrer">
          <img
            src={`/${icon.platform}.svg`}
            alt={icon.altText || icon.platform}
            style={{ width: component.iconSize || '24px', marginRight: component.iconSpacing || '8px' }}
          />
        </a>
      ))}
    </div>
  );
};
