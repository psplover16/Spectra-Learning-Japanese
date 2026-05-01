<script setup lang="ts">
import { appVersion } from '@/shared/version/appVersion';

defineProps<{
  version?: string;
}>();
</script>

<template>
  <span data-testid="app-version-label">{{ version ?? appVersion }}</span>
</template>
