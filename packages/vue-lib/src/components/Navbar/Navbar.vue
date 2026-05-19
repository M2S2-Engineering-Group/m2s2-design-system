<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { NavbarConfig, NavbarButton, DropdownItem, AnchorDropdownItem, ClickableDropdownItem } from '@m2s2/models';

const props = withDefaults(defineProps<{
  config: NavbarConfig;
  loggedIn?: boolean;
}>(), {
  loggedIn: false,
});

const scrolled = ref(false);
const hidden = ref(false);
const mobileOpen = ref(false);
const openDropdownId = ref<string | null>(null);
const lastScrollY = ref(0);

function isVisible(item: NavbarButton | DropdownItem): boolean {
  return !item.requiresAuth || props.loggedIn;
}

function isAnchorItem(item: DropdownItem): item is AnchorDropdownItem {
  return 'href' in item;
}

function isClickableItem(item: DropdownItem): item is ClickableDropdownItem {
  return 'onClick' in item;
}

function toggleDropdown(id: string): void {
  openDropdownId.value = openDropdownId.value === id ? null : id;
}

function closeDropdowns(): void {
  openDropdownId.value = null;
}

function onScroll(): void {
  const y = window.scrollY;
  const delta = y - lastScrollY.value;
  scrolled.value = y > 80;
  if (y < 80) hidden.value = false;
  else if (delta > 4) hidden.value = true;
  else if (delta < -4) hidden.value = false;
  lastScrollY.value = y;
}

function onResize(): void {
  if (window.innerWidth > 991) mobileOpen.value = false;
}

function onDocClick(e: MouseEvent): void {
  const target = e.target as HTMLElement;
  if (!target.closest('.navbar-dropdown-wrap')) {
    closeDropdowns();
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  document.addEventListener('click', onDocClick);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  document.removeEventListener('click', onDocClick);
});
</script>

<template>
  <header
    class="navbar"
    :class="{
      'navbar--scrolled': scrolled,
      'navbar--hidden': hidden,
      'navbar--fixed': config.isFixed,
    }"
  >
    <!-- Brand -->
    <a class="navbar-brand" :href="config.brandPath">
      <img
        v-if="config.brandLogo"
        :src="config.brandLogo"
        :alt="config.brand"
        class="navbar-brand-logo"
      />
      <span v-else class="navbar-brand-text">{{ config.brand }}</span>
    </a>

    <span class="navbar-spacer" />

    <!-- Desktop nav -->
    <nav class="navbar-desktop" aria-label="Main navigation">
      <template v-for="btn in config.buttons" :key="btn.id">
        <template v-if="isVisible(btn)">
          <!-- Regular link -->
          <a
            v-if="!btn.isDropdown"
            class="navbar-nav-btn"
            :href="btn.href"
            v-bind="btn.href?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
          >
            {{ btn.title }}
          </a>

          <!-- Dropdown -->
          <div v-else class="navbar-dropdown-wrap">
            <button
              class="navbar-nav-btn navbar-nav-btn--dropdown"
              :aria-expanded="openDropdownId === btn.id"
              @click.stop="toggleDropdown(btn.id)"
            >
              {{ btn.title }} <span class="navbar-chevron" aria-hidden="true">▾</span>
            </button>
            <div v-if="openDropdownId === btn.id" class="navbar-dropdown-content">
              <template v-for="item in btn.dropdownItems" :key="item.id">
                <a
                  v-if="isAnchorItem(item)"
                  class="navbar-dropdown-item"
                  :href="item.href"
                  v-bind="item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                  @click="closeDropdowns"
                >
                  <img v-if="item.imgSrc" :src="item.imgSrc" :alt="item.text" class="navbar-dropdown-img" />
                  {{ item.text }}
                </a>
                <button
                  v-else-if="isClickableItem(item)"
                  class="navbar-dropdown-item"
                  @click="() => { item.onClick(); closeDropdowns(); }"
                >
                  <img v-if="item.imgSrc" :src="item.imgSrc" :alt="item.text" class="navbar-dropdown-img" />
                  {{ item.text }}
                </button>
              </template>
            </div>
          </div>
        </template>
      </template>
    </nav>

    <!-- Account menu -->
    <div v-if="config.loginButton" class="navbar-dropdown-wrap">
      <button
        class="navbar-icon-btn"
        aria-label="Account menu"
        :aria-expanded="openDropdownId === '__account__'"
        @click.stop="toggleDropdown('__account__')"
      >
        <img
          v-if="config.loginButton.profileImageUrl"
          :src="config.loginButton.profileImageUrl"
          alt="Profile"
          class="navbar-avatar"
        />
        <svg v-else class="navbar-account-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
        </svg>
      </button>
      <div v-if="openDropdownId === '__account__'" class="navbar-dropdown-content">
        <div v-if="config.loginButton.userName && loggedIn" class="navbar-dropdown-user">
          {{ config.loginButton.userName }}
        </div>
        <template v-for="item in config.loginButton.dropdownItems" :key="item.id">
          <a
            v-if="isAnchorItem(item) && isVisible(item)"
            class="navbar-dropdown-item"
            :href="item.href"
            v-bind="item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
            @click="closeDropdowns"
          >
            <img v-if="item.imgSrc" :src="item.imgSrc" :alt="item.text" class="navbar-dropdown-img" />
            {{ item.text }}
          </a>
          <button
            v-else-if="isClickableItem(item) && isVisible(item)"
            class="navbar-dropdown-item"
            @click="() => { item.onClick(); closeDropdowns(); }"
          >
            <img v-if="item.imgSrc" :src="item.imgSrc" :alt="item.text" class="navbar-dropdown-img" />
            {{ item.text }}
          </button>
        </template>
      </div>
    </div>

    <!-- Slot for projected content (e.g. theme toggle) -->
    <slot />

    <!-- Mobile hamburger -->
    <button
      class="navbar-mobile-btn"
      :aria-label="mobileOpen ? 'Close navigation menu' : 'Open navigation menu'"
      :aria-expanded="mobileOpen"
      @click="mobileOpen = !mobileOpen"
    >
      <span class="navbar-hamburger" :class="{ 'navbar-hamburger--open': mobileOpen }" />
    </button>
  </header>

  <!-- Mobile drawer -->
  <nav v-if="mobileOpen" class="navbar-mobile-menu" aria-label="Mobile navigation">
    <template v-for="btn in config.buttons" :key="btn.id">
      <template v-if="isVisible(btn)">
        <a
          v-if="!btn.isDropdown"
          class="navbar-mobile-link"
          :href="btn.href"
          v-bind="btn.href?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
          @click="mobileOpen = false"
        >
          {{ btn.title }}
        </a>
        <template v-else>
          <template v-for="item in btn.dropdownItems" :key="item.id">
            <a
              v-if="isAnchorItem(item) && isVisible(item)"
              class="navbar-mobile-link"
              :href="item.href"
              v-bind="item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
              @click="mobileOpen = false"
            >{{ item.text }}</a>
            <button
              v-else-if="isClickableItem(item) && isVisible(item)"
              class="navbar-mobile-link"
              @click="() => { item.onClick(); mobileOpen = false; }"
            >{{ item.text }}</button>
          </template>
        </template>
      </template>
    </template>
    <template v-if="config.loginButton">
      <template v-for="item in config.loginButton.dropdownItems" :key="item.id">
        <a
          v-if="isAnchorItem(item) && isVisible(item)"
          class="navbar-mobile-link"
          :href="item.href"
          @click="mobileOpen = false"
        >{{ item.text }}</a>
        <button
          v-else-if="isClickableItem(item) && isVisible(item)"
          class="navbar-mobile-link"
          @click="() => { item.onClick(); mobileOpen = false; }"
        >{{ item.text }}</button>
      </template>
    </template>
  </nav>
</template>

<style lang="scss">
@use 'packages/tokens/src/mixins' as m;

.navbar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-4);
  height: var(--nav-height, 64px);
  background: var(--color-nav-bg);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 0 0 var(--color-primary-dim);
  transform: translateY(0);
  transition:
    background 200ms ease,
    box-shadow 200ms ease,
    backdrop-filter 200ms ease,
    transform 300ms ease;

  &--scrolled {
    background: color-mix(in srgb, var(--color-nav-bg) 80%, transparent);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    box-shadow:
      0 1px 0 0 var(--color-primary-dim),
      0 4px 24px rgba(0, 0, 0, 0.35);
  }

  &--hidden { transform: translateY(-100%); }

  &--fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-nav, 100);
  }
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
}

.navbar-brand-logo {
  height: 48px;
  width: auto;
}

.navbar-brand-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-on-nav);
}

.navbar-spacer { flex: 1; }

.navbar-desktop {
  display: flex;
  align-items: center;
  gap: var(--space-1);

  @media (max-width: 991px) { display: none; }
}

.navbar-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border-radius: 4px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-on-nav);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  letter-spacing: 0.02em;
  transition: color var(--transition-fast), background var(--transition-fast);

  &:hover {
    color: var(--color-secondary);
    background: var(--color-nav-hover-bg, rgba(255, 255, 255, 0.08));
  }

  &--dropdown { gap: var(--space-1); }
}

.navbar-chevron { font-size: 0.7em; opacity: 0.7; }

.navbar-dropdown-wrap { position: relative; }

.navbar-dropdown-content {
  @include m.floating-panel;
  position: absolute;
  top: calc(100% + var(--space-1));
  right: 0;
  min-width: 180px;
  z-index: var(--z-dropdown, 200);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.navbar-dropdown-user {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--color-on-surface-muted);
  border-bottom: 1px solid var(--color-border);
  pointer-events: none;
}

.navbar-dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-on-surface);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: background var(--transition-fast);

  &:hover { background: var(--color-surface-raised); }
}

.navbar-dropdown-img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  object-fit: cover;
}

.navbar-icon-btn {
  @include m.btn-icon(40px);
  color: var(--color-on-nav);
  &:hover { background: var(--color-nav-hover-bg, rgba(255, 255, 255, 0.08)); color: var(--color-secondary); }
}

.navbar-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-primary-dim);
  display: block;
}

.navbar-account-icon {
  width: 24px;
  height: 24px;
}

.navbar-mobile-btn {
  @include m.btn-icon(40px);
  color: var(--color-on-nav);
  display: none;

  @media (max-width: 991px) { display: flex; }
}

.navbar-hamburger {
  display: block;
  width: 20px;
  height: 2px;
  background: currentColor;
  position: relative;
  transition: background var(--transition-fast);

  &::before,
  &::after {
    content: '';
    display: block;
    width: 20px;
    height: 2px;
    background: currentColor;
    position: absolute;
    left: 0;
    transition: transform var(--transition-fast), top var(--transition-fast);
  }

  &::before { top: -6px; }
  &::after  { top:  6px; }

  &--open {
    background: transparent;
    &::before { top: 0; transform: rotate(45deg); }
    &::after  { top: 0; transform: rotate(-45deg); }
  }
}

.navbar-mobile-menu {
  position: fixed;
  top: var(--nav-height, 64px);
  left: 0;
  right: 0;
  background: var(--color-nav-bg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  z-index: var(--z-nav, 100);
  padding: var(--space-2) 0;
}

.navbar-mobile-link {
  display: block;
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-sm);
  color: var(--color-on-nav);
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: background var(--transition-fast), color var(--transition-fast);

  &:hover {
    background: var(--color-nav-hover-bg, rgba(255, 255, 255, 0.08));
    color: var(--color-secondary);
  }
}
</style>
