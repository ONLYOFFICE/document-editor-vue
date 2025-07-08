import type { Preview } from "@storybook/vue3";
import "./preview.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (story: any, context: any) => {
      context.args.id = `${context.args.id}-${Date.now()}`;

      return {
        components: { Story: story() },
        template: `
          <div style="display: grid; height: 100%; min-height: 400px;">
            <story />
          </div>
        `
      };
    }
  ],
};

export default preview;
