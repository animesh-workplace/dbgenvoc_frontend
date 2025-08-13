<template>
  <section class="py-10">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 class="text-center text-xl font-semibold">Database Features</h2>
      <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon="🔎"
          title="Advanced Search"
          description="Multi-dimensional search across genes, genomic regions, pathways, and patient cohorts."
        />
        <FeatureCard
          icon="📊"
          title="Data Visualization"
          description="Interactive charts and genomic browsers for comprehensive data exploration."
        />
        <FeatureCard
          icon="⬇️"
          title="Data Export"
          description="Download filtered datasets in multiple formats for further analysis."
        />
        <FeatureCard
          icon="🌐"
          title="Population Data"
          description="Cross-population comparisons with Indian, TCGA, and literature-curated datasets."
        />
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style scoped></style>
