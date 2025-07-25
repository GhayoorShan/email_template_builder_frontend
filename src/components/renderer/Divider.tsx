import React from 'react';
import type { DividerComponent } from '../../store';

interface DividerProps {
  component: DividerComponent;
}

export const Divider: React.FC<DividerProps> = ({ component }) => {
  const { borderStyle, borderWidth, borderColor, width, padding } = component;

  const style: React.CSSProperties = {
    padding,
  };

  const lineStyle: React.CSSProperties = {
    borderTop: `${borderWidth} ${borderStyle} ${borderColor}`,
    width,
    margin: '0 auto',
  };

  return (
    <div style={style}>
      <div style={lineStyle}></div>
    </div>
  );
};
