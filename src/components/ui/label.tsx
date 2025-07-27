import React, { type LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /**
   * The content of the label
   */
  children: React.ReactNode;
  /**
   * Additional class names to apply to the label
   */
  className?: string;
  /**
   * Whether the label is required
   */
  required?: boolean;
}

/**
 * A reusable Label component for form elements
 */
export const Label: React.FC<LabelProps> = ({
  children,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <label 
      className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default Label;
