import React from 'react';
import { X, Monitor, Smartphone, Tablet } from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  compiledHtml: string;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, compiledHtml }) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">Email Preview</h2>
            
            {/* View Mode Buttons */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'desktop' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop View"
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'tablet' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tablet View"
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'mobile' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobile View"
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="Close Preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-gray-50 p-4">
          <div className="h-full flex items-center justify-center">
            <div 
              className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
              style={{ 
                width: getPreviewWidth(),
                maxWidth: '100%',
                height: '100%'
              }}
            >
              <iframe
                title="Email Preview"
                className="w-full h-full border-0"
                srcDoc={compiledHtml}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Preview Mode: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}</span>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Send Test Email
              </button>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Export HTML
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
