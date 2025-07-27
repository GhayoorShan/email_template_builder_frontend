import React from 'react';

interface SectionRendererProps {
  children?: React.ReactNode;
}

export const Section: React.FC<SectionRendererProps> = ({ children }) => {
  return <div className="w-full">{children}</div>;
};
