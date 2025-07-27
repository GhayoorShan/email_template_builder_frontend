import React from 'react';
import type { 
  CanvasComponent, 
  AnyComponent
} from '../types';

export interface ComponentConfig<T extends CanvasComponent = CanvasComponent> {
  type: T['type'];
  defaultProps: Partial<T>;
  icon?: React.ComponentType<{ size?: string | number }>;
  renderer?: React.ComponentType<any>;
  properties?: React.ComponentType<any>;
  isDraggable?: boolean;
  preview?: string;
}

import { Type, Heading1, MousePointerClick, Image as ImageIcon, Minus, Share2, Menu as MenuIcon, Box, Columns } from 'lucide-react';

// Lazy load components
const TextRenderer = React.lazy(() => import('../features/email-components/Text/Renderer').then(module => ({ default: module.Text })));
const TextProperties = React.lazy(() => import('../features/email-components/Text/Properties').then(module => ({ default: module.TextProperties })));

const HeadingRenderer = React.lazy(() => import('../features/email-components/Heading/Renderer').then(module => ({ default: module.Heading })));
const HeadingProperties = React.lazy(() => import('../features/email-components/Heading/Properties').then(module => ({ default: module.HeadingProperties })));

const ButtonRenderer = React.lazy(() => import('../features/email-components/Button/Renderer').then(module => ({ default: module.Button })));
const ButtonProperties = React.lazy(() => import('../features/email-components/Button/Properties').then(module => ({ default: module.ButtonProperties })));

const ImageRenderer = React.lazy(() => import('../features/email-components/Image/Renderer').then(module => ({ default: module.Image })));
const ImageProperties = React.lazy(() => import('../features/email-components/Image/Properties').then(module => ({ default: module.ImageProperties })));

const DividerRenderer = React.lazy(() => import('../features/email-components/Divider/Renderer').then(module => ({ default: module.Divider })));
const DividerProperties = React.lazy(() => import('../features/email-components/Divider/Properties').then(module => ({ default: module.DividerProperties })));

const SocialMediaRenderer = React.lazy(() => import('../features/email-components/SocialMedia/Renderer').then(module => ({ default: module.SocialMedia })));
const SocialMediaProperties = React.lazy(() => import('../features/email-components/SocialMedia/Properties').then(module => ({ default: module.SocialMediaProperties })));

const MenuRenderer = React.lazy(() => import('../features/email-components/Menu/Renderer').then(module => ({ default: module.Menu })));
const MenuProperties = React.lazy(() => import('../features/email-components/Menu/Properties').then(module => ({ default: module.MenuProperties })));

const SectionProperties = React.lazy(() => import('../features/email-components/Section/Properties').then(module => ({ default: module.SectionProperties })));
const SectionRenderer = React.lazy(() => import('../features/email-components/Section/Renderer').then(module => ({ default: module.Section })));

const ColumnRenderer = React.lazy(() => import('../features/email-components/Column/Renderer').then(module => ({ default: module.default })));
const ColumnProperties = React.lazy(() => import('../features/email-components/Column/Properties').then(module => ({ default: module.ColumnProperties })));

export const componentRegistry: { [key: string]: ComponentConfig<AnyComponent> } = {
  Text: {
    type: 'Text',
    renderer: TextRenderer,
    properties: TextProperties,
    icon: Type,
    defaultProps: {
      props: {
        text: 'This is a text block. You can edit this text.',
        align: 'left',
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        color: '#000000'
      }
    },
    isDraggable: true,
    preview: '/assets/previews/text-preview.png',
  },
  Heading: {
    type: 'Heading',
    renderer: HeadingRenderer,
    properties: HeadingProperties,
    icon: Heading1,
    defaultProps: {
      props: {
        text: 'This is a Heading',
        level: 1,
        align: 'left',
        color: '#000000',
        padding: '10px'
      }
    },
    isDraggable: true,
    preview: '/assets/previews/heading-preview.png',
  },
  Button: {
    type: 'Button',
    renderer: ButtonRenderer,
    properties: ButtonProperties,
    icon: MousePointerClick,
    defaultProps: {
      props: {
        buttonText: 'Click Me',
        url: '#',
        align: 'center',
        paddingTop: '10px',
        paddingRight: '20px',
        paddingBottom: '10px',
        paddingLeft: '20px',
        backgroundColor: '#3b82f6',
        borderRadius: '5px',
        color: '#ffffff'
      }
    },
    isDraggable: true,
    preview: '/assets/previews/button-preview.png',
  },
  Image: {
    type: 'Image',
    renderer: ImageRenderer,
    properties: ImageProperties,
    icon: ImageIcon,
    defaultProps: {
      props: {
        src: 'https://via.placeholder.com/600x400',
        align: 'center'
      }
    },
    isDraggable: true,
    preview: '/assets/previews/image-preview.png',
  },
  Divider: {
    type: 'Divider',
    renderer: DividerRenderer,
    properties: DividerProperties,
    icon: Minus,
    defaultProps: {
      props: {
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#cccccc',
        width: '100%',
        padding: '10px 0'
      }
    },
    isDraggable: true,
    preview: '/assets/previews/divider-preview.png',
  },
  SocialMedia: {
    type: 'SocialMedia',
    renderer: SocialMediaRenderer,
    properties: SocialMediaProperties,
    icon: Share2,
    defaultProps: {
      props: {
        alignment: 'center',
        iconSize: '24px',
        iconSpacing: '10px',
        icons: [
          { platform: 'facebook', url: '#', altText: 'Facebook' },
          { platform: 'twitter', url: '#', altText: 'Twitter' }
        ]
      }
    },
    isDraggable: true,
    preview: '/assets/previews/social-media-preview.png',
  },
  Menu: {
    type: 'Menu',
    renderer: MenuRenderer,
    properties: MenuProperties,
    icon: MenuIcon,
    defaultProps: {
      props: {
        alignment: 'center',
        itemPadding: '10px',
        itemSpacing: '15px',
        textColor: '#000000',
        hoverTextColor: '#3b82f6',
        items: [
          { text: 'Home', url: '#' },
          { text: 'About', url: '#' }
        ]
      }
    },
    isDraggable: true,
    preview: '/assets/previews/menu-preview.png',
  },
  Section: {
    type: 'Section',
    renderer: SectionRenderer,
    properties: SectionProperties,
    icon: Box,
    defaultProps: {
      children: [],
      props: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderWidth: '0px',
        borderColor: '#ffffff',
        borderRadius: '0px'
      }
    },
    isDraggable: false,
    preview: '',
  },
  Column: {
    type: 'Column',
    renderer: ColumnRenderer,
    properties: ColumnProperties,
    icon: Columns,
    defaultProps: {
      children: [],
      props: {
        width: '100%',
        backgroundColor: 'transparent',
        paddingTop: '0',
        paddingRight: '0',
        paddingBottom: '0',
        paddingLeft: '0'
      }
    },
    isDraggable: false,
    preview: '',
  },
};
