import type { AnyComponent } from '../types';

export function generateMjml(components: AnyComponent[]): string {
  const generateComponentMjml = (component: AnyComponent): string => {
    switch (component.type) {
      case 'Section':
        return `
          <mj-section 
            background-color="${component.props.backgroundColor || '#ffffff'}"
            padding="${component.props.padding || '20px 0'}"
            ${component.props.borderWidth ? `border="${component.props.borderWidth} solid ${component.props.borderColor || '#000000'}"` : ''}
            ${component.props.borderRadius ? `border-radius="${component.props.borderRadius}"` : ''}
          >
            ${component.children?.map(generateComponentMjml).join('') || ''}
          </mj-section>
        `;

      case 'Column':
        return `
          <mj-column 
            width="${component.props.width || '100%'}"
          >
            ${component.children?.map(generateComponentMjml).join('') || ''}
          </mj-column>
        `;

      case 'Text':
        return `
          <mj-text 
            padding="${component.props.paddingTop || '10px'} ${component.props.paddingRight || '20px'} ${component.props.paddingBottom || '10px'} ${component.props.paddingLeft || '20px'}"
            color="${component.props.color || '#000000'}"
            font-size="${component.props.fontSize || '14px'}"
            line-height="${component.props.lineHeight || '1.5'}"
            align="${component.props.textAlign || 'left'}"
          >
            ${component.props.content || ''}
          </mj-text>
        `;

      case 'Button':
        return `
          <mj-button 
            background-color="${component.props.backgroundColor || '#007bff'}"
            color="${component.props.textColor || '#ffffff'}"
            href="${component.props.url || '#'}"
            padding="${component.props.padding || '15px 25px'}"
            border-radius="${component.props.borderRadius || '4px'}"
            align="${component.props.align || 'center'}"
            font-size="16px"
            font-weight="bold"
          >
            ${component.props.text || 'Button'}
          </mj-button>
        `;

      case 'Image':
        return `
          <mj-image 
            src="${component.props.src || ''}" 
            alt="${component.props.alt || ''}"
            width="${component.props.width || '300px'}"
            ${component.props.height ? `height="${component.props.height}"` : ''}
            align="${component.props.align || 'center'}"
            padding="${component.props.padding || '10px 20px'}"
            ${component.props.linkUrl ? `href="${component.props.linkUrl}"` : ''}
          />
        `;

      case 'Divider':
        return `
          <mj-divider 
            border-width="${component.props.height || '1px'}" 
            border-color="${component.props.color || '#cccccc'}" 
            width="${component.props.width || '100%'}"
            padding="${component.props.paddingTop || '10px'} 0 ${component.props.paddingBottom || '10px'} 0"
          />
        `;

      default:
        console.warn(`Unsupported component type: ${component.type}`);
        return '';
    }
  };

  const mjmlContent = components.map(generateComponentMjml).join('\n');

  return `
    <mjml>
      <mj-body>
        ${mjmlContent}
      </mj-body>
    </mjml>
  `;
}
