import { useStore } from "../../store";
import type { 
  CanvasComponent, 
  TextComponent, 
  ButtonComponent, 
  ImageComponent,
  DividerComponent,
  SocialMediaComponent,
  MenuComponent
} from "../../types/index";
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
  const { setSelectedId, selectedId } = useStore();
  const isSelected = selectedId === component.id;

  // Handle component selection
  const handleSelect = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setSelectedId(component.id);
    onSelect?.();
  };

  // Render the actual component based on its type and properties
  const renderContent = () => {
    // Use type guards to properly type-narrow the component

    if (isDividerComponent(component)) {
      return (
        <div 
          style={{
            borderTop: `${component.props.height || '1px'} solid ${component.props.color || '#cccccc'}`,
            width: component.props.width || '100%',
            paddingTop: component.props.paddingTop || '10px',
            paddingBottom: component.props.paddingBottom || '10px',
            textAlign: component.props.align || 'center',
          }}
        >
          <div style={{ display: 'inline-block', width: component.props.width || '100%', borderTop: `${component.props.height || '1px'} solid ${component.props.color || '#cccccc'}` }} />
        </div>
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
            textAlign: component.props.alignment as React.CSSProperties["textAlign"],
            padding: '10px 0',
          }}
        >
          <div style={{ display: 'inline-flex', gap: component.props.iconSpacing }}>
            {component.props.icons?.map((icon, index) => (
              <a 
                key={index} 
                href={icon.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#333' }}
                className="hover:opacity-80 transition-opacity"
              >
                {socialIcons[icon.platform as keyof typeof socialIcons]}
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
            textAlign: component.props.alignment as React.CSSProperties["textAlign"],
            padding: '10px 0',
          }}
        >
          <div style={{ display: 'inline-flex', gap: component.props.itemSpacing }}>
            {component.props.items?.map((item, index) => (
              <a 
                key={index} 
                href={item.url}
                style={{
                  color: component.props.textColor,
                  padding: component.props.itemPadding,
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
            textAlign: component.props.textAlign as React.CSSProperties["textAlign"],
            paddingTop: component.props.paddingTop,
            paddingRight: component.props.paddingRight,
            paddingBottom: component.props.paddingBottom,
            paddingLeft: component.props.paddingLeft,
            color: component.props.color,
            margin: 0,
            lineHeight: component.props.lineHeight,
            fontSize: component.props.fontSize,
          }}
        >
          {component.props.content}
        </p>
      );
    }
    
    if (isButtonComponent(component)) {
      return (
        <button
          style={{
            padding: component.props.padding,
            backgroundColor: component.props.backgroundColor,
            borderRadius: component.props.borderRadius,
            color: component.props.textColor,
            border: "none",
            cursor: 'pointer',
            display: 'block',
            width: component.props.width,
            textAlign: component.props.align as React.CSSProperties["textAlign"],
          }}
          className="hover:opacity-90 transition-opacity"
        >
          {component.props.text}
        </button>
      );
    }
    
    if (isImageComponent(component)) {
      return (
        <img
          src={component.props.src || 'https://via.placeholder.com/600x300?text=Image'}
          alt={component.props.alt || ''}
          style={{
            maxWidth: component.props.width || "100%",
            height: component.props.height || 'auto',
            display: "block",
            margin: component.props.align === 'center' ? '0 auto' : (component.props.align === 'right' ? '0 0 0 auto' : '0'),
            padding: component.props.padding,
          }}
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
      Divider: "h-[1px] my-4 bg-gray-200",
      SocialMedia: "min-h-[60px] flex items-center justify-center bg-white",
      Menu: "min-h-[60px] flex items-center bg-gray-50"
    };
    return typeMap[type as keyof typeof typeMap] || "";
  };
  
  const typeClasses = getTypeClasses(component.type);

  // Get alignment based on component type
  const getTextAlignment = (): React.CSSProperties['textAlign'] => {
    if (isTextComponent(component)) {
      return component.props.textAlign as React.CSSProperties['textAlign'];
    }
    if (isButtonComponent(component) || isImageComponent(component)) {
      return component.props.align as React.CSSProperties['textAlign'];
    }
    if (isSocialMediaComponent(component) || isMenuComponent(component)) {
      return component.props.alignment as React.CSSProperties['textAlign'];
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
          handleSelect(e);
        }
      }}
    >
      {renderContent()}
    </div>
  );
};

export default React.memo(CanvasItem);
