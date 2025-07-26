import type { CanvasComponent, GlobalStyles } from "../store";

// Helper function to generate social media icons MJML
const generateSocialIconsMjml = (component: any) => {
  const { alignment, iconSize, iconSpacing, icons } = component;
  
  // MJML expects 'name' for built-in icons, not 'src'.
  const socialIcons = icons.map((icon: { platform: string; url: string; altText: string }) => {
    return `
      <mj-social-element
        name="${icon.platform}"
        href="${icon.url}"
        alt="${icon.altText}"
        icon-size="${iconSize ? parseInt(iconSize, 10) + 'px' : '24px'}"
        icon-padding="0"
        padding="0 ${iconSpacing || 8} 0 0"
      ></mj-social-element>`;
  }).join('\n');
  
  // MJML expects align to be 'left', 'center', or 'right'.
  const alignValue = ['left','center','right'].includes(alignment) ? alignment : 'left';
  const iconSizeValue = Math.min(Math.max(parseInt(iconSize, 10), 12), 64);
  
  // Always wrap in section and column to ensure valid MJML
  return `
    <mj-section>
      <mj-column>
        <mj-social
          mode="horizontal"
          icon-size="${iconSizeValue}px"
          align="${alignValue}"
          padding="10px 0"
        >
          ${socialIcons}
        </mj-social>
      </mj-column>
    </mj-section>`;
};

// Helper function to generate menu MJML
const generateMenuMjml = (component: any) => {
  const { textColor, hoverTextColor, items } = component;
  

  
  // Always wrap in section and column to ensure valid MJML
  return `
    <mj-section>
      <mj-column>
        <mj-table>
          <tr>
            ${items.map((item: { text: string; url: string }) => 
              `<td style="padding: 0 10px;">
                <a href="${item.url}" 
                   style="color: ${textColor}; 
                          text-decoration: none; 
                          transition: color 0.2s ease-in-out;"
                   onmouseover="this.style.color='${hoverTextColor}'"
                   onmouseout="this.style.color='${textColor}'">
                  ${item.text}
                </a>
              </td>`
            ).join('')}
          </tr>
        </mj-table>
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
          // The generateSocialIconsMjml function now handles all necessary wrapping
          mjml = generateSocialIconsMjml(component);
          break;
          
        case "Menu":
          // The generateMenuMjml function now handles all necessary wrapping
          mjml = generateMenuMjml(component);
          break;

        default:
          break;
      }
      
      // Only wrap non-section, non-social, non-menu components in section/column
      // Social and Menu components handle their own wrapping
      if (component.type !== 'Section' && component.type !== 'SocialMedia' && component.type !== 'Menu') {
        return `<mj-section><mj-column>${mjml}</mj-column></mj-section>`;
      }
      
      return mjml;
    })
    .join('\n');

  // Wrap the generated components in the MJML boilerplate
  return `<mjml><mj-body width="${globalStyles.contentWidth}px" background-color="${globalStyles.backgroundColor}">${componentMjml}</mj-body></mjml>`;
}