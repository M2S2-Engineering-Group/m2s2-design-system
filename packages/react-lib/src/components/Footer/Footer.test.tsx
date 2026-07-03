import { render, screen } from '@testing-library/react';
import { makeFooterConfig, makeFooterSocialLink } from '@m2s2/utils/testing';
import { axe } from 'jest-axe';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the brand name in the copyright line', () => {
    render(<Footer config={makeFooterConfig({ brandName: 'Acme Corp' })} />);
    expect(screen.getByText(/Acme Corp/)).toBeInTheDocument();
  });

  it('renders the current year in the copyright line', () => {
    render(<Footer config={makeFooterConfig()} />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });

  it('renders a link for each social link', () => {
    const config = makeFooterConfig({
      links: [
        makeFooterSocialLink({ type: 'github', href: 'https://github.com/example', label: 'GitHub' }),
        makeFooterSocialLink({ type: 'linkedin', href: 'https://linkedin.com/in/example', label: 'LinkedIn' }),
      ],
    });
    render(<Footer config={config} />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/example');
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://linkedin.com/in/example');
  });

  it('renders no links when links array is empty', () => {
    render(<Footer config={makeFooterConfig({ links: [] })} />);
    expect(screen.queryAllByRole('link')).toHaveLength(0);
  });

  it('uses link type as aria-label when label is omitted', () => {
    const config = makeFooterConfig({
      links: [makeFooterSocialLink({ type: 'twitter', href: 'https://x.com/example', label: undefined })],
    });
    render(<Footer config={config} />);
    expect(screen.getByRole('link', { name: 'twitter' })).toBeInTheDocument();
  });

  it('renders the build version, stripped of build metadata, when present', () => {
    const config = makeFooterConfig({ buildVersion: '2.7.0+8f3a1c9' });
    render(<Footer config={config} />);
    expect(screen.getByText(/2\.7\.0/)).toBeInTheDocument();
  });

  it('renders no build version stamp when omitted', () => {
    const { container } = render(<Footer config={makeFooterConfig()} />);
    expect(container.querySelector('.footer-build')).not.toBeInTheDocument();
  });

  describe('accessibility', () => {
    it('has no violations (no links)', async () => {
      const { container } = render(<Footer config={makeFooterConfig({ links: [] })} />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no violations (with social links)', async () => {
      const config = makeFooterConfig({
        links: [
          makeFooterSocialLink({ type: 'github', href: 'https://github.com/example', label: 'GitHub' }),
          makeFooterSocialLink({ type: 'linkedin', href: 'https://linkedin.com/in/example', label: 'LinkedIn' }),
        ],
      });
      const { container } = render(<Footer config={config} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
