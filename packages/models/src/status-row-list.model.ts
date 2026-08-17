export interface StatusRowLink {
  label: string;
  href: string;
}

export interface StatusRowItem {
  id: string;
  label: string;
  status: string;
  /** Extra detail text shown below the label, e.g. an error message. */
  detail?: string;
  link?: StatusRowLink;
}
