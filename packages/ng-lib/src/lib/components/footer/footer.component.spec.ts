import { render, screen } from '@testing-library/angular';
import { axe } from 'jest-axe';
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

  it('renders the build version, stripped of build metadata, when present', async () => {
    await render(FooterComponent, {
      inputs: { config: { brandName: 'Acme', links: [], buildVersion: '2.9.1+8f3a1c9' } },
    });
    expect(screen.getByText(/2\.9\.1/)).toBeInTheDocument();
  });

  it('renders no build version stamp when omitted', async () => {
    const { container } = await render(FooterComponent, {
      inputs: { config: { brandName: 'Acme', links: [] } },
    });
    expect(container.querySelector('.footer-build')).toBeNull();
  });

  describe('accessibility', () => {
    it('has no violations with no links', async () => {
      const { container } = await render(FooterComponent, {
        inputs: { config: { brandName: 'Acme Corp', links: [] } },
      });
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations with social links', async () => {
      const { container } = await render(FooterComponent, {
        inputs: {
          config: {
            brandName: 'Acme',
            links: [
              { type: 'github', href: 'https://github.com/acme', label: 'GitHub' },
              { type: 'linkedin', href: 'https://linkedin.com/company/acme', label: 'LinkedIn' },
            ],
          },
        },
      });
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
