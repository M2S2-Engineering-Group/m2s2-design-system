import { render, screen } from '@testing-library/angular';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  const config = { title: 'About Us', subtitle: 'Learn more about our team' };

  it('renders the title in an h1', async () => {
    await render(PageHeaderComponent, { inputs: { config } });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('About Us');
  });

  it('applies the page-title class to the h1', async () => {
    await render(PageHeaderComponent, { inputs: { config } });
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('page-title');
  });

  it('renders the subtitle', async () => {
    await render(PageHeaderComponent, { inputs: { config } });
    expect(screen.getByText('Learn more about our team')).toBeInTheDocument();
  });

  it('applies the page-subtitle class to the subtitle', async () => {
    await render(PageHeaderComponent, { inputs: { config } });
    expect(screen.getByText('Learn more about our team')).toHaveClass('page-subtitle');
  });
});
