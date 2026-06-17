export interface ToolbarItem {
  label: string;
  icon: string;
  wrap?: [string, string];
  prefix?: string;
  block?: string;
}

export const BLOG_EDITOR_TOOLBAR: ToolbarItem[] = [
  { label: 'Heading 2',     icon: 'H2',  prefix: '## ' },
  { label: 'Heading 3',     icon: 'H3',  prefix: '### ' },
  { label: 'Bold',          icon: 'B',   wrap: ['**', '**'] },
  { label: 'Italic',        icon: 'I',   wrap: ['*', '*'] },
  { label: 'Inline code',   icon: '`',   wrap: ['`', '`'] },
  { label: 'Code block',    icon: '{ }', block: '\n```\n\n```\n' },
  { label: 'Blockquote',    icon: '❝',   prefix: '> ' },
  { label: 'Link',          icon: '⇗',   wrap: ['[', '](url)'] },
  { label: 'Image',         icon: '⬚',   block: '![alt text](image-url)\n' },
  { label: 'Bullet list',   icon: '•–',  prefix: '- ' },
  { label: 'Numbered list', icon: '1.',  prefix: '1. ' },
  { label: 'Divider',       icon: '—',   block: '\n---\n\n' },
];
