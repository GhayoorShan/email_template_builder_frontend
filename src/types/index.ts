// Base component type that all components extend
export type CanvasComponent = {
  id: string;
  type: 'Stripe' | 'Structure' | 'Container' | 'Column' | 'Text' | 'Heading' | 'Button' | 'Image' | 'Divider' | 'SocialMedia' | 'Menu';
  parentId: string | null;
  children?: CanvasComponent[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// Email-wide settings for Structure component
type EmailSettings = {
  emailWidth?: string;
  emailBackgroundColor?: string;
  fontFamily?: string;
  fontSize?: string;
  lineHeight?: string;
  textColor?: string;
  linkColor?: string;
};

// Stripo-like hierarchy components

// Structure: Top-level email container with email-wide settings
export type StructureComponent = CanvasComponent & {
  type: 'Structure';
  props: LayoutProps & EmailSettings & {
    maxWidth?: string;
    align?: 'left' | 'center' | 'right';
    containerGap?: string;
    containerPadding?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
  };
};

// Container: Section-level container (replaces old Section)
export type ContainerComponent = CanvasComponent & {
  type: 'Container';
  props: LayoutProps & {
    fullWidth?: boolean;
    direction?: 'ltr' | 'rtl';
    textAlign?: 'left' | 'center' | 'right';
  };
};

// Column: Layout column within containers
export type ColumnComponent = CanvasComponent & {
  type: 'Column';
  props: LayoutProps & {
    width?: string;
    verticalAlign?: 'top' | 'middle' | 'bottom';
  };
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
    buttonText?: string;
    text?: string;
    url?: string;
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    borderRadius?: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    paddingTop?: string;
    paddingRight?: string;
    paddingBottom?: string;
    paddingLeft?: string;
    color?: string;
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

// Stripe: Top-level email section
export type StripeComponent = CanvasComponent & {
  type: 'Stripe';
  props: LayoutProps & {
    stripeType?: 'header' | 'content' | 'footer' | 'info';
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
  | StripeComponent
  | StructureComponent
  | ContainerComponent
  | ColumnComponent
  | TextComponent
  | HeadingComponent
  | ButtonComponent
  | ImageComponent
  | DividerComponent
  | SocialMediaComponent
  | MenuComponent;