<template>
	<section class="-mt-7 mx-8 xl:mx-auto xl:w-full max-w-5xl mb-12 relative z-20">
		<div class="flex items-start shadow-xl rounded-2xl bg-white">
			<AutoComplete
				fluid
				multiple
				size="large"
				forceSelection
				v-model="search"
				@blur="handleBlur"
				name="Search Input"
				@focus="handleFocus"
				@paste="handlePaste"
				optionGroupLabel="label"
				aria-label="Search Input"
				@item-select="ItemSelect"
				@keyup.enter="StartSearch"
				optionGroupChildren="items"
				@item-unselect="ItemRemoved"
				class="flex-1 rounded-l-2xl"
				@complete="SearchGenePathway"
				:suggestions="searchSuggestions"
				:class="{ 'gradient-bg': !isFocused }"
				:placeholder="search.length ? '' : 'Enter gene name or multiple gene names or region or pathway'"
				optionLabel="value"
				:pt="{
					root: 'rounded-l-2xl',
					container: 'rounded-l-2xl border-none',
					input: 'placeholder:text-sm caret-blue-800',
					inputMultiple:
						'!rounded-r-none !rounded-l-2xl !py-3 !px-5 !border-none caret-blue-800 !flex-wrap !w-full !h-auto',
				}"
			>
				<template #optiongroup="slotProps">
					<div class="flex items-center gap-2 py-0 w-full">
						<p class="font-semibold text-sm text-blue-900">{{ slotProps.option.label }}</p>
					</div>
				</template>

				<template #option="slotProps">
					<div class="flex items-center gap-2 py-0 px-2 w-full">
						<Icon
							name="solar:dna-bold-duotone"
							class="w-5 h-5 text-blue-600"
							v-if="slotProps.option.type === 'gene'"
						/>
						<Icon
							name="solar:black-hole-bold"
							class="w-5 h-5 text-green-600"
							v-else-if="slotProps.option.type === 'pathway'"
						/>
						<Icon v-else name="solar:question-circle-bold-duotone" class="w-5 h-5 text-gray-400" />

						<div class="flex items-center gap-2 justify-between w-full">
							<span class="font-medium text-gray-900">{{ slotProps.option.value }}</span>
							<span
								:class="`text-xs px-2 py-0.5 rounded-full ${
									slotProps.option.type === 'gene'
										? 'bg-blue-100 text-blue-700'
										: 'bg-green-100 text-green-700'
								}`"
							>
								{{ slotProps.option.type }}
							</span>
						</div>
					</div>
				</template>

				<template #chip="slotProps">
					<div
						:class="`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer ${
							slotProps.value.type === 'gene'
								? 'bg-blue-200 text-black shadow-sm'
								: 'bg-green-200 text-black shadow-sm'
						}`"
					>
						<Icon
							class="w-4 h-4"
							:name="
								slotProps.value.type === 'gene'
									? 'solar:dna-bold-duotone'
									: 'solar:black-hole-bold'
							"
						/>
						<span class="leading-none">{{ slotProps.value.value }}</span>
						<div
							@click="slotProps.removeCallback()"
							class="flex items-center justify-center rounded-full p-0.5 hover:bg-gray-300 cursor-pointer transition-colors"
						>
							<Icon name="solar:close-circle-bold-duotone" class="!w-4 !h-4 text-gray-500" />
						</div>
					</div>
				</template>

				<template #header>
					<div class="px-3 py-2 bg-gray-50 border-b border-gray-200 flex flex-col gap-1">
						<div class="text-xs text-gray-500">Select genes or pathways</div>
						<div class="text-xs text-gray-500 flex items-center gap-1">
							<Icon name="solar:info-circle-bold" class="!w-4 !h-4 mr-1 text-gray-400" />
							Pathways include multiple genes for comprehensive search
						</div>
					</div>
				</template>
			</AutoComplete>

			<Button
				id="Search Button"
				@click="StartSearch"
				aria-label="Search Button"
				class="!w-20 !rounded-l-none !rounded-r-2xl !bg-sky-200 !border-0 hover:!bg-sky-300 transition-colors h-auto self-stretch"
			>
				<template #icon>
					<Icon name="solar:magnifer-bold-duotone" class="!w-6 !h-6 text-blue-800" />
				</template>
			</Button>
		</div>

		<div class="flex xl:justify-center xl:text-center mt-6">
			<div class="text-gray-500 text-sm ml-2">
				<h3 class="text-sm font-semibold text-gray-700 mb-3">Example Searches:</h3>

				<div class="mb-2">
					<span class="text-gray-500 text-sm mr-2">Gene:</span>
					<span
						@click="applyExample([{ value: 'FAT1', type: 'gene' }])"
						class="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition text-xs"
					>
						FAT1
					</span>
				</div>

				<!-- <div class="mb-2">
					<span class="text-gray-500 text-sm mr-2">Region:</span>
					<span
						@click="applyExample([{ value: 'chr1:915188-1015188', type: 'region' }])"
						class="inline-block bg-green-50 text-green-600 px-3 py-1 rounded-full cursor-pointer hover:bg-green-100 transition text-xs"
					>
						chr1:915188-1015188
					</span>
				</div> -->

				<div class="mb-2">
					<span class="text-gray-500 text-sm mr-2">Multiple Genes:</span>
					<span
						@click="
							applyExample([
								{ value: 'TP53', type: 'gene' },
								{ value: 'BRCA2', type: 'gene' },
								{ value: 'NOTCH1', type: 'gene' },
							])
						"
						class="inline-flex items-center gap-1 bg-white text-blue-600 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition"
					>
						<span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">TP53</span>
						<span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">BRCA2</span>
						<span class="bg-blue-100 px-2 py-0.5 rounded-full text-xs">NOTCH1</span>
					</span>
				</div>

				<!-- <div>
					<span class="text-gray-500 text-sm mr-2">Multi-sites:</span>
					<span
						@click="
							applyExample([
								{ value: 'chr11:534289', type: 'region' },
								{ value: 'chr17:7578406', type: 'region' },
								{ value: 'chr17:7577538', type: 'region' },
								{ value: 'chr17:7577120', type: 'region' },
							])
						"
						class="inline-flex flex-wrap items-center gap-1 bg-white text-purple-600 lg:px-3 py-1 rounded-full cursor-pointer hover:bg-purple-100 transition"
					>
						<span class="bg-purple-100 px-2 py-0.5 rounded-full text-xs">chr11:534289</span>
						<span class="bg-purple-100 px-2 py-0.5 rounded-full text-xs">chr17:7578406</span>
						<span class="bg-purple-100 px-2 py-0.5 rounded-full text-xs">chr17:7577538</span>
						<span class="bg-purple-100 px-2 py-0.5 rounded-full text-xs">chr17:7577120</span>
					</span>
				</div> -->
			</div>
		</div>
	</section>
</template>

<script setup>
import { useGeneAPI } from '@/api/geneAPI'

const search = ref([])
const actualSearch = ref([])
const isFocused = ref(false)
const searchSuggestions = ref([
	{ label: 'Genes', items: [] },
	{ label: 'Pathways', items: [] },
])
const { AutocompleteAPI } = useGeneAPI()
const router = useRouter()

const handleFocus = () => {
	isFocused.value = true
}

const handleBlur = () => {
	isFocused.value = false
}

// ----------------------------------------------------------------------
// APPLY EXAMPLE SEARCH
// ----------------------------------------------------------------------
const applyExample = (exampleItems) => {
	// 1. Set Visual Chips
	// We replace the current search or append. Here I'm replacing for a "clean" example click.
	// If you want to append, use: [...search.value, ...exampleItems]
	search.value = [...search.value, ...exampleItems]

	// 2. Set Logic Values (Actual Search)
	const newActualSearch = []
	search.value.forEach((item) => {
		if (item.type === 'pathway') {
			// If you have example pathways, you'd need the pathway_genes data here
			// For now, simple push
			if (item.pathway_genes) newActualSearch.push(...item.pathway_genes)
		} else {
			newActualSearch.push(item.value)
		}
	})

	// Ensure uniqueness
	actualSearch.value = [...new Set(newActualSearch)]
}

// ----------------------------------------------------------------------
// COPY / PASTE LOGIC
// ----------------------------------------------------------------------
const handlePaste = async (event) => {
	const clipboardData = event.clipboardData || window.clipboardData
	const pastedText = clipboardData.getData('text')
	event.preventDefault()

	if (!pastedText) return

	const items = pastedText
		.split(/[\n\r, \t]+/)
		.map((item) => item.trim().toUpperCase())
		.filter((item) => item.length > 0)

	if (items.length === 0) return

	await processPastedItems(items)
}

const processPastedItems = async (rawItems) => {
	// 1. Filter out items already in search to avoid duplicates
	const existingValues = search.value.map((s) => s.value.toUpperCase())
	const newItems = rawItems.filter((item) => !existingValues.includes(item))

	if (newItems.length === 0) return

	const promises = newItems.map(async (item) => {
		try {
			const response = await AutocompleteAPI({ term: item })

			if (!response || !Array.isArray(response)) return null

			let allOptions = []
			if (response[0] && response[0].items) {
				allOptions = response.flatMap((group) => group.items || [])
			} else {
				allOptions = response
			}

			return allOptions.find((opt) => opt.value.toUpperCase() === item)
		} catch (e) {
			console.error(`Failed to validate ${item}`, e)
			return null
		}
	})

	const results = await Promise.all(promises)
	const validObjects = results.filter((res) => res !== null && res !== undefined)

	if (validObjects.length === 0) return

	// 2. Update Visual State (Reassign for Reactivity)
	search.value = [...search.value, ...validObjects]

	// 3. Update Logic State
	validObjects.forEach((obj) => {
		if (obj.type === 'pathway') {
			const pathwayGenes = obj.pathway_genes || []
			actualSearch.value = [...new Set([...actualSearch.value, ...pathwayGenes])]
		} else {
			if (!actualSearch.value.includes(obj.value)) {
				actualSearch.value.push(obj.value)
			}
		}
	})
}

// ----------------------------------------------------------------------
// EXISTING LOGIC
// ----------------------------------------------------------------------

const StartSearch = () => {
	if (actualSearch.value.length === 0) {
		return
	}

	router.push({
		path: '/search',
		query: {
			genes_list: actualSearch.value,
		},
	})
}

const ItemSelect = (event) => {
	if (event.value.type === 'pathway') {
		const pathwayGenes = event.value.pathway_genes
		const uniqueGenes = [...new Set([...actualSearch.value, ...pathwayGenes])]
		actualSearch.value = uniqueGenes
	} else if (event.value.type === 'gene') {
		if (!actualSearch.value.includes(event.value.value)) {
			actualSearch.value.push(event.value.value)
		}
	}
}

const ItemRemoved = (event) => {
	const remainingGenes = search.value.flatMap((item) => {
		if (item.type === 'pathway') {
			// If it's a pathway, keep all its genes
			return item.pathway_genes || []
		}
		// If it's a single gene or region, keep the value
		return item.value
	})

	// Remove duplicates and update the logic state
	actualSearch.value = [...new Set(remainingGenes)]
}

const SearchGenePathway = async (event) => {
	try {
		const response = await AutocompleteAPI({ term: event.query })
		if (response) {
			searchSuggestions.value = response
		} else {
			searchSuggestions.value = []
		}
	} catch (error) {
		console.error('Error fetching search suggestions:', error)
		searchSuggestions.value = []
	}
}
</script>

<style scoped>
@property --rotate {
	inherits: false;
	syntax: '<angle>';
	initial-value: 100deg;
}

.gradient-bg {
	position: relative;
}

.gradient-bg::after,
.gradient-bg::before {
	top: -2px;
	left: -2px;
	right: -2px;
	content: '';
	z-index: -1;
	bottom: -2px;
	position: absolute;
	border-radius: 1rem;
	transition: all 1s ease-in-out;
	min-width: calc(100% + 5rem + 4px);
	animation: spin 10s linear infinite;
	background-image: conic-gradient(
		from var(--rotate),
		#fbb1bd 0%,
		#ffd6a5 25%,
		#caffbf 50%,
		#9bf6ff 75%,
		#bdb2ff 100%
	);
}

.gradient-bg::before {
	opacity: 0.8;
	filter: blur(2rem);
}

@keyframes spin {
	0% {
		--rotate: 0deg;
	}
	100% {
		--rotate: 360deg;
	}
}
</style>
