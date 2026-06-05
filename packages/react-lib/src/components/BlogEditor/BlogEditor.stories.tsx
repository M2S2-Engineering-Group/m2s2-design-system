import type { Meta, StoryObj } from '@storybook/react';
import type { BlogPost } from '@m2s2/models';
import { BlogEditor } from './BlogEditor';

const existingPost: BlogPost = {
  slug:        'angular-signals-deep-dive',
  title:       'Angular Signals: A Deep Dive',
  date:        '2025-03-15',
  summary:     'A thorough look at Angular signals — what they are, how they work, and when to reach for them over RxJS.',
  excerpt:     'Signals landed in Angular 17 and have quietly changed how we think about reactivity in large Angular apps.',
  tags:        ['angular', 'signals', 'rxjs', 'frontend'],
  readingTime: 8,
  coverImage:  'https://placehold.co/1200x630/1e293b/94a3b8?text=Angular+Signals',
  content: `## What are signals?

A **signal** is a reactive primitive that holds a value and notifies consumers when that value changes. Unlike RxJS observables, signals are *synchronous* and *pull-based* — Angular reads them during rendering rather than subscribing asynchronously.

\`\`\`typescript
const count = signal(0);
const doubled = computed(() => count() * 2);

count.set(5);
console.log(doubled()); // 10
\`\`\`

## When to use signals vs RxJS

> Signals are great for component-local state. RxJS is still the right tool for async event streams, HTTP, and complex multi-step operations.

The practical rule: if it's *state*, reach for \`signal()\`. If it's an *event stream*, reach for RxJS.

### Summary

- \`signal()\` for local reactive state
- \`computed()\` for derived values
- \`effect()\` for side effects
- \`toSignal()\` to bridge RxJS into the signal world
`,
};

const meta: Meta<typeof BlogEditor> = {
  title: 'Components/BlogEditor',
  component: BlogEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Split-pane markdown editor for authoring blog posts. Includes a metadata form, live preview rendered from markdown, toolbar shortcuts, and tag input. Pass `initialPost` to load an existing post for editing. Wire `onPublish` and `onCoverImageSelected` to your API.',
      },
    },
  },
  decorators: [
    Story => (
      <div style={{ background: 'var(--color-bg, #0a0a0f)', padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof BlogEditor>;

export const Empty: Story = {
  args: {},
  parameters: {
    docs: {
      description: { story: 'Blank editor — the default state when creating a new post.' },
    },
  },
};

export const EditExistingPost: Story = {
  name: 'Edit Existing Post',
  args: {
    initialPost:   existingPost,
    coverImageUrl: existingPost.coverImage,
  },
  parameters: {
    docs: {
      description: { story: 'Pre-populated with an existing post. Slug is locked from auto-update since it was already set.' },
    },
  },
};
