import React from 'react';
import type { TextComponent } from '../../store';

interface TextProps {
  component: TextComponent;
}

export const Text: React.FC<TextProps> = ({ component }) => {
  const { text, align, paddingTop, paddingRight, paddingBottom, paddingLeft, color } = component;

  const style: React.CSSProperties = {
    textAlign: align as any,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    color,
  };

  return (
    <div style={style}>
      {text}
    </div>
  );
};
