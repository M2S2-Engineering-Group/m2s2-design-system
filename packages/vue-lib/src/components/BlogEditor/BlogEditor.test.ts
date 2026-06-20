import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import BlogEditor from './BlogEditor.vue';
import { makeBlogPost } from '@m2s2/utils/testing';

const mountEditor = (props: Record<string, unknown> = {}) =>
  mount(BlogEditor, { props });

const fillRequiredFields = async (wrapper: ReturnType<typeof mount>) => {
  const titleInput = wrapper.find('input[placeholder="Post title…"]');
  await titleInput.setValue('My Post');
  await titleInput.trigger('input');
  await wrapper
    .find('textarea[placeholder="Short description shown in blog listings…"]')
    .setValue('Great summary');
  const contentArea = wrapper.find('textarea[placeholder="Write your post in markdown…"]');
  await contentArea.setValue('Body content.');
  await contentArea.trigger('input');
};

describe('BlogEditor', () => {
  describe('renders fields', () => {
    it('renders the title input', () => {
      const wrapper = mountEditor();
      expect(wrapper.find('input[placeholder="Post title…"]').exists()).toBe(true);
    });

    it('renders the slug input', () => {
      const wrapper = mountEditor();
      expect(wrapper.find('input[placeholder="post-slug"]').exists()).toBe(true);
    });

    it('renders a date input', () => {
      const wrapper = mountEditor();
      expect(wrapper.find('input[type="date"]').exists()).toBe(true);
    });
  });

  describe('Publish button state', () => {
    it('is disabled when title is empty', () => {
      const wrapper = mountEditor();
      expect(wrapper.find('.be-publish').attributes('disabled')).toBeDefined();
    });

    it('is disabled when summary is empty', async () => {
      const wrapper = mountEditor();
      await wrapper.find('input[placeholder="Post title…"]').setValue('A title');
      expect(wrapper.find('.be-publish').attributes('disabled')).toBeDefined();
    });

    it('is enabled when title, summary, and content are all filled', async () => {
      const wrapper = mountEditor();
      await wrapper.find('input[placeholder="Post title…"]').setValue('A title');
      await wrapper
        .find('textarea[placeholder="Short description shown in blog listings…"]')
        .setValue('A summary');
      await wrapper
        .find('textarea[placeholder="Write your post in markdown…"]')
        .setValue('Some content here.');
      expect(wrapper.find('.be-publish').attributes('disabled')).toBeUndefined();
    });
  });

  describe('publish emit', () => {
    it('emits publish with correct draft shape when Publish is clicked', async () => {
      const wrapper = mountEditor();
      await fillRequiredFields(wrapper);
      await wrapper.find('.be-publish').trigger('click');
      const emitted = wrapper.emitted('publish') as unknown[][];
      expect(emitted).toHaveLength(1);
      const draft = emitted[0][0] as Record<string, unknown>;
      expect(draft.title).toBe('My Post');
      expect(draft.summary).toBe('Great summary');
      expect(draft.content).toBe('Body content.');
    });
  });

  describe('slug auto-generation', () => {
    it('auto-generates slug from the title', async () => {
      const wrapper = mountEditor();
      const titleInput = wrapper.find('input[placeholder="Post title…"]');
      await titleInput.setValue('Hello World Post');
      await titleInput.trigger('input');
      const slugInput = wrapper.find('input[placeholder="post-slug"]')
        .element as HTMLInputElement;
      expect(slugInput.value).toBe('hello-world-post');
    });
  });

  describe('tags', () => {
    it('adds a tag when Enter is pressed', async () => {
      const wrapper = mountEditor();
      const tagInput = wrapper.find('.be-tag-input');
      await tagInput.setValue('angular');
      await tagInput.trigger('keydown', { key: 'Enter' });
      expect(wrapper.find('.be-tag').text()).toContain('angular');
    });
  });

  describe('cover image', () => {
    it('shows "Replace" when coverImageUrl prop is provided', () => {
      const wrapper = mountEditor({ coverImageUrl: 'https://example.com/cover.jpg' });
      expect(wrapper.find('.be-cover__pick').text()).toContain('Replace');
    });

    it('shows "Choose image" when no coverImageUrl is provided', () => {
      const wrapper = mountEditor();
      expect(wrapper.find('.be-cover__pick').text()).toContain('Choose image');
    });
  });

  describe('toolbar', () => {
    it('renders 12 toolbar buttons', () => {
      const wrapper = mountEditor();
      expect(wrapper.findAll('.be-toolbar__btn')).toHaveLength(12);
    });
  });

  describe('series dropdown', () => {
    it('shows only None and New series options when no existingSeries provided', () => {
      const wrapper = mountEditor();
      const options = wrapper.findAll('option').map(o => o.text());
      expect(options).toEqual(['— None —', '+ New series…']);
    });

    it('shows existing series as options in the dropdown', () => {
      const wrapper = mountEditor({
        existingSeries: [
          { id: 'go-backend', title: 'Go Backend Series' },
          { id: 'angular-deep', title: 'Angular Deep Dives' },
        ],
      });
      const options = wrapper.findAll('option').map(o => o.text());
      expect(options).toContain('Go Backend Series');
      expect(options).toContain('Angular Deep Dives');
    });

    it('hides Part and Total inputs when series is None', () => {
      const wrapper = mountEditor();
      expect(wrapper.find('input[placeholder="e.g. go-backend"]').exists()).toBe(false);
      expect(wrapper.find('label[for]').exists() && wrapper.text().includes('Part')).toBe(false);
    });

    it('shows series ID and title inputs when New series is selected', async () => {
      const wrapper = mountEditor();
      await wrapper.find('select').setValue('__new__');
      await wrapper.find('select').trigger('change');
      expect(wrapper.find('input[placeholder="e.g. go-backend"]').exists()).toBe(true);
      expect(wrapper.find('input[placeholder="e.g. Go Backend Series"]').exists()).toBe(true);
    });

    it('hides series ID and title inputs when an existing series is selected', async () => {
      const wrapper = mountEditor({
        existingSeries: [{ id: 'go-backend', title: 'Go Backend Series' }],
      });
      await wrapper.find('select').setValue('go-backend');
      await wrapper.find('select').trigger('change');
      expect(wrapper.find('input[placeholder="e.g. go-backend"]').exists()).toBe(false);
    });
  });

  describe('series in published draft', () => {
    it('emits no series when series is None', async () => {
      const wrapper = mountEditor();
      await fillRequiredFields(wrapper);
      await wrapper.find('.be-publish').trigger('click');
      const draft = (wrapper.emitted('publish') as unknown[][])[0][0] as Record<string, unknown>;
      expect(draft.series).toBeUndefined();
    });

    it('emits series when New series is selected and ID is filled', async () => {
      const wrapper = mountEditor();
      await fillRequiredFields(wrapper);
      await wrapper.find('select').setValue('__new__');
      await wrapper.find('select').trigger('change');
      await wrapper.find('input[placeholder="e.g. go-backend"]').setValue('go-backend');
      await wrapper.find('input[placeholder="e.g. Go Backend Series"]').setValue('Go Backend Series');
      await wrapper.find('.be-publish').trigger('click');
      const draft = (wrapper.emitted('publish') as unknown[][])[0][0] as Record<string, unknown>;
      expect(draft.series).toEqual({ id: 'go-backend', title: 'Go Backend Series', part: 1, total: 1 });
    });

    it('emits correct series when an existing series is selected', async () => {
      const wrapper = mountEditor({
        existingSeries: [{ id: 'go-backend', title: 'Go Backend Series' }],
      });
      await fillRequiredFields(wrapper);
      await wrapper.find('select').setValue('go-backend');
      await wrapper.find('select').trigger('change');
      await wrapper.find('.be-publish').trigger('click');
      const draft = (wrapper.emitted('publish') as unknown[][])[0][0] as Record<string, unknown>;
      const series = draft.series as Record<string, unknown>;
      expect(series.id).toBe('go-backend');
      expect(series.title).toBe('Go Backend Series');
    });
  });

  describe('initialPost', () => {
    it('pre-fills fields from initialPost', () => {
      const post = makeBlogPost({
        title: 'Existing Post',
        slug: 'existing-post',
        summary: 'Existing summary',
        content: '# Heading\n\nBody text.',
      });
      const wrapper = mountEditor({ initialPost: post });
      const titleEl = wrapper.find('input[placeholder="Post title…"]')
        .element as HTMLInputElement;
      expect(titleEl.value).toBe('Existing Post');
      const slugEl = wrapper.find('input[placeholder="post-slug"]')
        .element as HTMLInputElement;
      expect(slugEl.value).toBe('existing-post');
    });
  });
});
