// Base component type that all components extend
export type CanvasComponent = {
  id: string;
  type: 'Column' | 'Section' | 'Structure' | 'OneColumn' | 'TwoColumn' | 'Text' | 'Heading' | 'Button' | 'Image' | 'Divider' | 'SocialMedia' | 'Menu';
  parentId: string | null;
  children?: CanvasComponent[];
  props: Record<string, any>;
};

// Common props for layout components
type LayoutProps = {
  backgroundColor?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  borderWidth?: string;
  borderColor?: string;
  borderRadius?: string;
};

// Specific component types
export type ColumnComponent = CanvasComponent & {
  type: 'Column';
  props: LayoutProps & {
    width?: string;
  };
};

export type SectionComponent = CanvasComponent & {
  type: 'Section';
  props: LayoutProps & {
    borderWidth?: string;
    borderColor?: string;
    borderRadius?: string;
  };
};

export type StructureComponent = CanvasComponent & {
  type: 'Structure';
  props: LayoutProps;
};

export type OneColumnComponent = CanvasComponent & {
  type: 'OneColumn';
  props: LayoutProps;
};

export type TwoColumnComponent = CanvasComponent & {
  type: 'TwoColumn';
  props: LayoutProps;
};

// Content component types
export type TextComponent = CanvasComponent & {
  type: 'Text';
  props: {
    content?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    fontSize?: string;
    color?: string;
    lineHeight?: string;
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
  };
};

export type HeadingComponent = CanvasComponent & {
  type: 'Heading';
  props: {
    text?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    align?: 'left' | 'center' | 'right' | 'justify';
    color?: string;
    padding?: string;
    fontSize?: string;
    lineHeight?: string;
  };
};

export type ButtonComponent = CanvasComponent & {
  type: 'Button';
  props: {
    text?: string;
    url?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    borderRadius?: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
  };
};

export type ImageComponent = CanvasComponent & {
  type: 'Image';
  props: {
    src?: string;
    alt?: string;
    width?: string;
    height?: string;
    align?: 'left' | 'center' | 'right';
    padding?: string;
    linkUrl?: string;
  };
};

export type DividerComponent = CanvasComponent & {
  type: 'Divider';
  props: {
    height?: string;
    color?: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    paddingTop?: string;
    paddingBottom?: string;
  };
};

export type SocialMediaComponent = CanvasComponent & {
  type: 'SocialMedia';
  props: {
    alignment?: 'left' | 'center' | 'right';
    iconSize?: string;
    iconSpacing?: string;
    icons?: Array<{
      platform: string;
      url: string;
      icon: string;
    }>;
  };
};

export type MenuComponent = CanvasComponent & {
  type: 'Menu';
  props: {
    alignment?: 'left' | 'center' | 'right';
    itemPadding?: string;
    itemSpacing?: string;
    textColor?: string;
    hoverTextColor?: string;
    items?: Array<{
      text: string;
      url: string;
    }>;
  };
};

// Union type of all component types
export type AnyComponent = 
  | ColumnComponent
  | SectionComponent
  | StructureComponent
  | OneColumnComponent
  | TwoColumnComponent
  | TextComponent
  | HeadingComponent
  | ButtonComponent
  | ImageComponent
  | DividerComponent
  | SocialMediaComponent
  | MenuComponent;