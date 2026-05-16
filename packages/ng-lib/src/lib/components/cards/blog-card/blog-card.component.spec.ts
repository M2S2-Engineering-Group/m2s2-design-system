import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { BlogCardComponent } from './blog-card.component';

describe('BlogCardComponent', () => {
  const config = {
    slug: 'my-post',
    title: 'My First Post',
    date: '2024-06-15T12:00:00',
    summary: 'A brief summary of the post.',
    tags: ['Angular', 'Testing'],
  };

  const renderCard = (overrides = {}) =>
    render(BlogCardComponent, {
      inputs: { config: { ...config, ...overrides } },
      providers: [provideRouter([])],
    });

  it('renders the post title', async () => {
    await renderCard();
    expect(screen.getByText('My First Post')).toBeInTheDocument();
  });

  it('renders the formatted date', async () => {
    await renderCard();
    const expected = new Date('2024-06-15T12:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('renders the summary', async () => {
    await renderCard();
    expect(screen.getByText('A brief summary of the post.')).toBeInTheDocument();
  });

  it('renders all tags in the tag list', async () => {
    const { container } = await renderCard();
    const tags = container.querySelectorAll('.bc-tag');
    expect(tags[0]).toHaveTextContent('Angular');
    expect(tags[1]).toHaveTextContent('Testing');
  });

  it('renders a cover image when coverImage is provided', async () => {
    await renderCard({ coverImage: 'https://example.com/cover.jpg' });
    const img = screen.getByRole('img', { name: 'My First Post' });
    expect(img).toHaveAttribute('src', 'https://example.com/cover.jpg');
  });

  it('renders the reading time when provided', async () => {
    await renderCard({ readingTime: 5 });
    expect(screen.getByText('5 min read')).toBeInTheDocument();
  });

  it('does not render a reading time element when omitted', async () => {
    await renderCard();
    expect(screen.queryByText(/min read/)).not.toBeInTheDocument();
  });

  it('renders the placeholder cover with the first tag when no coverImage is provided', async () => {
    const { container } = await renderCard();
    expect(container.querySelector('.bc-cover-placeholder')).toBeInTheDocument();
    expect(container.querySelector('.bc-cover-tag')).toHaveTextContent('Angular');
  });
});
