import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
import { FeatureCardComponent } from './feature-card.component';

describe('FeatureCardComponent', () => {
  const base = { title: 'Fast Delivery', body: 'We ship on time, every time.' };

  it('renders the title', async () => {
    await render(FeatureCardComponent, { inputs: { config: base } });
    expect(screen.getByText('Fast Delivery')).toBeInTheDocument();
  });

  it('renders the body', async () => {
    await render(FeatureCardComponent, { inputs: { config: base } });
    expect(screen.getByText('We ship on time, every time.')).toBeInTheDocument();
  });

  it('renders the items list when provided', async () => {
    const config = { ...base, items: ['Item A', 'Item B', 'Item C'] };
    await render(FeatureCardComponent, { inputs: { config } });
    expect(screen.getByText('Item A')).toBeInTheDocument();
    expect(screen.getByText('Item B')).toBeInTheDocument();
    expect(screen.getByText('Item C')).toBeInTheDocument();
  });

  it('does not render a list when items is omitted', async () => {
    const { container } = await render(FeatureCardComponent, { inputs: { config: base } });
    expect(container.querySelector('.fc-list')).not.toBeInTheDocument();
  });

  it('renders the note when provided', async () => {
    const config = { ...base, note: 'Terms apply.' };
    await render(FeatureCardComponent, { inputs: { config } });
    expect(screen.getByText('Terms apply.')).toBeInTheDocument();
  });

  it('renders the icon element when icon is provided', async () => {
    const config = { ...base, icon: '⭐' };
    const { container } = await render(FeatureCardComponent, { inputs: { config } });
    expect(container.querySelector('.fc-icon')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    it('has no violations with basic card', async () => {
      const { container } = await render(FeatureCardComponent, { inputs: { config: base } });
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with items list', async () => {
      const config = { ...base, items: ['Item A', 'Item B', 'Item C'] };
      const { container } = await render(FeatureCardComponent, { inputs: { config } });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
