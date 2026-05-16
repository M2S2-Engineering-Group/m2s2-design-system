import { render, screen } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { CtaSectionComponent } from './cta-section.component';

describe('CtaSectionComponent', () => {
  const config = {
    title: 'Ready to get started?',
    body: 'Join us today and build something great.',
    label: 'Get Started',
    route: '/contact',
  };

  const renderCta = () =>
    render(CtaSectionComponent, {
      inputs: { config },
      providers: [provideRouter([])],
    });

  it('renders the title', async () => {
    await renderCta();
    expect(screen.getByText('Ready to get started?')).toBeInTheDocument();
  });

  it('renders the body', async () => {
    await renderCta();
    expect(screen.getByText('Join us today and build something great.')).toBeInTheDocument();
  });

  it('renders the CTA button with the correct label', async () => {
    await renderCta();
    expect(screen.getByRole('link', { name: 'Get Started' })).toBeInTheDocument();
  });

  it('applies the cta-title and cta-body classes', async () => {
    await renderCta();
    expect(screen.getByText('Ready to get started?')).toHaveClass('cta-title');
    expect(screen.getByText('Join us today and build something great.')).toHaveClass('cta-body');
  });
});
