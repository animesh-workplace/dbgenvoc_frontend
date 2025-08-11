<script setup lang="ts">
const model = ref("");
const onSearch = () => {};
</script>

<template>
  <section class="relative overflow-hidden">
    <div
      class="absolute inset-0 pointer-events-none bg-gradient-to-b from-brand-50 via-light-bg to-light-bg dark:from-brand-900/30 dark:via-dark-surface dark:to-dark-bg"
    ></div>
    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-8">
      <p class="text-brand-600 dark:text-brand-300 text-sm font-medium">
        dbGENVOC v2
      </p>
      <h1 class="mt-2 text-2xl sm:text-3xl font-semibold">
        Genomic Variants of Oral Cancer
      </h1>
      <p class="mt-2 max-w-3xl text-light-muted dark:text-white/70">
        A comprehensive database containing 24+ million genomic variants from
        323 oral cancer patients across multiple populations and sequencing
        platforms.
      </p>

      <div class="mt-6 flex items-center gap-4 flex-wrap">
        <div class="flex-1 min-w-[280px]">
          <div class="relative">
            <input
              v-model="model"
              type="text"
              placeholder="Search genes, variants, or patient IDs..."
              class="w-full rounded-lg bg-white border border-light-border dark:bg-dark-card/70 dark:border-dark-border py-3 pl-4 pr-12 outline-none placeholder-slate-400 dark:placeholder-white/40 focus:ring-2 focus:ring-brand-500"
            />
            <button
              @click="onSearch"
              class="absolute right-1 top-1 bottom-1 px-3 rounded-md bg-brand-500 hover:bg-brand-600 text-white transition"
            >
              🔍
            </button>
          </div>
        </div>

        <div class="flex gap-3">
          <NuxtLink
            to="#"
            class="px-4 py-2 rounded-md bg-black/5 border border-light-border hover:bg-black/10 dark:bg-white/5 dark:border-dark-border dark:hover:bg-white/10"
          >
            Advanced Search
          </NuxtLink>
          <NuxtLink
            to="#"
            class="px-4 py-2 rounded-md bg-black/5 border border-light-border hover:bg-black/10 dark:bg-white/5 dark:border-dark-border dark:hover:bg-white/10"
          >
            Browse Data
          </NuxtLink>
        </div>
      </div>

      <div class="mt-6">
        <div
          class="inline-grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-light-border dark:bg-dark-card/60 dark:border-dark-border rounded-lg p-3"
        >
          <StatsCard label="Variants" value="24M+" />
          <StatsCard label="Patients" value="323" />
          <StatsCard label="Key Genes" value="6" />
          <StatsCard label="Pathways" value="4" />
        </div>
      </div>
    </div>
  </section>
</template>
