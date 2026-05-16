import { render, screen } from '@testing-library/angular';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  const currentYear = new Date().getFullYear();

  it('renders the brand name and current year in the copyright line', async () => {
    await render(FooterComponent, {
      inputs: { config: { brandName: 'Acme Corp', links: [] } },
    });
    expect(screen.getByText(new RegExp(`${currentYear}.*Acme Corp`))).toBeInTheDocument();
  });

  it('renders a github social link', async () => {
    await render(FooterComponent, {
      inputs: {
        config: {
          brandName: 'Acme',
          links: [{ type: 'github', href: 'https://github.com/acme', label: 'GitHub' }],
        },
      },
    });
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/acme');
  });

  it('renders a linkedin social link', async () => {
    await render(FooterComponent, {
      inputs: {
        config: {
          brandName: 'Acme',
          links: [{ type: 'linkedin', href: 'https://linkedin.com/company/acme', label: 'LinkedIn' }],
        },
      },
    });
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://linkedin.com/company/acme');
  });

  it('renders an email link', async () => {
    await render(FooterComponent, {
      inputs: {
        config: {
          brandName: 'Acme',
          links: [{ type: 'email', href: 'mailto:hello@acme.com', label: 'Email' }],
        },
      },
    });
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:hello@acme.com');
  });

  it('renders no social links when the links array is empty', async () => {
    const { container } = await render(FooterComponent, {
      inputs: { config: { brandName: 'Acme', links: [] } },
    });
    expect(container.querySelectorAll('.social-link').length).toBe(0);
  });
});
