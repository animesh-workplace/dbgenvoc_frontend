<template>
	<div class="grid lg:grid-cols-3 gap-8 p-8 md:grid-cols-2 grid-cols-1">
		<div class="text-center">
			<div class="pb-2 text-sm font-semibold text-gray-700">Variant Classification Coding</div>
			<GraphBar :plotData="variantClass" showAll horizontal />
		</div>
		<div class="text-center">
			<div class="pb-2 text-sm font-semibold text-gray-700">Variant Type</div>
			<GraphBar :plotData="variantType" />
		</div>
		<div class="text-center">
			<div class="pb-2 text-sm font-semibold text-gray-700">SNV Class</div>
			<GraphBar :plotData="snvClass" showAll />
		</div>
		<!-- <GraphLollipop class="col-span-3" /> -->
	</div>
</template>

<script setup>
import { uniq, map } from 'lodash-es'
const { useVariantMatrix } = useHelper()
import { useGeneAPI } from '@/api/geneAPI'
const { SearchAPI, AggregateAPI, ConcateAggregateAPI } = useGeneAPI()

const snvClass = ref({ data: [], categories: [] })
const variantType = ref({ data: [], categories: [] })
const variantClass = ref({ data: [], categories: [] })

const props = defineProps({
	tableName: { type: String, default: '' },
})

const searchVariantType = async () => {
	try {
		const response = await SearchAPI(props.tableName, {
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
		const response = await AggregateAPI(props.tableName, {
			column: 'variant_type',
			filters: { gene: gene_list },
			group_by: ['variant_type', 'gene'],
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_type))

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			gene_list,
			'variant_type',
			true,
		)
		variantType.value.data = matrix
		variantType.value.categories = sort_row_names
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateVariantClass = async () => {
	let variant_categories = []
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await AggregateAPI(props.tableName, {
			column: 'variant_class',
			filters: { gene: gene_list },
			group_by: ['variant_class', 'gene'],
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_class))

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			gene_list,
			'variant_class',
			true,
		)
		variantClass.value.data = matrix
		variantClass.value.categories = map(sort_row_names, (d) =>
			d.replaceAll('_', ' ').replaceAll('Mutation', ''),
		)
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateSNVClass = async () => {
	let variant_categories = []
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await ConcateAggregateAPI(props.tableName, {
			separator: '>',
			group_by: ['gene'],
			aggregation_type: 'count',
			columns: ['ref_allele', 'tumor_seq_allele2'],
			filters: { gene: gene_list, varinat_type: 'SNP' },
		})
		variant_categories = ['C>T', 'G>A', 'C>A', 'G>T', 'C>G', 'G>C', 'T>A', 'A>T', 'T>C', 'A>G', 'T>G', 'A>C']

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			gene_list,
			'concatenated_value',
		)
		snvClass.value.data = matrix
		snvClass.value.categories = sort_row_names
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
		aggregateSNVClass()
	})
})
</script>

<style scoped></style>
