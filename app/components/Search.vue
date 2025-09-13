<template>
	<section class="-mt-7 mx-8 xl:mx-0 w-[calc(100%-2rem)] xl:w-full mb-12">
		<div class="flex xl:justify-center">
			<AutoComplete
				fluid
				multiple
				size="large"
				forceSelection
				v-model="search"
				@blur="handleBlur"
				name="Search Input"
				@focus="handleFocus"
				optionGroupLabel="label"
				aria-label="Search Input"
				optionGroupChildren="items"
				@complete="SearchGenePathway"
				@item-select="ItemSelect"
				:suggestions="searchSuggestions"
				:class="{ 'gradient-bg': !isFocused }"
				class="min-w-[calc(100%-2rem-5rem)] max-w-[calc(100%-2rem-5rem)] xl:min-w-4xl"
				:placeholder="search.length ? '' : 'Enter gene name or multiple gene names or region or pathway'"
				optionLabel="value"
				:pt="{
					input: 'placeholder:text-sm caret-blue-800',
					inputMultiple:
						'!rounded-r-none !rounded-l-2xl !py-3 !px-5 !shadow-xl !border-gray-200 !border-r-0 caret-blue-800',
				}"
			>
				<template #optiongroup="slotProps">
					<div class="flex items-center gap-2 py-0 w-full">
						<p class="font-semibold text-sm text-blue-900">{{ slotProps.option.label }}</p>
					</div>
				</template>

				<!-- Custom option template -->
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

				<!-- Custom chip template for selected items -->
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

				<!-- Header with instructions -->
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
				:pt="{
					root: '!rounded-l-none !rounded-r-2xl !w-20 !shadow-xl !bg-sky-200 !border-gray-200 !border-0 z-10',
				}"
			>
				<template #icon>
					<Icon name="solar:magnifer-bold-duotone" class="!w-6 !h-6 text-blue-800" />
				</template>
			</Button>
		</div>

		<div class="flex xl:justify-center xl:text-center mt-6">
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
						class="inline-flex flex-wrap items-center gap-1 bg-white text-purple-600 lg:px-3 py-1 rounded-full cursor-pointer hover:bg-purple-100 transition"
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

const handleFocus = () => {
	// Logic to fetch suggestions or handle focus event
	// console.log('Search input focused')
	isFocused.value = true
}

const handleBlur = () => {
	// Logic to fetch suggestions or handle focus event
	// console.log('Search input blurred')
	isFocused.value = false
}

const StartSearch = () => {
	if (actualSearch.value.length === 0) {
		return
	}

	// Navigate to search page with genes_list as query parameter
	const router = useRouter()
	router.push({
		path: '/search',
		query: {
			genes_list: actualSearch.value,
		},
	})
}

const ItemSelect = (event) => {
	if (event.value.type === 'pathway') {
		const pathwayGenes = event.value.pathway_genes.split(',')
		// Remove duplicates and merge with existing
		const uniqueGenes = [...new Set([...actualSearch.value, ...pathwayGenes])]
		actualSearch.value = uniqueGenes
	} else if (event.value.type === 'gene') {
		// Check if gene already exists
		if (!actualSearch.value.includes(event.value.value)) {
			actualSearch.value.push(event.value.value)
		}
	}
	console.log('Selected item:', event.value)
}

const SearchGenePathway = async (event) => {
	try {
		const response = await AutocompleteAPI({ term: event.query })
		if (response && response.suggestions) {
			const genes = response.suggestions.filter((item) => item.type === 'gene')
			const pathways = response.suggestions.filter((item) => item.type === 'pathway')
			searchSuggestions.value = [
				{ label: 'Genes', items: genes },
				{ label: 'Pathways', items: pathways },
			]
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
	border-radius: 1.2rem;
	transition: all 1s ease-in-out;
	min-width: calc(100% + 5rem + 4px);
	animation: spin 10s linear infinite;
	/* background-image: conic-gradient(
		from var(--rotate),
		#ffffff 0%,
		#1c398e 86%,
		#a5b4fc 90%,
		#1c398e 94%,
		#d70249 90%
	); */
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
