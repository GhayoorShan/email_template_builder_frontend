import React from 'react';
import type { TextComponent } from '../../../types';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div className="text-red-500 text-sm p-2 bg-red-50">Error rendering text</div>;
    }
    return this.props.children;
  }
}

export const Text: React.FC<{ component: TextComponent; children?: React.ReactNode }> = ({ component, children }) => {
  try {
    // Safely destructure with defaults
    const { 
      text = '', 
      align = 'left', 
      paddingTop = '0', 
      paddingRight = '0', 
      paddingBottom = '0', 
      paddingLeft = '0', 
      color = '#000000' 
    } = component.props || {};

    const style: React.CSSProperties = {
      textAlign: align as any,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      color,
      minHeight: '1em', // Ensure it's always clickable
    };

    return (
      <div style={style}>
        {text}
        {children}
      </div>
    );
  } catch (error) {
    console.error('Error rendering Text component:', error);
    return (
      <div className="text-red-500 text-sm p-2 bg-red-50">
        Error rendering text
      </div>
    );
  }
};

// Wrap with error boundary
export default (props: { component: TextComponent; children?: React.ReactNode }) => (
  <ErrorBoundary>
    <Text {...props} />
  </ErrorBoundary>
);
