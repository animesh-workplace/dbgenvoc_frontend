<template>
	<div class="min-h-[calc(100vh-56px)]">
		<div class="grid grid-cols-3 gap-12 p-8">
			<GraphBar :plotData="variantType" />
			<GraphBar />
			<GraphBar />
			<!-- <GraphLollipop class="col-span-3" /> -->
		</div>
	</div>
</template>

<script setup>
import { useGeneAPI } from '@/api/geneAPI'
const { SearchAPI, AggregateAPI, ConcateAggregateAPI } = useGeneAPI()

const variantType = ref({ data: [], categories: [] })

const searchVariantType = async () => {
	try {
		const response = await SearchAPI('exome_somatic', {
			term: 'TP53',
			exact_match: true,
			search_columns: ['gene'],
		})
		console.log(response)
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateVariantType = async () => {
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']

	// Collect per-gene maps and a global category set
	const perGeneMaps = [] // [{ gene, countsByCat: Map<string, number> }]
	const categorySet = new Set() // union of all categories

	// Fetch sequentially (can be parallelized if API allows)
	for (const gene of gene_list) {
		try {
			const response = await AggregateAPI('exome_somatic', {
				filters: { gene },
				column: 'variant_type',
				group_by: ['variant_type'],
			})

			// Build a map category -> value for this gene
			const countsByCat = new Map()
			for (const item of response.result) {
				// Assuming item.aggregated_value is the count (or metric) and item.variant_type is the category
				countsByCat.set(item.variant_type, item.aggregated_value ?? 0)
				categorySet.add(item.variant_type)
			}

			perGeneMaps.push({ gene, countsByCat })
		} catch (error) {
			console.error('Error fetching search data:', error)
			// Still push an empty map to preserve gene order
			perGeneMaps.push({ gene, countsByCat: new Map() })
		}
	}

	// Create a deterministic category order:
	const categories = Array.from(categorySet).sort((a, b) => a.localeCompare(b))

	// Build aligned series per gene in the same category order, zero-filling missing cats
	const alignedSeries = perGeneMaps.map(({ countsByCat }) => categories.map((cat) => countsByCat.get(cat) ?? 0))
	variantType.value.categories = categories
	variantType.value.data = alignedSeries
}

onBeforeMount(() => {
	nextTick(async () => {
		// Initialize the search variant type function
		// searchVariantType()
		aggregateVariantType()
	})
})
</script>

<style scoped></style>
