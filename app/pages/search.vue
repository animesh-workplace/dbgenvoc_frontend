<template>
	<div class="min-h-[calc(100vh-56px)]">
		<div class="grid grid-cols-3 gap-12 p-8">
			<GraphBar :plotData="variantType" />
			<GraphBar :plotData="variantClass" />
			<GraphBar />
			<!-- <GraphLollipop class="col-span-3" /> -->
		</div>
	</div>
</template>

<script setup>
import { uniq, map } from 'lodash-es'
import { useGeneAPI } from '@/api/geneAPI'
const { useVariantMatrix } = useHelper()
const { SearchAPI, AggregateAPI, ConcateAggregateAPI } = useGeneAPI()

const variantType = ref({ data: [], categories: [] })
const variantClass = ref({ data: [], categories: [] })

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
	let variant_categories = []
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await AggregateAPI('exome_somatic', {
			column: 'variant_type',
			filters: { gene: gene_list },
			group_by: ['variant_type', 'gene'],
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_type))

		variantType.value.categories = variant_categories
		variantType.value.data = useVariantMatrix(response.result, variant_categories, gene_list, 'variant_type')
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateVariantClass = async () => {
	let variant_categories = []
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await AggregateAPI('exome_somatic', {
			column: 'variant_class',
			filters: { gene: gene_list },
			group_by: ['variant_class', 'gene'],
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_class))

		variantClass.value.categories = variant_categories
		variantClass.value.data = useVariantMatrix(response.result, variant_categories, gene_list, 'variant_class')
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

onBeforeMount(() => {
	nextTick(async () => {
		// Initialize the search variant type function
		// searchVariantType()
		aggregateVariantType()
		aggregateVariantClass()
	})
})
</script>

<style scoped></style>
