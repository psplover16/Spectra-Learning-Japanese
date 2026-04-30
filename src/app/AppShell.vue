<script setup lang="ts">
import { RouterView } from 'vue-router';
import RouteTabs from '@/shared/components/RouteTabs.vue';
import ToastBanner from '@/shared/components/ToastBanner.vue';
import { createPracticeSession, providePracticeSession } from '@/modules/practice/composables/usePracticeSession';
import { usePwaLifecycle } from '@/modules/pwa/composables/usePwaLifecycle';

const session = createPracticeSession();
providePracticeSession(session);

const { toast, confirmUpdate, dismissToast } = usePwaLifecycle();
</script>

<template>
  <div
    data-testid="app-shell"
    class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(180,90,50,0.12),_transparent_40%),linear-gradient(180deg,_#f8f2ea_0%,_#f4ecdf_100%)]"
  >
    <div class="app-shell-frame mx-auto flex min-h-screen w-full max-w-6xl flex-col p-2">
      <header
        data-testid="app-header"
        class="app-shell-header mb-1 flex items-start rounded-lg border border-clay/15 bg-white/75 p-1 shadow-soft backdrop-blur"
      >
        <RouteTabs />
      </header>

      <main class="flex-1">
        <RouterView />
      </main>
    </div>

    <ToastBanner
      :visible="toast.visible"
      :kind="toast.kind"
      :message="toast.message"
      :action-label="toast.actionLabel"
      @action="confirmUpdate"
      @dismiss="dismissToast"
    />
  </div>
</template>
