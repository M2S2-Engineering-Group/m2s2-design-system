import type {
  BlogCardConfig,
  BlogDraft,
  BlogPost,
  CardVariant,
  ChatMessage,
  ColumnDef,
  CtaConfig,
  DialogAction,
  FeatureCardConfig,
  FooterConfig,
  FooterSocialLink,
  M2S2DialogData,
  M2S2PanelData,
  NavbarButton,
  NavbarConfig,
  NavbarLoginButton,
  PageHeaderConfig,
  ProcessStep,
  SectionHeaderConfig,
  StatItem,
} from '@m2s2/models';

export const makeBlogCardConfig = (overrides?: Partial<BlogCardConfig>): BlogCardConfig => ({
  slug: 'my-post',
  title: 'My First Post',
  date: '2024-06-15',
  summary: 'A brief summary of the post.',
  tags: ['testing', 'typescript'],
  ...overrides,
});

export const makeBlogPost = (overrides?: Partial<BlogPost>): BlogPost => ({
  ...makeBlogCardConfig(overrides),
  content: '# Heading\n\nBody text.',
  ...overrides,
});

export const makeBlogDraft = (overrides?: Partial<BlogDraft>): BlogDraft => ({
  title: 'Draft Post',
  slug: 'draft-post',
  date: '2024-06-15',
  summary: 'Draft summary.',
  tags: ['draft'],
  readingTime: 3,
  content: 'Draft body content.',
  ...overrides,
});

export const makeFeatureCardConfig = (overrides?: Partial<FeatureCardConfig>): FeatureCardConfig => ({
  title: 'Feature Title',
  body: 'Feature description.',
  ...overrides,
});

export const makeCardVariant = (): CardVariant => 'default';

export const makeNavbarButton = (overrides?: Partial<NavbarButton>): NavbarButton => ({
  id: 'btn-1',
  title: 'Home',
  href: '/',
  requiresAuth: false,
  ...overrides,
});

export const makeNavbarLoginButton = (overrides?: Partial<NavbarLoginButton>): NavbarLoginButton => ({
  dropdownItems: [],
  ...overrides,
});

export const makeNavbarConfig = (overrides?: Partial<NavbarConfig>): NavbarConfig => ({
  brand: 'Acme Corp',
  brandPath: '/',
  isFixed: false,
  buttons: [],
  ...overrides,
});

export const makeSectionHeaderConfig = (overrides?: Partial<SectionHeaderConfig>): SectionHeaderConfig => ({
  label: 'Section Label',
  ...overrides,
});

export const makePageHeaderConfig = (overrides?: Partial<PageHeaderConfig>): PageHeaderConfig => ({
  title: 'Page Title',
  subtitle: 'Page subtitle.',
  ...overrides,
});

export const makeCtaConfig = (overrides?: Partial<CtaConfig>): CtaConfig => ({
  title: 'Ready to get started?',
  body: 'Join us today.',
  label: 'Get Started',
  route: '/contact',
  ...overrides,
});

export const makeDialogAction = (overrides?: Partial<DialogAction>): DialogAction => ({
  label: 'OK',
  value: 'ok',
  variant: 'primary',
  ...overrides,
});

export const makeM2S2DialogData = (overrides?: Partial<M2S2DialogData>): M2S2DialogData => ({
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  actions: [makeDialogAction({ label: 'Cancel', value: 'cancel', variant: 'secondary' }), makeDialogAction()],
  ...overrides,
});

export const makeM2S2PanelData = (overrides?: Partial<M2S2PanelData>): M2S2PanelData => ({
  title: 'Panel Title',
  message: 'Panel message.',
  actions: [makeDialogAction()],
  modal: false,
  side: 'right',
  ...overrides,
});

export const makeProcessStep = (overrides?: Partial<ProcessStep>): ProcessStep => ({
  num: '01',
  name: 'Step Name',
  desc: 'Step description.',
  ...overrides,
});

export const makeStatItem = (overrides?: Partial<StatItem>): StatItem => ({
  value: '100',
  label: 'Metric',
  ...overrides,
});

export const makeFooterSocialLink = (overrides?: Partial<FooterSocialLink>): FooterSocialLink => ({
  type: 'github',
  href: 'https://github.com/example',
  label: 'GitHub',
  ...overrides,
});

export const makeFooterConfig = (overrides?: Partial<FooterConfig>): FooterConfig => ({
  brandName: 'Acme Corp',
  links: [makeFooterSocialLink()],
  ...overrides,
});

export const makeChatMessage = (overrides?: Partial<ChatMessage>): ChatMessage => ({
  role: 'user',
  content: 'Hello!',
  ...overrides,
});

export const makeColumnDef = (overrides?: Partial<ColumnDef>): ColumnDef => ({
  key: 'name',
  label: 'Name',
  ...overrides,
});

// ── Batch helpers ───────────────────────────────────────────────────────────

export const makeBlogPosts = (count = 3): BlogPost[] =>
  Array.from({ length: count }, (_, i) =>
    makeBlogPost({ slug: `post-${i}`, title: `Post ${i + 1}`, tags: ['tag'] }),
  );

export const makeProcessSteps = (count = 3): ProcessStep[] =>
  Array.from({ length: count }, (_, i) =>
    makeProcessStep({ num: String(i + 1).padStart(2, '0'), name: `Step ${i + 1}`, desc: `Description ${i + 1}.` }),
  );

export const makeStatItems = (count = 3): StatItem[] =>
  Array.from({ length: count }, (_, i) =>
    makeStatItem({ value: `${(i + 1) * 100}`, label: `Metric ${i + 1}` }),
  );

export const makeColumnDefs = (count = 3): ColumnDef[] =>
  Array.from({ length: count }, (_, i) =>
    makeColumnDef({ key: `col${i}`, label: `Column ${i + 1}` }),
  );

export const makeChatConversation = (): ChatMessage[] => [
  makeChatMessage({ role: 'user', content: 'Hello!' }),
  makeChatMessage({ role: 'assistant', content: 'Hi there! How can I help?' }),
];
