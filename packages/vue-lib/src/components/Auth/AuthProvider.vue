<script setup lang="ts">
import { ref, onMounted, onUnmounted, provide } from "vue";
import {
  AUTH_KEY,
  type M2S2AuthUser,
  type M2S2AuthProviderImpl,
} from "./useAuth";

const props = defineProps<{
  provider: M2S2AuthProviderImpl;
}>();

const user = ref<M2S2AuthUser | undefined>(undefined);
const loggedIn = ref(false);
const loading = ref(true);
let unsubscribe: (() => void) | undefined;

onMounted(async () => {
  const u = await props.provider.getCurrentUser();
  user.value = u;
  loggedIn.value = !!u;
  loading.value = false;

  unsubscribe = props.provider.subscribeToAuthState((authenticated) => {
    loggedIn.value = authenticated;
    if (!authenticated) user.value = undefined;
  });
});

onUnmounted(() => unsubscribe?.());

async function signOut() {
  await props.provider.signOut();
  user.value = undefined;
  loggedIn.value = false;
}

provide(AUTH_KEY, {
  get user() {
    return user.value;
  },
  get loggedIn() {
    return loggedIn.value;
  },
  get loading() {
    return loading.value;
  },
  signOut,
});
</script>

<template>
  <slot />
</template>
