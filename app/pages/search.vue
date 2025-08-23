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
import { uniq, map } from 'lodash-es'
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
	let variant_data = []
	let variant_categories = []
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await AggregateAPI('exome_somatic', {
			column: 'variant_type',
			filters: { gene: gene_list },
			group_by: ['variant_type', 'gene'],
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_type))
		variant_data = gene_list.map((d) => Array(variant_categories.length).fill(0))
		// Index maps for quick lookup
		const geneIndex = new Map(gene_list.map((g, i) => [g, i]))
		const categoryIndex = new Map(variant_categories.map((c, j) => [c, j]))
		// Populate the data array
		response.result.forEach((item) => {
			const i = geneIndex.get(item.gene)
			const j = categoryIndex.get(item.variant_type)
			if (i !== undefined && j !== undefined) {
				variant_data[i][j] = item.aggregated_value
			}
		})
		variantType.value.data = variant_data
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
	// variantType.value.data.push(response.result.map((item) => item.aggregated_value))
	variantType.value.categories = variant_categories
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
