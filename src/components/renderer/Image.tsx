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
      {src ? (
        <img src={src} alt={src} style={{ maxWidth: '100%' }} />
      ) : (
        <div style={{ width: '100%', height: 80, background: '#e0e0e0', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontStyle: 'italic', border: '1px dashed #bbb' }}>
          No image selected
        </div>
      )}
    </div>
  );
};
