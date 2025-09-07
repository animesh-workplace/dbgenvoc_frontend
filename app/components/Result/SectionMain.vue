<template>
	<div class="grid lg:grid-cols-3 gap-8 p-8 md:grid-cols-2 grid-cols-1">
		<div class="col-span-3">
			<DataTable
				lazy
				rowHover
				paginator
				scrollable
				class="p-1"
				stripedRows
				size="small"
				showGridlines
				removableSort
				:rows="noOfRows"
				resizableColumns
				@sort="HandleSort"
				@page="HandlePage"
				scrollHeight="20rem"
				columnResizeMode="expand"
				:value="searchData.results"
				:totalRecords="searchData.total_results"
				:rowsPerPageOptions="[50, 100, 200, 500]"
			>
				<Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable />
			</DataTable>
		</div>

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

const noOfRows = ref(50)
const searchData = ref({})
const snvClass = ref({ data: [], categories: [] })
const variantType = ref({ data: [], categories: [] })
const variantClass = ref({ data: [], categories: [] })
const columns = [
	{ field: 'esm_id', header: 'DB ID' },
	{ field: 'gene', header: 'Gene' },
	{ field: 'entrez_gene_id', header: 'Entrez ID' },
	{ field: 'disease', header: 'Disease' },
	{ field: 'chrom', header: 'Chromosome' },
	{ field: 'start', header: 'Start' },
	{ field: 'end', header: 'End' },
	{ field: 'genome_change', header: 'Genome Change' },
	{ field: 'cDNA_change', header: 'cDNA Change' },
	{ field: 'codon_change', header: 'Codon Change' },
	{ field: 'protein_change', header: 'Protein Change' },
	{ field: 'variant_class', header: 'Variant Class' },
	{ field: 'variant_type', header: 'Variant Type' },
	{ field: 'ref_allele', header: 'Ref Allele' },
	{ field: 'tumor_seq_allele2', header: 'Tumor Allele' },
	{ field: 'dbsnp_rs', header: 'dbSNP ID' },
	{ field: 'sample_id', header: 'Sample ID' },
	{ field: 'annotation_transcript', header: 'Annotation Transcript' },
	{ field: 'transcript_strand', header: 'Transcript Strand' },
	{ field: 'transcript_exon', header: 'Transcript Exon' },
	{ field: 'reference', header: 'Reference' },
	{ field: 'reference_url', header: 'Reference URL' },
]

const props = defineProps({
	tableName: { type: String, default: '' },
})

const HandleSort = async (event) => {
	console.log('🚀 ~ :87 ~ HandleSort ~ event:', event)
	let sortOrder = 'asc'
	if (event.sortOrder === -1) {
		sortOrder = 'desc'
	}
	await searchVariantType(event.sortField, sortOrder, (event.page ?? 0) + 1)
}

const HandlePage = async (event) => {
	noOfRows.value = event.rows
	let sortOrder = 'asc'
	if (event.sortOrder === -1) {
		sortOrder = 'desc'
	}
	console.log('🚀 ~ :95 ~ HandlePage ~ event:', event, event.sortField, sortOrder, (event.page ?? 0) + 1)
	await searchVariantType(event.sortField, sortOrder, (event.page ?? 0) + 1)
}

const searchVariantType = async (sort_by = null, sort_order = 'asc', page = 1) => {
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await SearchAPI(props.tableName, {
			page,
			sort_by,
			sort_order,
			term: gene_list,
			exact_match: true,
			page_size: noOfRows,
			search_columns: ['gene'],
		})
		// console.log(response)
		searchData.value = response
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
			filters: { gene: gene_list, variant_type: 'SNP' },
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
		searchVariantType()
		aggregateSNVClass()
		aggregateVariantType()
		aggregateVariantClass()
	})
})
</script>

<style scoped></style>
