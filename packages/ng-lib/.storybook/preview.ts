import type { Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { applyTheme, applyColorMode, sharedGlobalTypes } from '../../storybook-shared/src';

function syncOverlayTheme(): void {
  const theme = document.documentElement.getAttribute('data-theme') ?? 'dark';
  document.querySelector('.cdk-overlay-container')?.setAttribute('data-theme', theme);
}

new MutationObserver(() => syncOverlayTheme()).observe(document.body, { childList: true });

function applyColorModeAngular(mode: string): void {
  applyColorMode(mode);
  syncOverlayTheme();
}

const preview: Preview = {
  globalTypes: sharedGlobalTypes,

  decorators: [
    (story, context) => {
      applyTheme(context.globals['brandTheme'] ?? 'm2s2');
      applyColorModeAngular(context.globals['colorMode'] ?? 'dark');
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
        order: ['Welcome', 'Brand Configurator', 'Components'],
      },
    },
  },
};

export default preview;
