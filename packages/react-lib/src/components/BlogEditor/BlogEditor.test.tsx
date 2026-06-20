import { render, screen, fireEvent } from '@testing-library/react';
import { BlogEditor } from './BlogEditor';
import { makeBlogPost } from '@m2s2/utils/testing';

function selectComboboxValue(value: string) {
  const select = screen.getByRole('combobox') as HTMLSelectElement;
  select.value = value;
  fireEvent.change(select);
}

const renderEditor = (props: React.ComponentProps<typeof BlogEditor> = {}) =>
  render(<BlogEditor {...props} />);

const fillRequiredFields = () => {
  fireEvent.change(screen.getByPlaceholderText('Post title…'), { target: { value: 'My Post' } });
  fireEvent.change(
    screen.getByPlaceholderText('Short description shown in blog listings…'),
    { target: { value: 'Great summary' } },
  );
  fireEvent.change(screen.getByPlaceholderText('Write your post in markdown…'), {
    target: { value: 'Body content.' },
  });
};

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
      fillRequiredFields();
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

  describe('series dropdown', () => {
    it('shows only None and New series options when no existingSeries provided', () => {
      renderEditor();
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.text);
      expect(options).toEqual(['— None —', '+ New series…']);
    });

    it('shows existing series as options in the dropdown', () => {
      renderEditor({
        existingSeries: [
          { id: 'go-backend', title: 'Go Backend Series' },
          { id: 'angular-deep', title: 'Angular Deep Dives' },
        ],
      });
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      const options = Array.from(select.options).map(o => o.text);
      expect(options).toContain('Go Backend Series');
      expect(options).toContain('Angular Deep Dives');
    });

    it('hides Part and Total inputs when series is None', () => {
      renderEditor();
      expect(screen.queryByLabelText('Part')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Total Parts')).not.toBeInTheDocument();
    });

    it('shows Part and Total inputs after selecting New series', () => {
      renderEditor();
      selectComboboxValue('__new__');
      expect(screen.getByLabelText('Part')).toBeInTheDocument();
      expect(screen.getByLabelText('Total Parts')).toBeInTheDocument();
    });

    it('shows Part and Total inputs after selecting an existing series', () => {
      renderEditor({ existingSeries: [{ id: 'go-backend', title: 'Go Backend Series' }] });
      selectComboboxValue('go-backend');
      expect(screen.getByLabelText('Part')).toBeInTheDocument();
      expect(screen.getByLabelText('Total Parts')).toBeInTheDocument();
    });

    it('hides series ID and title text inputs when an existing series is selected', () => {
      renderEditor({ existingSeries: [{ id: 'go-backend', title: 'Go Backend Series' }] });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'go-backend' } });
      expect(screen.queryByPlaceholderText('e.g. go-backend')).not.toBeInTheDocument();
    });

    it('shows series ID and title text inputs when New series is selected', () => {
      renderEditor();
      selectComboboxValue('__new__');
      expect(screen.getByPlaceholderText('e.g. go-backend')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('e.g. Go Backend Series')).toBeInTheDocument();
    });
  });

  describe('series in published draft', () => {
    it('emits no series when series is None', () => {
      const onPublish = vi.fn();
      renderEditor({ onPublish });
      fillRequiredFields();
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      expect(onPublish.mock.calls[0][0].series).toBeUndefined();
    });

    it('emits series when New series is selected and fields are filled', () => {
      const onPublish = vi.fn();
      renderEditor({ onPublish });
      fillRequiredFields();
      selectComboboxValue('__new__');
      fireEvent.change(screen.getByPlaceholderText('e.g. go-backend'), {
        target: { value: 'go-backend' },
      });
      fireEvent.change(screen.getByPlaceholderText('e.g. Go Backend Series'), {
        target: { value: 'Go Backend Series' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      expect(onPublish.mock.calls[0][0].series).toEqual({
        id: 'go-backend', title: 'Go Backend Series', part: 1, total: 1,
      });
    });

    it('uses series ID as title when New series title is left blank', () => {
      const onPublish = vi.fn();
      renderEditor({ onPublish });
      fillRequiredFields();
      selectComboboxValue('__new__');
      fireEvent.change(screen.getByPlaceholderText('e.g. go-backend'), {
        target: { value: 'my-series' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      expect(onPublish.mock.calls[0][0].series?.title).toBe('my-series');
    });

    it('emits correct series when an existing series is selected', () => {
      const onPublish = vi.fn();
      renderEditor({
        onPublish,
        existingSeries: [{ id: 'go-backend', title: 'Go Backend Series' }],
      });
      fillRequiredFields();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: 'go-backend' } });
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      const series = onPublish.mock.calls[0][0].series;
      expect(series?.id).toBe('go-backend');
      expect(series?.title).toBe('Go Backend Series');
    });

    it('emits no series when New series is selected but ID is blank', () => {
      const onPublish = vi.fn();
      renderEditor({ onPublish });
      fillRequiredFields();
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '__new__' } });
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      expect(onPublish.mock.calls[0][0].series).toBeUndefined();
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

    it('selects the matching existing series when initialPost series is in existingSeries', () => {
      const post = makeBlogPost({
        series: { id: 'go-backend', title: 'Go Backend Series', part: 2, total: 4 },
      });
      renderEditor({
        initialPost: post,
        existingSeries: [{ id: 'go-backend', title: 'Go Backend Series' }],
      });
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('go-backend');
    });

    it('falls back to New series when initialPost series is not in existingSeries', () => {
      const post = makeBlogPost({
        series: { id: 'go-backend', title: 'Go Backend Series', part: 1, total: 3 },
      });
      renderEditor({ initialPost: post, existingSeries: [] });
      const select = screen.getByRole('combobox') as HTMLSelectElement;
      expect(select.value).toBe('__new__');
    });
  });
});
