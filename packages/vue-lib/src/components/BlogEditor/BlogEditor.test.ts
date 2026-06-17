import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import BlogEditor from './BlogEditor.vue';
import { makeBlogPost } from '@m2s2/utils/testing';

const mountEditor = (props: Record<string, unknown> = {}) =>
  mount(BlogEditor, { props });

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
      await wrapper.find('input[placeholder="Post title…"]').setValue('My Post');
      // setValue triggers input but onTitleChange is bound to @input — trigger it
      await wrapper.find('input[placeholder="Post title…"]').trigger('input');
      await wrapper
        .find('textarea[placeholder="Short description shown in blog listings…"]')
        .setValue('Great summary');
      await wrapper
        .find('textarea[placeholder="Write your post in markdown…"]')
        .setValue('Body content.');
      await wrapper
        .find('textarea[placeholder="Write your post in markdown…"]')
        .trigger('input');
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
