import React from 'react';
import { Move } from 'lucide-react';

interface DropPlaceholderProps {
  text?: string;
  className?: string;
}

export const DropPlaceholder: React.FC<DropPlaceholderProps> = ({ text = 'Drop content here', className = '' }) => (
  <div
    className={`bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center min-h-[70px] text-blue-500 ${className}`}
    style={{ minHeight: 70 }}
  >
    <Move className="w-6 h-6 mb-1 text-blue-300" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);
