import { render, screen, fireEvent } from '@testing-library/angular';
import { BlogEditorComponent } from './blog-editor.component';

const renderEditor = (inputs: Record<string, unknown> = {}) =>
  render(BlogEditorComponent, { inputs });

describe('BlogEditorComponent', () => {
  describe('title and slug', () => {
    it('renders the title input', async () => {
      await renderEditor();
      expect(screen.getByPlaceholderText('Post title…')).toBeInTheDocument();
    });

    it('auto-generates the slug from the title', async () => {
      const { fixture } = await renderEditor();
      fireEvent.input(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'Hello World Post' },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.slug()).toBe('hello-world-post');
    });

    it('strips special characters when generating the slug', async () => {
      const { fixture } = await renderEditor();
      fireEvent.input(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'Héllo & Wörld!' },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.slug()).toBe('hllo-wrld');
    });

    it('stops auto-generating the slug once the user manually edits it', async () => {
      const { fixture } = await renderEditor();
      const slugInput = screen.getByPlaceholderText('post-slug');
      fireEvent.input(slugInput, { target: { value: 'my-custom-slug' } });
      fixture.detectChanges();
      fireEvent.input(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'Completely Different Title' },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.slug()).toBe('my-custom-slug');
    });
  });

  describe('tags', () => {
    it('adds a tag when Enter is pressed', async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText('Add tag, press Enter…');
      fireEvent.input(tagInput, { target: { value: 'angular' } });
      fixture.componentInstance.tagInput = 'angular';
      fireEvent.keyDown(tagInput, { key: 'Enter' });
      fixture.detectChanges();
      expect(screen.getByText('angular')).toBeInTheDocument();
    });

    it('adds a tag when comma is pressed', async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText('Add tag, press Enter…');
      fixture.componentInstance.tagInput = 'testing';
      fireEvent.keyDown(tagInput, { key: ',' });
      fixture.detectChanges();
      expect(screen.getByText('testing')).toBeInTheDocument();
    });

    it('does not add a duplicate tag', async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText('Add tag, press Enter…');
      fixture.componentInstance.tagInput = 'angular';
      fireEvent.keyDown(tagInput, { key: 'Enter' });
      fixture.detectChanges();
      fixture.componentInstance.tagInput = 'angular';
      fireEvent.keyDown(tagInput, { key: 'Enter' });
      fixture.detectChanges();
      const tagEls = document.querySelectorAll('.be-tag');
      expect(tagEls).toHaveLength(1);
    });

    it('removes a tag when its remove button is clicked', async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText('Add tag, press Enter…');
      fixture.componentInstance.tagInput = 'angular';
      fireEvent.keyDown(tagInput, { key: 'Enter' });
      fixture.detectChanges();
      fireEvent.click(screen.getByRole('button', { name: 'Remove tag' }));
      fixture.detectChanges();
      expect(screen.queryByText('angular')).not.toBeInTheDocument();
    });

    it('removes the last tag when Backspace is pressed in an empty tag input', async () => {
      const { fixture } = await renderEditor();
      const tagInput = screen.getByPlaceholderText('Add tag, press Enter…');
      fixture.componentInstance.tagInput = 'angular';
      fireEvent.keyDown(tagInput, { key: 'Enter' });
      fixture.detectChanges();
      fixture.componentInstance.tagInput = 'testing';
      fireEvent.keyDown(tagInput, { key: 'Enter' });
      fixture.detectChanges();
      fixture.componentInstance.tagInput = '';
      fireEvent.keyDown(tagInput, { key: 'Backspace' });
      fixture.detectChanges();
      expect(screen.queryByText('testing')).not.toBeInTheDocument();
      expect(screen.getByText('angular')).toBeInTheDocument();
    });
  });

  describe('publish button', () => {
    it('disables Publish when title is empty', async () => {
      await renderEditor();
      expect(screen.getByRole('button', { name: 'Publish Post' })).toBeDisabled();
    });

    it('disables Publish when summary is empty', async () => {
      const { fixture } = await renderEditor();
      fireEvent.input(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'A title' },
      });
      fixture.detectChanges();
      expect(screen.getByRole('button', { name: 'Publish Post' })).toBeDisabled();
    });

    it('enables Publish when title, summary, and content are all filled', async () => {
      const { fixture } = await renderEditor();
      fireEvent.input(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'A title' },
      });
      fixture.detectChanges();
      fireEvent.input(
        screen.getByPlaceholderText('Short description shown in blog listings…'),
        { target: { value: 'A summary' } },
      );
      fixture.detectChanges();
      fireEvent.input(screen.getByPlaceholderText('Write your post in markdown…'), {
        target: { value: 'Some content here.' },
      });
      fixture.detectChanges();
      expect(screen.getByRole('button', { name: 'Publish Post' })).not.toBeDisabled();
    });
  });

  describe('publish output', () => {
    const fillRequiredFields = async (fixture: { componentInstance: BlogEditorComponent; detectChanges: () => void }) => {
      fireEvent.input(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'My Post' },
      });
      fixture.detectChanges();
      fireEvent.input(
        screen.getByPlaceholderText('Short description shown in blog listings…'),
        { target: { value: 'Great summary' } },
      );
      fixture.detectChanges();
      fireEvent.input(screen.getByPlaceholderText('Write your post in markdown…'), {
        target: { value: 'Body content.' },
      });
      fixture.detectChanges();
    };

    it('emits publish without series when series ID is blank', async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.publish.subscribe(spy);
      await fillRequiredFields(fixture);
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      expect(spy).toHaveBeenCalledTimes(1);
      const draft = spy.mock.calls[0][0];
      expect(draft.title).toBe('My Post');
      expect(draft.summary).toBe('Great summary');
      expect(draft.content).toBe('Body content.');
      expect(draft.series).toBeUndefined();
    });

    it('emits publish with series when series ID is filled', async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.publish.subscribe(spy);
      await fillRequiredFields(fixture);
      fireEvent.input(screen.getByPlaceholderText('e.g. go-backend'), {
        target: { value: 'go-backend' },
      });
      fixture.detectChanges();
      fireEvent.input(screen.getByPlaceholderText('e.g. Go Backend Series'), {
        target: { value: 'Go Backend Series' },
      });
      fixture.detectChanges();
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      const draft = spy.mock.calls[0][0];
      expect(draft.series).toEqual({
        id: 'go-backend',
        title: 'Go Backend Series',
        part: 1,
        total: 1,
      });
    });

    it('uses series ID as series title when title is left blank', async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.publish.subscribe(spy);
      await fillRequiredFields(fixture);
      fireEvent.input(screen.getByPlaceholderText('e.g. go-backend'), {
        target: { value: 'my-series' },
      });
      fixture.detectChanges();
      fireEvent.click(screen.getByRole('button', { name: 'Publish Post' }));
      const draft = spy.mock.calls[0][0];
      expect(draft.series?.title).toBe('my-series');
    });
  });

  describe('export output', () => {
    it('emits exportDraft with the assembled draft', async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.exportDraft.subscribe(spy);
      fireEvent.input(screen.getByPlaceholderText('Post title…'), {
        target: { value: 'Export Me' },
      });
      fixture.detectChanges();
      fireEvent.input(
        screen.getByPlaceholderText('Short description shown in blog listings…'),
        { target: { value: 'Summary text' } },
      );
      fixture.detectChanges();
      fireEvent.input(screen.getByPlaceholderText('Write your post in markdown…'), {
        target: { value: 'Content body.' },
      });
      fixture.detectChanges();
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].title).toBe('Export Me');
    });

    it('does not emit exportDraft when required fields are missing', async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.exportDraft.subscribe(spy);
      fireEvent.click(screen.getByRole('button', { name: 'Export' }));
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('cover image', () => {
    it('emits coverImageSelected with the chosen File', async () => {
      const { fixture } = await renderEditor();
      const spy = jest.fn();
      fixture.componentInstance.coverImageSelected.subscribe(spy);
      const file = new File(['data'], 'cover.jpg', { type: 'image/jpeg' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      Object.defineProperty(input, 'files', { value: [file], configurable: true });
      fireEvent.change(input);
      expect(spy).toHaveBeenCalledWith(file);
    });
  });

  describe('initial post population', () => {
    it('pre-fills all fields when initialPost is provided', async () => {
      const { fixture } = await renderEditor({
        initialPost: {
          slug: 'existing-post',
          title: 'Existing Post',
          date: '2024-01-01',
          summary: 'Existing summary',
          tags: ['rust'],
          content: 'Existing content',
          series: { id: 'my-series', title: 'My Series', part: 3, total: 6 },
        },
      });
      fixture.detectChanges();
      expect(fixture.componentInstance.title()).toBe('Existing Post');
      expect(fixture.componentInstance.summary()).toBe('Existing summary');
      expect(fixture.componentInstance.seriesId()).toBe('my-series');
      expect(fixture.componentInstance.seriesPart()).toBe(3);
    });
  });
});
