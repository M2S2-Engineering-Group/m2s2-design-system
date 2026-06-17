import { render, screen, fireEvent } from '@testing-library/react';
import { BlogEditor } from './BlogEditor';
import { makeBlogPost } from '@m2s2/utils/testing';

const renderEditor = (props: React.ComponentProps<typeof BlogEditor> = {}) =>
  render(<BlogEditor {...props} />);

describe('BlogEditor', () => {
  describe('renders fields', () => {
    it('renders the title input', () => {
      renderEditor();
      expect(screen.getByPlaceholderText('Post title…')).toBeInTheDocument();
    });

    it('renders the slug input', () => {
      renderEditor();
      expect(screen.getByPlaceholderText('post-slug')).toBeInTheDocument();
    });

    it('renders a date input', () => {
      renderEditor();
      expect(document.querySelector('input[type="date"]')).toBeInTheDocument();
    });

    it('renders the summary textarea', () => {
      renderEditor();
      expect(
        screen.getByPlaceholderText('Short description shown in blog listings…'),
      ).toBeInTheDocument();
    });
  });

  describe('Publish button state', () => {
    it('is disabled when title is empty', () => {
      renderEditor();
      expect(screen.getByRole('button', { name: 'Publish Post' })).toBeDisabled();
    });

    it('is disabled when summary is empty', () => {
      renderEditor();
      fireEvent.change(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'A title' },
      });
      expect(screen.getByRole('button', { name: 'Publish Post' })).toBeDisabled();
    });

    it('is enabled when title, summary, and content are all filled', () => {
      renderEditor();
      fireEvent.change(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'A title' },
      });
      fireEvent.change(
        screen.getByPlaceholderText('Short description shown in blog listings…'),
        { target: { value: 'A summary' } },
      );
      fireEvent.change(screen.getByPlaceholderText('Write your post in markdown…'), {
        target: { value: 'Some content here.' },
      });
      expect(screen.getByRole('button', { name: 'Publish Post' })).not.toBeDisabled();
    });
  });

  describe('onPublish callback', () => {
    it('fires with the correct draft when Publish is clicked', () => {
      const onPublish = vi.fn();
      renderEditor({ onPublish });
      fireEvent.change(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'My Post' },
      });
      fireEvent.change(
        screen.getByPlaceholderText('Short description shown in blog listings…'),
        { target: { value: 'Great summary' } },
      );
      fireEvent.change(screen.getByPlaceholderText('Write your post in markdown…'), {
        target: { value: 'Body content.' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      expect(onPublish).toHaveBeenCalledTimes(1);
      const draft = onPublish.mock.calls[0][0];
      expect(draft.title).toBe('My Post');
      expect(draft.summary).toBe('Great summary');
      expect(draft.content).toBe('Body content.');
    });

    it('does not fire when canPublish is false', () => {
      const onPublish = vi.fn();
      renderEditor({ onPublish });
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      expect(onPublish).not.toHaveBeenCalled();
    });
  });

  describe('slug auto-generation', () => {
    it('auto-generates slug from the title', () => {
      renderEditor();
      fireEvent.change(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'Hello World Post' },
      });
      expect(
        (screen.getByPlaceholderText('post-slug') as HTMLInputElement).value,
      ).toBe('hello-world-post');
    });

    it('stops auto-generating once the user manually edits the slug', () => {
      renderEditor();
      fireEvent.change(screen.getByPlaceholderText('post-slug'), {
        target: { value: 'my-custom-slug' },
      });
      fireEvent.change(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'Completely Different' },
      });
      expect(
        (screen.getByPlaceholderText('post-slug') as HTMLInputElement).value,
      ).toBe('my-custom-slug');
    });
  });

  describe('reading time', () => {
    it('updates reading time when content changes', () => {
      renderEditor();
      // 200+ words causes readingTime > 1
      const longContent = 'word '.repeat(300);
      fireEvent.change(screen.getByPlaceholderText('Write your post in markdown…'), {
        target: { value: longContent },
      });
      expect(screen.getByText(/\d+ min read/)).toBeInTheDocument();
    });
  });

  describe('tags', () => {
    it('adds a tag when Enter is pressed in the tag input', () => {
      renderEditor();
      const tagInput = screen.getByPlaceholderText('Add tag, press Enter…');
      fireEvent.change(tagInput, { target: { value: 'angular' } });
      fireEvent.keyDown(tagInput, { key: 'Enter' });
      expect(screen.getByText('angular')).toBeInTheDocument();
    });

    it('removes the last tag when Backspace is pressed in an empty tag input', () => {
      renderEditor();
      const tagInput = screen.getByPlaceholderText('Add tag, press Enter…');
      fireEvent.change(tagInput, { target: { value: 'angular' } });
      fireEvent.keyDown(tagInput, { key: 'Enter' });
      fireEvent.change(tagInput, { target: { value: 'react' } });
      fireEvent.keyDown(tagInput, { key: 'Enter' });
      // tagInput is now empty after adding; press Backspace
      fireEvent.keyDown(tagInput, { key: 'Backspace' });
      expect(screen.queryByText('react')).not.toBeInTheDocument();
      expect(screen.getByText('angular')).toBeInTheDocument();
    });
  });

  describe('cover image', () => {
    it('shows "Replace" label when coverImageUrl prop is provided', () => {
      renderEditor({ coverImageUrl: 'https://example.com/cover.jpg' });
      expect(screen.getByText('Replace')).toBeInTheDocument();
    });

    it('shows "Choose image" label when no coverImageUrl is provided', () => {
      renderEditor();
      expect(screen.getByText('Choose image')).toBeInTheDocument();
    });
  });

  describe('toolbar', () => {
    it('renders 12 toolbar buttons', () => {
      renderEditor();
      const toolbar = screen.getByRole('toolbar', { name: 'Formatting' });
      expect(toolbar.querySelectorAll('button')).toHaveLength(12);
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
      renderEditor({ initialPost: post });
      expect(
        (screen.getByPlaceholderText('Post title…') as HTMLInputElement).value,
      ).toBe('Existing Post');
      expect(
        (screen.getByPlaceholderText('post-slug') as HTMLInputElement).value,
      ).toBe('existing-post');
    });
  });
});
