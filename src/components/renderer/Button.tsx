import React from 'react';
import type { ButtonComponent } from '../../store';

interface ButtonProps {
  component: ButtonComponent;
}

export const Button: React.FC<ButtonProps> = ({ component }) => {
  const { buttonText, url, align, paddingTop, paddingRight, paddingBottom, paddingLeft, backgroundColor, borderRadius, color } = component;

  const containerStyle: React.CSSProperties = {
    textAlign: align as any,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor,
    borderRadius,
    color,
    padding: '10px 20px',
    textDecoration: 'none',
    display: 'inline-block',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <a href={url} style={buttonStyle}>
        {buttonText}
      </a>
    </div>
  );
};
