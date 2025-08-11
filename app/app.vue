<script setup lang="ts">
const { colorMode } = useTheme();
</script>
<template>
  <div
    class="min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text transition-colors"
  >
    <Navbar /> <NuxtPage /> <Footer />
  </div>
</template>
