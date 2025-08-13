<script setup lang="ts">
defineProps<{ title: string; description: string; icon?: string }>();
</script>

<template>
  <div
    class="rounded-xl bg-white border border-light-border p-6 hover:-translate-y-0.5 transition shadow-soft dark:bg-dark-card dark:border-dark-border"
  >
    <div
      class="h-10 w-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4"
    >
      <span>{{ icon || "⧉" }}</span>
    </div>
    <h3 class="font-semibold mb-1">{{ title }}</h3>
    <p class="text-sm text-light-muted dark:text-white/65 leading-relaxed">
      {{ description }}
    </p>
  </div>
</template>
