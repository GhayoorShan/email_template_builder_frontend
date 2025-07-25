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
            align="${component.align}"
            color="${component.color}"
            padding-top="${component.paddingTop}"
            padding-right="${component.paddingRight}"
            padding-bottom="${component.paddingBottom}"
            padding-left="${component.paddingLeft}"
          >${component.text}</mj-text>`;
          break;

        case "Button":
          mjml = `<mj-button
            href="${component.url}"
            align="${component.align}"
            background-color="${component.backgroundColor}"
            color="${component.color}"
            border-radius="${component.borderRadius}"
            inner-padding="${component.paddingTop} ${component.paddingRight} ${component.paddingBottom} ${component.paddingLeft}"
          >${component.buttonText}</mj-button>`;
          break;

        case "Image":
          mjml = `<mj-image
            src="${component.src}"
            align="${component.align}"
          />`;
          break;
          
        case "Section":
          // For sections, we'll just return the children wrapped in a section
          // The actual section styling will be handled by the parent component
          mjml = `<mj-section
            background-color="${component.backgroundColor}"
            padding="${component.padding}"
            border="${component.borderWidth} solid ${component.borderColor}"
            border-radius="${component.borderRadius}"
          >
            <mj-column>
              ${component.children.map(childId => {
                const child = components.find(c => c.id === childId);
                // Recursively generate MJML for child components
                return child ? generateMjml([child], globalStyles) : '';
              }).join('')}
            </mj-column>
          </mj-section>`;
          break;
          
        case "Divider":
          mjml = `<mj-divider
            border-width="${component.borderWidth}"
            border-style="${component.borderStyle}"
            border-color="${component.borderColor}"
            width="${component.width}"
            padding="${component.padding}"
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