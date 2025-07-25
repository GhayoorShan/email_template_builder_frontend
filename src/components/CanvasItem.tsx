import { useStore } from "../store";
import type { 
  CanvasComponent, 
  TextComponent, 
  ButtonComponent, 
  ImageComponent,
  SectionComponent,
  DividerComponent,
  SocialMediaComponent,
  MenuComponent
} from "../store";
import { 
  FaceSmileIcon as FacebookIcon,
  ChatBubbleLeftRightIcon as TwitterIcon,
  PhotoIcon as InstagramIcon,
  LinkIcon as LinkedinIcon,
  VideoCameraIcon as YoutubeIcon,
  RectangleGroupIcon as PinterestIcon,
  MusicalNoteIcon 
} from '@heroicons/react/24/outline';
import React from 'react';

// Type guard functions for component types
const isTextComponent = (component: CanvasComponent): component is TextComponent => 
  component.type === 'Text';
const isButtonComponent = (component: CanvasComponent): component is ButtonComponent => 
  component.type === 'Button';
const isImageComponent = (component: CanvasComponent): component is ImageComponent => 
  component.type === 'Image';
const isSectionComponent = (component: CanvasComponent): component is SectionComponent => 
  component.type === 'Section';
const isDividerComponent = (component: CanvasComponent): component is DividerComponent => 
  component.type === 'Divider';
const isSocialMediaComponent = (component: CanvasComponent): component is SocialMediaComponent => 
  component.type === 'SocialMedia';
const isMenuComponent = (component: CanvasComponent): component is MenuComponent => 
  component.type === 'Menu';

interface CanvasItemProps {
  component: CanvasComponent;
  isDragging?: boolean;
  onSelect?: () => void;
}

const CanvasItem: React.FC<CanvasItemProps> = ({ component, isDragging = false, onSelect }) => {
  const components = useStore(state => state.components);
  const setActiveId = useStore(state => state.setActiveId);
  const isSelected = useStore(state => state.activeId === component.id);

  // Handle component selection
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveId(component.id);
    onSelect?.();
  };

  // Render the actual component based on its type and properties
  const renderContent = () => {
    // Use type guards to properly type-narrow the component
    if (isSectionComponent(component)) {
      return (
        <div 
          style={{
            backgroundColor: component.backgroundColor,
            padding: component.padding,
            border: `${component.borderWidth} solid ${component.borderColor}`,
            borderRadius: component.borderRadius,
            minHeight: '60px',
          }}
          className="relative"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative">
          {component.children.map((child: CanvasComponent) => (
  <CanvasItem key={child.id} component={child} />
))}
          </div>
        </div>
      );
    }
    
    if (isDividerComponent(component)) {
      return (
        <div 
          style={{
            borderTop: `${component.borderWidth} ${component.borderStyle} ${component.borderColor}`,
            width: component.width,
            margin: component.padding,
          }}
          className="mx-auto"
        />
      );
    }
    
    if (isSocialMediaComponent(component)) {
      const socialIcons = {
        facebook: <FacebookIcon className="w-6 h-6" />,
        twitter: <TwitterIcon className="w-6 h-6" />,
        instagram: <InstagramIcon className="w-6 h-6" />,
        linkedin: <LinkedinIcon className="w-6 h-6" />,
        youtube: <YoutubeIcon className="w-6 h-6" />,
        pinterest: <PinterestIcon className="w-6 h-6" />,
        tiktok: <MusicalNoteIcon className="w-6 h-6" />
      } as const;
      
      return (
        <div 
          style={{
            textAlign: component.alignment as React.CSSProperties["textAlign"],
            padding: '10px 0',
          }}
        >
          <div style={{ display: 'inline-flex', gap: component.iconSpacing }}>
            {component.icons.map((icon, index) => (
              <a 
                key={index} 
                href={icon.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#555' }}
                className="hover:opacity-80 transition-opacity"
              >
                {socialIcons[icon.platform as keyof typeof socialIcons] || icon.platform}
              </a>
            ))}
          </div>
        </div>
      );
    }
    
    if (isMenuComponent(component)) {
      return (
        <div 
          style={{
            textAlign: component.alignment as React.CSSProperties["textAlign"],
            backgroundColor: '#f8f9fa',
            padding: '10px 0',
          }}
        >
          <div style={{ display: 'inline-flex', gap: component.itemSpacing }}>
            {component.items.map((item, index) => (
              <a 
                key={index} 
                href={item.url}
                style={{
                  color: component.textColor,
                  padding: component.itemPadding,
                  textDecoration: 'none',
                }}
                className="hover:opacity-80 transition-opacity"
              >
                {item.text}
              </a>
            ))}
          </div>
        </div>
      );
    }
    
    if (isTextComponent(component)) {
      return (
        <p
          style={{
            textAlign: component.align as React.CSSProperties["textAlign"],
            paddingTop: component.paddingTop,
            paddingRight: component.paddingRight,
            paddingBottom: component.paddingBottom,
            paddingLeft: component.paddingLeft,
            color: component.color,
            margin: 0,
          }}
        >
          {component.text}
        </p>
      );
    }
    
    if (isButtonComponent(component)) {
      return (
        <button
          style={{
            paddingTop: component.paddingTop,
            paddingRight: component.paddingRight,
            paddingBottom: component.paddingBottom,
            paddingLeft: component.paddingLeft,
            backgroundColor: component.backgroundColor,
            borderRadius: component.borderRadius,
            color: component.color,
            border: "none",
            cursor: 'pointer',
            display: 'block',
            margin: '0 auto',
            textAlign: component.align as React.CSSProperties["textAlign"],
          }}
          className="hover:opacity-90 transition-opacity"
        >
          {component.buttonText}
        </button>
      );
    }
    
    if (isImageComponent(component)) {
      return (
        <img
          src={component.src || 'https://via.placeholder.com/600x300?text=Image'}
          alt=""
          style={{
            maxWidth: "100%",
            display: "block",
            margin: "0 auto",
          }}
          className="max-h-48 object-cover"
        />
      );
    }
    
    return <div className="p-4 bg-gray-100 text-gray-600">Unknown component type</div>;
  };

  // Base classes for all components
  const baseClasses = [
    "relative p-2 mb-2 border-2 rounded transition-all",
    isSelected ? "border-blue-500 bg-blue-50" : "border-transparent hover:border-gray-300",
    isDragging ? "opacity-50" : "opacity-100",
  ].join(" ");

  // Type-specific classes
  const getTypeClasses = (type: string) => {
    const typeMap = {
      Text: "min-h-[40px] flex items-center",
      Button: "min-h-[40px] flex items-center justify-center",
      Image: "min-h-[100px] flex items-center justify-center bg-gray-100",
      Section: "min-h-[100px] p-4 bg-gray-50",
      Divider: "h-[1px] my-4 bg-gray-200",
      SocialMedia: "min-h-[60px] flex items-center justify-center bg-white",
      Menu: "min-h-[60px] flex items-center bg-gray-50"
    };
    return typeMap[type as keyof typeof typeMap] || "";
  };
  
  const typeClasses = getTypeClasses(component.type);

  // Get alignment based on component type
  const getTextAlignment = (): React.CSSProperties['textAlign'] => {
    if (isTextComponent(component) || isButtonComponent(component)) {
      return component.align as React.CSSProperties['textAlign'];
    }
    if (isSocialMediaComponent(component) || isMenuComponent(component)) {
      return component.alignment as React.CSSProperties['textAlign'];
    }
    return 'left';
  };

  return (
    <div 
      className={`${baseClasses} ${typeClasses}`}
      onClick={handleSelect}
      style={{
        cursor: 'pointer',
        outline: 'none',
        textAlign: getTextAlignment(),
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect(e as any);
        }
      }}
    >
      {renderContent()}
    </div>
  );
};

export default React.memo(CanvasItem);
