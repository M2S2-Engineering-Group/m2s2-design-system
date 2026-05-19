import { THEMES } from './themes';

export const sharedGlobalTypes = {
  brandTheme: {
    name: 'Brand Theme',
    description: 'Apply a custom brand palette to preview your own colors',
    defaultValue: 'm2s2',
    toolbar: {
      icon: 'paintbrush' as const,
      items: THEMES.map((t) => ({ value: t.key, title: t.label })),
      dynamicTitle: true,
    },
  },
  colorMode: {
    name: 'Color Mode',
    description: 'Switch between dark and light mode',
    defaultValue: 'dark',
    toolbar: {
      icon: 'circlehollow' as const,
      items: [
        { value: 'dark',  title: 'Dark',  icon: 'moon' as const },
        { value: 'light', title: 'Light', icon: 'sun'  as const },
      ],
      dynamicTitle: true,
    },
  },
};
