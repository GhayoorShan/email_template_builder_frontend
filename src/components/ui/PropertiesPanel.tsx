import React from 'react';
import { Settings, FileText, Code } from 'lucide-react';
import { cn } from '../../lib/utils';
import { HelpCircle } from 'lucide-react';

// Tab Navigation Component
const TabNavigation = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: 'settings', icon: <Settings size={16} /> },
    { id: 'document', icon: <FileText size={16} /> },
    { id: 'code', icon: <Code size={16} /> },
  ];

  return (
    <div className="flex items-center justify-center p-1 bg-gray-100 rounded-full">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'p-2 rounded-full transition-colors',
            activeTab === tab.id ? 'bg-white shadow-sm' : 'text-gray-500 hover:bg-gray-200',
          )}
        >
          {tab.icon}
        </button>
      ))}
    </div>
  );
};

// Form Row Component
const FormRow = ({ label, children, helpText }: { label: string; children: React.ReactNode; helpText?: string }) => (
  <div className="py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <button className="ml-1 text-gray-400 hover:text-gray-500">
          <HelpCircle size={14} />
        </button>
      </div>
      {children}
    </div>
    {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
  </div>
);

// Color Input Component
const ColorInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div className="flex items-center">
    <div 
      className="w-5 h-5 rounded-full mr-2 border border-gray-300"
      style={{ backgroundColor: value }}
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

// Toggle Switch Component
const Toggle = ({ 
  checked, 
  onChange, 
  color = 'gray' 
}: { 
  checked: boolean; 
  onChange: (checked: boolean) => void;
  color?: 'gray' | 'green';
}) => (
  <button
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
      checked 
        ? color === 'green' ? 'bg-green-500' : 'bg-gray-200' 
        : 'bg-gray-200'
    }`}
    onClick={() => onChange(!checked)}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-0.5'
      }`}
    />
  </button>
);

// Stepper Component
const Stepper = ({ 
  value, 
  min = 0, 
  max = 1000, 
  onChange 
}: { 
  value: number; 
  min?: number; 
  max?: number; 
  onChange: (value: number) => void 
}) => (
  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
    <button
      onClick={() => onChange(Math.max(min, value - 1))}
      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
    >
      -
    </button>
    <span className="px-3 py-1 text-sm text-center min-w-[40px]">
      {value}
    </span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
    >
      +
    </button>
  </div>
);

// Segmented Control Component
const SegmentedControl = ({ 
  options, 
  value, 
  onChange 
}: { 
  options: { value: string; icon: React.ReactNode }[]; 
  value: string; 
  onChange: (value: string) => void 
}) => (
  <div className="flex border border-gray-300 rounded-md overflow-hidden">
    {options.map((option) => (
      <button
        key={option.value}
        type="button"
        onClick={() => onChange(option.value)}
        className={`p-2 flex-1 flex items-center justify-center ${
          value === option.value 
            ? 'bg-green-50 border-2 border-green-500 -m-0.5 z-10 rounded-md' 
            : 'hover:bg-gray-100'
        }`}
      >
        {option.icon}
      </button>
    ))}
  </div>
);

// Styled container for the properties panel
export function StyledPropertiesPanel({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = React.useState('document');
  
  return (
    <div className="fixed top-6 right-6 w-80 z-40">
      {/* Stacked card effect */}
      <div className="absolute -bottom-1 left-1 right-1 h-2 bg-gray-100 rounded-b-lg -z-10" />
      <div className="absolute -bottom-2 left-2 right-2 h-2 bg-gray-50 rounded-b-lg -z-20" />
      
      {/* Main panel */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header with tabs */}
        <div className="p-4 border-b border-gray-100">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Main Properties Panel with all the settings
export function PropertiesPanel() {
  const [activeTab, setActiveTab] = React.useState('document');
  const [settings, setSettings] = React.useState({
    backgroundColor: '#ffffff',
    backgroundImage: false,
    messageWidth: 600,
    messageAlignment: 'center',
    underlineLinks: true,
    responsiveDesign: true,
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="fixed top-6 right-6 w-80 z-40">
      {/* Stacked card effect */}
      <div className="absolute -bottom-1 left-1 right-1 h-2 bg-gray-100 rounded-b-lg -z-10" />
      <div className="absolute -bottom-2 left-2 right-2 h-2 bg-gray-50 rounded-b-lg -z-20" />
      
      {/* Main panel */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header with tabs */}
        <div className="p-4 border-b border-gray-100">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Content */}
        <div className="p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-700 text-center mb-4">
            General Settings
          </h3>
          
          <div className="space-y-1">
            <FormRow label="Background Color">
              <ColorInput 
                value={settings.backgroundColor} 
                onChange={(value) => handleChange('backgroundColor', value)} 
              />
            </FormRow>
            
            <FormRow label="Background Image">
              <Toggle 
                checked={settings.backgroundImage} 
                onChange={(value) => handleChange('backgroundImage', value)}
                color="gray"
              />
            </FormRow>
            
            <FormRow label="Message Content Width">
              <Stepper 
                value={settings.messageWidth}
                min={300}
                max={1200}
                onChange={(value) => handleChange('messageWidth', value)}
              />
            </FormRow>
            
            <FormRow label="Message Alignment">
              <SegmentedControl
                value={settings.messageAlignment}
                onChange={(value) => handleChange('messageAlignment', value)}
                options={[
                  { value: 'left', icon: <span className="text-sm">L</span> },
                  { value: 'center', icon: <span className="text-sm">C</span> },
                  { value: 'right', icon: <span className="text-sm">R</span> },
                ]}
              />
            </FormRow>
            
            <FormRow label="Underline Links">
              <Toggle 
                checked={settings.underlineLinks} 
                onChange={(value) => handleChange('underlineLinks', value)}
                color="green"
              />
            </FormRow>
            
            <FormRow 
              label="Responsive Design"
              helpText="Enable this option to make your email responsive on mobile devices."
            >
              <Toggle 
                checked={settings.responsiveDesign} 
                onChange={(value) => handleChange('responsiveDesign', value)}
                color="green"
              />
            </FormRow>
          </div>
        </div>
      </div>
    </div>
  );
}
