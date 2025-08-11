<script setup lang="ts">
defineProps<{ label: string; value: string }>();
</script>

<template>
  <template>
    <div
      class="px-4 py-3 rounded-md bg-white border border-light-border text-center dark:bg-dark-surface/40 dark:border-dark-border"
    >
      <div class="text-lg font-semibold">{{ value }}</div>
      <div
        class="text-xs uppercase tracking-wide text-light-muted dark:text-white/60"
      >
        {{ label }}
      </div>
    </div>
  </template>
</template>
