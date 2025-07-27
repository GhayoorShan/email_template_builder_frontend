import React from 'react';

interface TooltipProps {
  title: string;
  description: string;
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ title, description, children }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="absolute left-full ml-4 w-64 bg-gray-800 text-white p-4 rounded-lg shadow-lg z-30">
          <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 bg-gray-800 transform rotate-45"></div>
          <h4 className="font-bold text-base mb-1">{title}</h4>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      )}
    </div>
  );
};
