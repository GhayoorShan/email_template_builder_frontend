import React from 'react';
import type { ColumnComponent } from '../../../types';

interface ColumnProps {
  component: ColumnComponent;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export const Column: React.FC<ColumnProps> = ({
  component,
  children,
  className = '',
  style = {},
  onClick,
  ...props
}) => {
  const { backgroundColor, padding, borderWidth, borderColor, borderRadius, width } = component.props;

  const columnStyle: React.CSSProperties = {
    backgroundColor,
    padding,
    borderWidth,
    borderColor,
    borderRadius,
    width,
    ...style,
  };

  return (
    <div 
      id={component.id}
      className={`column ${className}`}
      style={columnStyle}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Column;