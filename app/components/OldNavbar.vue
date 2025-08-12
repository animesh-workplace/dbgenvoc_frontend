<script setup lang="ts">
const { colorMode, toggle } = useTheme();
</script>
<template>
  <header
    class="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-dark-bg/70 border-b border-light-border dark:border-dark-border transition-colors"
  >
    <nav
      class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-5 h-5 rounded-sm bg-brand-500 flex items-center justify-center"
        >
          <span class="text-[10px] font-bold text-black dark:text-white"
            >db</span
          >
        </div>
        <span class="text-sm text-black dark:text-white/80">dbGENVOC v2</span>
      </div>
      <ul
        class="hidden md:flex items-center gap-6 text-sm text-light-muted dark:text-white/70"
      >
        <li>
          <a href="#" class="hover:text-light-text dark:hover:text-white"
            >Home</a
          >
        </li>
        <li>
          <a href="#" class="hover:text-light-text dark:hover:text-white"
            >Search</a
          >
        </li>
        <li>
          <a href="#" class="hover:text-light-text dark:hover:text-white"
            >Browse</a
          >
        </li>
        <li>
          <a href="#" class="hover:text-light-text dark:hover:text-white"
            >Visualize</a
          >
        </li>
        <li>
          <a href="#" class="hover:text-light-text dark:hover:text-white"
            >Download</a
          >
        </li>
      </ul>
      <button
        @click="toggle"
        class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-light-border dark:border-dark-border hover:bg-black/5 dark:hover:bg-white/5 transition"
        :title="colorMode === 'light' ? 'Switch to dark' : 'Switch to light'"
      >
        <span v-if="colorMode === 'light'">🌙</span> <span v-else>☀️</span>
      </button>
    </nav>
  </header>
</template>
