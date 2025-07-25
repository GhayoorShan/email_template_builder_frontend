import type { CanvasComponent, GlobalStyles } from "../store";

// Helper function to generate social media icons MJML
const generateSocialIconsMjml = (component: any) => {
  const { alignment, iconSize, iconSpacing, icons } = component;
  
  const socialIcons = icons.map((icon: { platform: string; url: string; altText: string }) => {
    const iconsMap: Record<string, string> = {
      facebook: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/facebook.svg',
      twitter: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/twitter.svg',
      instagram: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/instagram.svg',
      linkedin: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/linkedin.svg',
      youtube: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/youtube.svg',
      pinterest: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/pinterest.svg',
      tiktok: 'https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/tiktok.svg'
    };
    
    const iconUrl = iconsMap[icon.platform] || '';
    
    return `
      <mj-social-element
        href="${icon.url}"
        src="${iconUrl}"
        alt="${icon.altText}"
        icon-size="${iconSize}"
        icon-padding="0"
        padding="0 ${iconSpacing} 0 0"
      ></mj-social-element>`;
  }).join('\n');
  
  return `
    <mj-social
      mode="horizontal"
      icon-size="${iconSize}"
      text-mode="false"
      align="${alignment}"
      padding="10px 0"
    >
      ${socialIcons}
    </mj-social>`;
};

// Helper function to generate menu MJML
const generateMenuMjml = (component: any) => {
  const { alignment, itemPadding, textColor, hoverTextColor, items } = component;
  
  const menuItems = items.map((item: { text: string; url: string }) => {
    return `
      <mj-text
        padding="${itemPadding}"
        color="${textColor}"
        align="${alignment}"
        css-class="menu-item"
        mj-class="menu-item"
      >
        <a 
          href="${item.url}" 
          style="color: ${textColor}; text-decoration: none;"
          onmouseover="this.style.color='${hoverTextColor}'"
          onmouseout="this.style.color='${textColor}'"
        >
          ${item.text}
        </a>
      </mj-text>`;
  }).join('\n');
  
  return `
    <mj-section>
      <mj-column>
        ${menuItems}
      </mj-column>
    </mj-section>`;
};

/**
 * Generates an MJML string from an array of canvas components.
 * @param components The array of components from the Zustand store.
 * @returns A full MJML string.
 */
export function generateMjml(components: CanvasComponent[], globalStyles: GlobalStyles): string {
  const componentMjml = components
    .map((component) => {
      let mjml = "";
      switch (component.type) {
        case "Text":
          mjml = `<mj-text
            align="${component.align || 'left'}"
            color="${component.color || '#000000'}"
            padding-top="${component.paddingTop || '10px'}"
            padding-right="${component.paddingRight || '25px'}"
            padding-bottom="${component.paddingBottom || '10px'}"
            padding-left="${component.paddingLeft || '25px'}"
          >${component.text || ''}</mj-text>`;
          break;

        case "Button":
          mjml = `<mj-button
            href="${component.url || '#'}"
            align="${component.align || 'center'}"
            background-color="${component.backgroundColor || '#000000'}"
            color="${component.color || '#ffffff'}"
            border-radius="${component.borderRadius || '3px'}"
            inner-padding="${component.paddingTop || '10px'} ${component.paddingRight || '25px'} ${component.paddingBottom || '10px'} ${component.paddingLeft || '25px'}"
          >${component.buttonText || 'Button'}</mj-button>`;
          break;

        case "Image":
          mjml = `<mj-image
            src="${component.src || ''}"
            align="${component.align || 'center'}"
            padding="10px 25px"
          />`;
          break;
          
        case "Section":
          mjml = `<mj-section
            background-color="${component.backgroundColor || '#ffffff'}"
            padding="${component.padding || '20px 0'}"
            border="${component.borderWidth || '0'} solid ${component.borderColor || 'transparent'}"
            border-radius="${component.borderRadius || '0'}"
          >
            <mj-column>
              ${component.children?.map(child => {
                return generateMjml([child], globalStyles);
              }).join('') || ''}
            </mj-column>
          </mj-section>`;
          break;
          
        case "Divider":
          mjml = `<mj-divider
            border-width="${component.borderWidth || '1px'}"
            border-style="${component.borderStyle || 'solid'}"
            border-color="${component.borderColor || '#000000'}"
            width="${component.width || '100%'}"
            padding="${component.padding || '10px 25px'}"
          />`;
          break;
          
        case "SocialMedia":
          mjml = generateSocialIconsMjml(component);
          break;
          
        case "Menu":
          mjml = generateMenuMjml(component);
          break;

        default:
          break;
      }
      
      // Only wrap non-section components in section/column
      if (component.type !== 'Section' && component.type !== 'SocialMedia' && component.type !== 'Menu') {
        return `<mj-section><mj-column>${mjml}</mj-column></mj-section>`;
      }
      
      return mjml;
    })
    .join('\n');

  // Wrap the generated components in the MJML boilerplate
  return `<mjml><mj-body width="${globalStyles.contentWidth}px" background-color="${globalStyles.backgroundColor}">${componentMjml}</mj-body></mjml>`;
}