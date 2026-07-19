import { ref } from "vue";
import type { Meta, StoryObj } from "@storybook/vue3";
import type {
  NavbarConfig,
  AnchorDropdownItem,
  ClickableDropdownItem,
} from "@m2s2/models";
import Navbar from "./Navbar.vue";

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};
export default meta;

const BASE_CONFIG: NavbarConfig = {
  brand: "M²S²",
  brandPath: "/",
  isFixed: false,
  buttons: [
    { id: "home", title: "Home", href: "/" },
    { id: "services", title: "Services", href: "/services" },
    {
      id: "resources",
      title: "Resources",
      isDropdown: true,
      dropdownItems: [
        { id: "blog", text: "Blog", href: "/blog" } as AnchorDropdownItem,
        {
          id: "docs",
          text: "Documentation",
          href: "/docs",
        } as AnchorDropdownItem,
        {
          id: "github",
          text: "GitHub",
          href: "https://github.com/M2S2-Engineering-Group",
        } as AnchorDropdownItem,
      ],
    },
    { id: "contact", title: "Contact", href: "/contact" },
  ],
  loginButton: {
    dropdownItems: [
      {
        id: "login",
        text: "Sign in",
        requiresAuth: false,
        onClick: () => {},
      } as ClickableDropdownItem,
      {
        id: "logout",
        text: "Sign out",
        requiresAuth: true,
        onClick: () => {},
      } as ClickableDropdownItem,
      {
        id: "profile",
        text: "Profile",
        requiresAuth: true,
        href: "/profile",
      } as AnchorDropdownItem,
    ],
  },
};

export const LoggedOut: StoryObj = {
  name: "Logged out",
  render: () => ({
    components: { Navbar },
    setup() {
      return { config: BASE_CONFIG };
    },
    template: `
      <div style="min-height: 200px;">
        <Navbar :config="config" :logged-in="false" />
        <div style="padding: 24px; color: var(--color-on-surface-muted); font-size: 0.875rem;">
          Logged out. Click the account icon → Sign in.
        </div>
      </div>
    `,
  }),
};

export const LoggedIn: StoryObj = {
  name: "Logged in",
  render: () => ({
    components: { Navbar },
    setup() {
      const loggedIn = ref(true);

      const config: NavbarConfig = {
        ...BASE_CONFIG,
        loginButton: {
          userName: "Jane Smith",
          dropdownItems: [
            {
              id: "login",
              text: "Sign in",
              requiresAuth: false,
              onClick: () => {
                loggedIn.value = true;
              },
            } as ClickableDropdownItem,
            {
              id: "logout",
              text: "Sign out",
              requiresAuth: true,
              onClick: () => {
                loggedIn.value = false;
              },
            } as ClickableDropdownItem,
            {
              id: "profile",
              text: "Profile",
              requiresAuth: true,
              href: "/profile",
            } as AnchorDropdownItem,
          ],
        },
      };

      return { config, loggedIn };
    },
    template: `
      <div style="min-height: 200px;">
        <Navbar :config="config" :logged-in="loggedIn" />
        <div style="padding: 24px; color: var(--color-on-surface-muted); font-size: 0.875rem;">
          {{ loggedIn ? 'Logged in as Jane Smith. Click "Sign out" in the account menu.' : 'Logged out. Click the account icon → Sign in.' }}
        </div>
      </div>
    `,
  }),
};

export const WithLogo: StoryObj = {
  name: "With logo image",
  render: () => ({
    components: { Navbar },
    setup() {
      return {
        config: { ...BASE_CONFIG, brandLogo: "/assets/logo-placeholder.svg" },
      };
    },
    template: `
      <div style="min-height: 200px;">
        <Navbar :config="config" :logged-in="false" />
      </div>
    `,
  }),
};

export const WithAvatar: StoryObj = {
  name: "With profile avatar",
  render: () => ({
    components: { Navbar },
    setup() {
      const config: NavbarConfig = {
        ...BASE_CONFIG,
        loginButton: {
          userName: "Jane Smith",
          profileImageUrl: "/assets/avatar-placeholder.svg",
          dropdownItems: [
            {
              id: "logout",
              text: "Sign out",
              requiresAuth: true,
              onClick: () => {},
            } as ClickableDropdownItem,
            {
              id: "profile",
              text: "Profile",
              requiresAuth: true,
              href: "/profile",
            } as AnchorDropdownItem,
          ],
        },
      };
      return { config };
    },
    template: `
      <div style="min-height: 200px;">
        <Navbar :config="config" :logged-in="true" />
      </div>
    `,
  }),
};
