import React from 'react';
import type { DividerComponent } from '../../../types';


interface DividerProps {
  component: DividerComponent;
}

export const Divider: React.FC<DividerProps> = ({ component }) => {
  const { borderStyle, borderWidth = '1px', borderColor = '#000000', width = '100%', padding } = component.props;

  const style: React.CSSProperties = {
    padding,
  };

  const lineStyle: React.CSSProperties = {
    borderTop: `${borderWidth} ${borderStyle || 'solid'} ${borderColor}`,
    width,
    margin: '0 auto',
  };

  return (
    <div style={style}>
      <div style={lineStyle}></div>
    </div>
  );
};
