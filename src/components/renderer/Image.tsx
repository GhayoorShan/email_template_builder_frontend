import React from 'react';
import type { ImageComponent } from '../../store';

interface ImageProps {
  component: ImageComponent;
}

export const Image: React.FC<ImageProps> = ({ component }) => {
  const { src, align } = component;

  const style: React.CSSProperties = {
    textAlign: align as any,
  };

  return (
    <div style={style}>
      <img src={src} alt="" style={{ maxWidth: '100%' }} />
    </div>
  );
};
