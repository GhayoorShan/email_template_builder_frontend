import React, { type JSX } from 'react';
import { useStore } from '../../store';
import type { HeadingComponent } from '../../store';

interface HeadingProps {
  component: HeadingComponent;
}

export const Heading: React.FC<HeadingProps> = ({ component }) => {
  const { text, level = 2, align = 'left', color = '#000000', padding = '0' } = component;
  const setActiveId = useStore(state => state.setActiveId);
  
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <div 
      className="w-full"
      style={{ padding }}
      onClick={(e) => {
        e.stopPropagation();
        setActiveId(component.id);
      }}
    >
      <HeadingTag 
        className="m-0 p-0"
        style={{
          textAlign: align as any,
          color,
          margin: 0,
          padding: 0,
          lineHeight: 1.2,
        }}
      >
        {text}
      </HeadingTag>
    </div>
  );
};

export default Heading;
