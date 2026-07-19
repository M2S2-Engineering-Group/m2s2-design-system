import type { Meta, StoryObj } from "@storybook/vue3";
import type { BlogPost } from "@m2s2/models";
import BlogEditor from "./BlogEditor.vue";

const existingPost: BlogPost = {
  slug: "angular-signals-deep-dive",
  title: "Angular Signals: A Deep Dive",
  date: "2025-03-15",
  summary:
    "A thorough look at Angular signals — what they are, how they work, and when to reach for them over RxJS.",
  excerpt:
    "Signals landed in Angular 17 and have quietly changed how we think about reactivity in large Angular apps.",
  tags: ["angular", "signals", "rxjs", "frontend"],
  readingTime: 8,
  coverImage:
    "https://placehold.co/1200x630/1e293b/94a3b8?text=Angular+Signals",
  content: `## What are signals?

A **signal** is a reactive primitive that holds a value and notifies consumers when that value changes. Unlike RxJS observables, signals are *synchronous* and *pull-based* — Vue reads them during rendering rather than subscribing asynchronously.

\`\`\`typescript
const count = ref(0);
const doubled = computed(() => count.value * 2);

count.value = 5;
console.log(doubled.value); // 10
\`\`\`

## When to use refs vs computed

> Use \`ref()\` for mutable state. Use \`computed()\` for derived values. Use \`watch()\` for side effects.

### Summary

- \`ref()\` for local reactive state
- \`computed()\` for derived values
- \`watch()\` for side effects
- \`defineProps\` / \`defineEmits\` for component API
`,
};

const seriesPost: BlogPost = {
  ...existingPost,
  slug: "angular-signals-part-2",
  title: "Angular Signals: Advanced Patterns",
  date: "2025-04-10",
  series: { id: "angular-signals", title: "Angular Signals Series", part: 2 },
};

const seriesPostWithTotal: BlogPost = {
  ...seriesPost,
  series: {
    id: "angular-signals",
    title: "Angular Signals Series",
    part: 2,
    total: 3,
  },
};

const existingSeries = [
  { id: "angular-signals", title: "Angular Signals Series" },
  { id: "go-backend", title: "Go Backend Series" },
];

const meta: Meta<typeof BlogEditor> = {
  title: "Components/BlogEditor",
  component: BlogEditor,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Split-pane markdown editor for authoring blog posts. Includes a metadata form, live preview rendered from markdown, toolbar shortcuts, and tag input. Pass `initialPost` to load an existing post for editing. Pass `existingSeries` to populate the series dropdown with series already in use across the blog. Wire `@publish` and `@cover-image-selected` to your API.",
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof BlogEditor>;

export const Empty: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Blank editor — the default state when creating a new post. The series dropdown shows only "None" and "New series…" when no existing series are provided.',
      },
    },
  },
};

export const WithExistingSeries: Story = {
  name: "With Existing Series",
  args: { existingSeries },
  parameters: {
    docs: {
      description: {
        story:
          "New post with existing series available in the dropdown. The author can select a series without retyping its ID and title.",
      },
    },
  },
};

export const EditExistingPost: Story = {
  name: "Edit Existing Post",
  args: {
    initialPost: existingPost,
    coverImageUrl: existingPost.coverImage,
    existingSeries,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pre-populated with an existing post that has no series. Slug is locked from auto-update since it was already set.",
      },
    },
  },
};

export const EditPostWithSeries: Story = {
  name: "Edit Post With Series",
  args: {
    initialPost: seriesPost,
    coverImageUrl: seriesPost.coverImage,
    existingSeries,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Editing a post that belongs to an existing series without a total set. The "Total Parts" field is blank — the reader-facing count will be derived from the number of published posts in the series.',
      },
    },
  },
};

export const EditPostWithSeriesTotal: Story = {
  name: "Edit Post With Series (explicit total)",
  args: {
    initialPost: seriesPostWithTotal,
    coverImageUrl: seriesPostWithTotal.coverImage,
    existingSeries,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Editing a post where the author has explicitly set a total (e.g. "Part 2 of 3"). Use this when you want to announce the planned length of the series before all parts are published.',
      },
    },
  },
};

export const EditPostSeriesNotInList: Story = {
  name: "Edit Post — Series Not In List",
  args: {
    initialPost: seriesPost,
    existingSeries: [],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Editing a post whose series ID is not found in existingSeries (e.g. list still loading). Falls back to "New series…" with the ID and title pre-filled.',
      },
    },
  },
};
