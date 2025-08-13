<template>
	<main>
		<section class="relative bg-gradient-to-br from-blue-500/10 to-green-500/10 overflow-hidden">
			<div class="absolute inset-0 opacity-20 hero-background" />

			<div class="px-8 py-8 my-5">
				<div class="grid grid-cols-1 xl:grid-cols-2 gap-12">
					<!-- Header Section -->
					<div>
						<h1 class="text-3xl font-bold text-blue-800 mb-2">
							Database of Genomic Variants of Oral Cancer
						</h1>
						<p align="justify" class="text-gray-500 mx-auto">
							dbGENVOC is a comprehensive, flexible database framework designed to provide
							researchers with seamless access to somatic variation data from Indian oral cancer
							patients. This repository has the potential to support advances in oral cancer research
							and represents a major step forward from simply cataloging variants to gaining insight
							into their significance. dbGENVOC is freely available and will be updated frequently
							with variation data from additional oral cancer patients.
						</p>
					</div>

					<!-- Key Statistics -->
					<div class="content-center">
						<div class="grid grid-cols-1 md:grid-cols-5 gap-4">
							<div
								:key="index"
								:class="`${stat.bgColor} shadow-sm`"
								v-for="(stat, index) in key_statistics"
								class="rounded-2xl p-3 text-center content-center"
							>
								<div class="text-lg font-bold mb-1" :class="stat.textColor">{{ stat.title }}</div>
								<div class="text-gray-500">{{ stat.description }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Autocomplete search -->
		<section class="-mt-7 mx-8 xl:mx-0 w-[calc(100%-2rem)] xl:w-full mb-12">
			<div class="flex xl:justify-center">
				<AutoComplete
					fluid
					multiple
					size="large"
					v-model="value2"
					:suggestions="items"
					class="min-w-[calc(100%-2rem-5rem)] xl:min-w-4xl"
					placeholder="Enter gene name or multiple gene names or region or pathway"
					:pt="{
						input: 'placeholder:text-sm caret-blue-800',
						inputMultiple:
							'!rounded-r-none !rounded-l-2xl !py-3 !px-5 !shadow-xl !border-gray-200 !border-r-0 caret-blue-800',
					}"
				/>
				<Button
					:pt="{
						root: '!rounded-l-none !rounded-r-2xl !w-20 !shadow-xl !bg-sky-200 !border-gray-200 !border-0 z-10',
					}"
				>
					<template #icon>
						<Icon name="solar:magnifer-bold-duotone" class="!w-6 !h-6 text-blue-800" />
					</template>
				</Button>
			</div>

			<div class="flex xl:justify-center text-center mt-2">
				<div class="text-gray-500 text-sm ml-2">
					<h3 class="text-sm font-semibold text-gray-700 mb-3">Example Searches:</h3>

					<!-- Single Gene -->
					<div class="mb-2">
						<span class="text-gray-500 text-sm mr-2">Gene:</span>
						<span
							class="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition text-xs"
						>
							FAT1
						</span>
					</div>

					<!-- Region -->
					<div class="mb-2">
						<span class="text-gray-500 text-sm mr-2">Region:</span>
						<span
							class="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-full cursor-pointer hover:bg-green-100 transition text-xs"
						>
							chr1:915188-1015188
						</span>
					</div>

					<!-- Multi Genes -->
					<div class="mb-2">
						<span class="text-gray-500 text-sm mr-2">Multiple Genes:</span>
						<span
							class="inline-flex items-center gap-1 bg-white text-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition"
						>
							<span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">TP53</span>
							<span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">BRCA2</span>
							<span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">NOTCH1</span>
						</span>
					</div>

					<!-- Multi Sites -->
					<div>
						<span class="text-gray-500 text-sm mr-2">Multi-sites:</span>
						<span
							class="inline-flex flex-wrap items-center gap-1 bg-white text-purple-600 px-3 py-1 rounded-full cursor-pointer hover:bg-purple-100 transition"
						>
							<span class="bg-purple-100 px-2 py-0.5 rounded-full text-xs">chr11:534289</span>
							<span class="bg-purple-100 px-2 py-0.5 rounded-full text-xs">chr17:7578406</span>
							<span class="bg-purple-100 px-2 py-0.5 rounded-full text-xs">chr17:7577538</span>
							<span class="bg-purple-100 px-2 py-0.5 rounded-full text-xs">chr17:7577120</span>
						</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Data Sources -->
		<section class="relative bg-[#05192d] py-28 overflow-clip">
			<div class="relative mx-8 z-10 text-center">
				<h2 class="text-3xl font-semibold text-gray-100 mb-8">Data Sources</h2>
				<div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
					<div :key="index" v-for="(source, index) in data_sources" class="bg-white/95 rounded-2xl p-8">
						<div class="mb-12">
							<div class="flex items-center justify-between mb-2">
								<Icon :name="source.icon" class="!w-12 !h-12 text-gray-700" />
								<Icon name="solar:arrow-right-up-line-duotone" class="!w-8 !h-8 text-gray-400" />
							</div>
						</div>

						<h3 class="text-xl font-semibold text-gray-800 mb-1">{{ source.title }}</h3>
						<p class="text-gray-500 my-4 text-sm">
							{{ source.description }}
						</p>
						<div class="text-sm text-gray-400">Source: {{ source.source }}</div>
					</div>
				</div>
			</div>

			<div class="absolute top-0 right-0 z-0 rotate-180">
				<svg fill="none" width="758" height="228" xmlns="http://www.w3.org/2000/svg">
					<path fill="#05192D" d="M700.07 176.6 367.4 368.67l-17.59-30.46L682.5 146.14z"></path>
					<path fill="#db2777" d="M747.48 199.21 330.45 440l-49.15-85.12 417.04-240.78z"></path>
					<path fill="#9333ea" d="M609.8 212.3 184.98 457.56l-49.14-85.12 424.83-245.28z"></path>
					<path fill="#05192D" d="m610.01 212.72-308.47 178.1-20.74-35.93 308.47-178.1z"></path>
					<path fill="#1d4ed8" d="m-195.1 490.13 417.04-240.77-49.15-85.13-417.03 240.78z"></path>
					<path fill="#16a34a" d="M-114.94 377.44 309.9 132.16l-49.14-85.12-424.84 245.28z"></path>
					<path fill="#05192D" d="m-114.67 377.83 308.47-178.1-20.74-35.92-308.47 178.1z"></path>
					<path fill="#d97706" d="m167.8 30.59-349.1 201.54-17.58-30.46L150.21.13z"></path>
				</svg>
			</div>
		</section>

		<!-- Features -->
		<section class="my-12 mx-8">
			<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
				<div class="bg-gray-200 rounded-2xl p-4">
					<div class="bg-gray-50 p-4 rounded-2xl shadow-sm border border-gray-200 relative">
						<img src="/graph.png" />
						<div class="bg-white rounded-2xl shadow-lg p-2 max-w-sm absolute bottom-10 right-10">
							<img src="/table.png" />
						</div>
					</div>
				</div>

				<!-- Right Column with features -->
				<div>
					<h2 class="text-3xl font-bold text-gray-900 mb-2">Key Features of dbGENVOC</h2>
					<p class="text-gray-600 mb-8">
						Explore the database capabilities to accelerate your research and analysis.
					</p>

					<ul class="space-y-6">
						<li class="flex items-start" v-for="(feature, index) in key_features" :key="index">
							<div
								class="bg-blue-100 text-blue-800 rounded-full p-2 flex justify-center items-center"
							>
								<Icon :name="feature.icon" class="!w-5 !h-5" />
							</div>
							<div class="ml-4">
								<h3 class="text-lg font-semibold text-gray-900">{{ feature.title }}</h3>
								<p class="text-gray-600">
									{{ feature.description }}
								</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</section>
	</main>
</template>

<script setup>
const key_statistics = [
	{
		title: '24 Million+',
		bgColor: 'bg-amber-50',
		textColor: 'text-amber-600',
		description: 'Somatic Variants',
	},
	{
		title: '325+',
		bgColor: 'bg-green-50',
		textColor: 'text-green-600',
		description: 'Patient Samples',
	},
	{
		title: 'Multiple',
		bgColor: 'bg-blue-50',
		textColor: 'text-blue-600',
		description: 'Data Sources',
	},
	{
		title: 'XX',
		bgColor: 'bg-purple-50',
		textColor: 'text-purple-600',
		description: 'Key Genes',
	},
	{
		title: '300+',
		bgColor: 'bg-pink-50',
		textColor: 'text-pink-600',
		description: 'Pathways',
	},
]

const data_sources = [
	{
		title: 'Indian Cohort',
		icon: 'solar:filters-line-duotone',
		source: 'ICGC Indian Oral Cancer Project',
		description:
			'Whole exome sequences from 100 Indian oral cancer patients and whole genome sequences from 5 patients',
	},
	{
		title: 'TCGA-HNSCC',
		source: 'USA cohort',
		icon: 'solar:football-line-duotone',
		description:
			'Somatic variation data from 220 patient samples analyzed by the TCGA Head and Neck Squamous Cell Carcinoma project',
	},
	{
		source: 'Published studies',
		title: 'Literature Curation',
		icon: 'solar:layers-minimalistic-bold-duotone',
		description: 'Manually curated variation data from 118 patients sourced from peer-reviewed publications',
	},
]

const key_features = [
	{
		title: 'Advanced Search',
		icon: 'solar:magnifer-broken',
		description: 'Multi-dimensional search across genes, genomic regions, pathways, and patient cohorts.',
	},
	{
		title: 'Data Visualization',
		icon: 'solar:chart-square-broken',
		description: 'Interactive charts and genomic browsers for comprehensive data exploration.',
	},
	{
		title: 'Data Export',
		icon: 'solar:file-download-broken',
		description: 'Download filtered datasets in multiple formats for further analysis.',
	},
	{
		title: 'Population Data',
		icon: 'solar:global-broken',
		description: 'Cross-population comparisons with Indian, TCGA, and literature-curated datasets.',
	},
]

const value2 = ref(null)
const items = ref(['AbortController', 'TerminalStyle', 'oks'])

const search = () => {
	items.value = []
}
</script>

<style scoped>
.hero-background {
	background: url('data:image/svg+xml, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
}
</style>
