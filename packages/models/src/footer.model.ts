export type SocialLinkType = 'github' | 'linkedin' | 'twitter' | 'email';

export interface FooterSocialLink {
  type: SocialLinkType;
  /** Full URL or mailto: address */
  href: string;
  /** Accessible label — defaults to the type name if omitted */
  label?: string;
}

export interface FooterConfig {
  /** Shown in the copyright line: © {year} {brandName} — All Rights Reserved */
  brandName: string;
  links: FooterSocialLink[];
  /** Optional build version shown as a dim stamp in the footer */
  buildVersion?: string;
}
