import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { THEMES, applyTheme } from './themes';

function syncOverlayTheme(): void {
  const theme = document.documentElement.getAttribute('data-theme') ?? 'dark';
  document.querySelector('.cdk-overlay-container')?.setAttribute('data-theme', theme);
}

// When the CDK overlay container is inserted into the DOM, mirror the theme onto it.
new MutationObserver(() => syncOverlayTheme()).observe(document.body, { childList: true });

function applyColorMode(mode: string): void {
  document.documentElement.setAttribute('data-theme', mode === 'light' ? 'light' : 'dark');
  syncOverlayTheme();
}

const preview: Preview = {
  globalTypes: {
    brandTheme: {
      name: 'Brand Theme',
      description: 'Apply a custom brand palette to preview your own colors',
      defaultValue: 'm2s2',
      toolbar: {
        icon: 'paintbrush',
        items: THEMES.map((t) => ({ value: t.key, title: t.label })),
        dynamicTitle: true,
      },
    },
    colorMode: {
      name: 'Color Mode',
      description: 'Switch between dark and light mode',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'dark',  title: 'Dark',  icon: 'moon'  },
          { value: 'light', title: 'Light', icon: 'sun'   },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (story, context) => {
      applyTheme(context.globals['brandTheme'] ?? 'm2s2');
      applyColorMode(context.globals['colorMode'] ?? 'dark');
      return story();
    },
    applicationConfig({
      providers: [
        provideAnimationsAsync(),
        provideRouter([]),
      ],
    }),
  ],

  parameters: {
    backgrounds: { disable: true },
    layout: 'padded',
    options: {
      storySort: {
        order: ['Welcome', 'Components'],
      },
    },
  },
};

export default preview;
