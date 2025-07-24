import type { CanvasComponent } from "../store";

/**
 * Generates an MJML string from an array of canvas components.
 * @param components The array of components from the Zustand store.
 * @returns A full MJML string.
 */
export function generateMjml(components: CanvasComponent[]): string {
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

        default:
          break;
      }
      // Wrap each component in a section and column for proper layout
      return `<mj-section><mj-column>${mjml}</mj-column></mj-section>`;
    })
    .join("\n");

  // Wrap the generated components in the MJML boilerplate
  return `<mjml><mj-body>${componentMjml}</mj-body></mjml>`;
}