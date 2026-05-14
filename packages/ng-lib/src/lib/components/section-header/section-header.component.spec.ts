import { render, screen } from '@testing-library/angular';
import { SectionHeaderComponent } from './section-header.component';

describe('SectionHeaderComponent', () => {
  it('renders the label in an h2', async () => {
    await render(SectionHeaderComponent, { inputs: { config: { label: 'Our Services' } } });
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Our Services');
  });

  it('applies the sh-label class to the heading', async () => {
    await render(SectionHeaderComponent, { inputs: { config: { label: 'Test' } } });
    expect(screen.getByRole('heading')).toHaveClass('sh-label');
  });

  it('renders the subtitle when provided', async () => {
    await render(SectionHeaderComponent, { inputs: { config: { label: 'Test', subtitle: 'A subtitle' } } });
    expect(screen.getByText('A subtitle')).toBeInTheDocument();
  });

  it('applies the sh-subtitle class to the subtitle', async () => {
    await render(SectionHeaderComponent, { inputs: { config: { label: 'Test', subtitle: 'Sub' } } });
    expect(screen.getByText('Sub')).toHaveClass('sh-subtitle');
  });

  it('does not render a subtitle element when omitted', async () => {
    const { container } = await render(SectionHeaderComponent, { inputs: { config: { label: 'Test' } } });
    expect(container.querySelector('p')).not.toBeInTheDocument();
  });
});
