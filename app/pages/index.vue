<template>
	<main>
		<div class="relative bg-gradient-to-br from-blue-500/20 to-green-500/20 overflow-hidden">
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
								class="rounded-xl p-3 text-center content-center"
							>
								<div class="text-lg font-bold mb-1" :class="stat.textColor">{{ stat.title }}</div>
								<div class="text-gray-500">{{ stat.description }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="-mt-7 mx-8 w-[calc(100%-2rem)]">
			<div class="flex xl:justify-center">
				<AutoComplete
					fluid
					multiple
					size="large"
					v-model="value2"
					:suggestions="items"
					class="min-w-[calc(100%-2rem-5rem)] xl:min-w-4xl"
					placeholder="Enter gene name or multiple gene names or region"
					:pt="{ inputMultiple: '!rounded-r-none !rounded-l-xl !py-3 !px-5 !shadow-xl' }"
				/>
				<Button severity="info" :pt="{ root: '!rounded-l-none !rounded-r-xl !w-20 !shadow-xl' }">
					<template #icon>
						<Icon name="solar:magnifer-bold-duotone" class="!w-6 !h-6" />
					</template>
				</Button>
			</div>
		</div>

		<!-- Data Sources -->
		<!-- <div class="mb-12">
			<h2 class="text-xl font-semibold text-gray-600 mb-4">Data Sources</h2>
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div
					:key="index"
					v-for="(source, index) in data_sources"
					class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
				>
					<h3 class="text-lg font-semibold text-blue-700 mb-3">{{ source.title }}</h3>
					<p class="text-gray-600 mb-4">
						{{ source.description }}
					</p>
					<div class="text-sm text-gray-500">Source: {{ source.source }}</div>
				</div>
			</div>
		</div> -->

		<!-- Features -->
		<!-- <div class="mb-12">
					<h2 class="text-2xl font-semibold text-gray-800 mb-6">Key Features</h2>
					<div class="bg-gray-50 rounded-lg p-8">
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div class="flex items-center space-x-3">
								<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
									<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
								</div>
								<span class="text-gray-700">Access & Query</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
									<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
								</div>
								<span class="text-gray-700">Browse & Download</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
									<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
								</div>
								<span class="text-gray-700">Best Practice Protocols</span>
							</div>
							<div class="flex items-center space-x-3">
								<div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
									<svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
								</div>
								<span class="text-gray-700">Multi-pipeline Annotation</span>
							</div>
						</div>
					</div>
				</div> -->

		<!-- Mission Statement -->
		<!-- <div class="bg-blue-50 rounded-lg p-4">
					<h2 class="text-2xl font-semibold text-blue-800 mb-4">Our Mission</h2>
					<p class="text-gray-700">
						This repository has the potential to support advances in oral cancer research and
						represents a major step forward from simply cataloging variants to gaining insight into
						their significance. dbGENVOC is freely available and will be updated frequently with
						variation data from additional oral cancer patients.
					</p>
				</div> -->

		<!-- <HeroSearch /> -->
		<!-- <FeaturesGrid /> -->
	</main>
</template>

<script setup>
import { TerminalStyle } from 'primevue'

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
		source: 'Indian studies',
		description:
			'Whole exome sequences from 100 Indian oral cancer patients and whole genome sequences from 5 patients',
	},
	{
		title: 'TCGA-HNSCC',
		source: 'USA cohort',
		description:
			'Somatic variation data from 220 patient samples analyzed by the TCGA Head and Neck Squamous Cell Carcinoma project',
	},
	{
		source: 'Published studies',
		title: 'Literature Curation',
		description: 'Manually curated variation data from 118 patients sourced from peer-reviewed publications',
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

.hero-search {
	position: relative;
	margin-bottom: var(--space-32);
}

.search-container {
	display: flex;
	background: var(--color-surface);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
	overflow: hidden;
	border: 1px solid var(--color-border);
}

.search-input {
	flex: 1;
	padding: var(--space-16) var(--space-20);
	border: none;
	background: transparent;
	font-size: var(--font-size-base);
	color: var(--color-text);
}

.search-input:focus {
	outline: none;
}

.search-btn {
	padding: var(--space-16) var(--space-20);
	border-radius: 0;
	border: none;
}

.search-suggestions {
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-top: none;
	border-radius: 0 0 var(--radius-lg) var(--radius-lg);
	box-shadow: var(--shadow-lg);
	z-index: 10;
	display: none;
}

.suggestion-item {
	padding: var(--space-12) var(--space-20);
	cursor: pointer;
	transition: background var(--duration-fast) var(--ease-standard);
}

.suggestion-item:hover {
	background: var(--color-secondary);
}

.hero-actions {
	display: flex;
	gap: var(--space-16);
}
</style>
