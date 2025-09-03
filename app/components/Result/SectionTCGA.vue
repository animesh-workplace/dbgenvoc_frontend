<template>
	<div class="p-8">
		<DataTable
			rowHover
			stripedRows
			size="small"
			showGridlines
			resizableColumns
			:value="searchData"
			columnResizeMode="expand"
		>
			<Column sortable :key="col.field" :field="col.field" :header="col.header" v-for="col of columns" />
		</DataTable>
	</div>
	<div
		:index="index"
		v-for="(disease, index) in diseaseList"
		class="grid lg:grid-cols-3 gap-8 p-8 md:grid-cols-2 grid-cols-1"
	>
		<div class="text-center">
			<div class="pb-2 text-sm font-semibold text-gray-700">
				Variant Classification Coding ({{ disease }})
			</div>
			<GraphBar :plotData="variantClass[disease]" showAll horizontal />
		</div>

		<div class="text-center">
			<div class="pb-2 text-sm font-semibold text-gray-700">Variant Type ({{ disease }})</div>
			<GraphBar :plotData="variantType[disease]" />
		</div>

		<div class="text-center">
			<div class="pb-2 text-sm font-semibold text-gray-700">SNV Class ({{ disease }})</div>
			<GraphBar :plotData="snvClass[disease]" showAll />
		</div>
		<!-- <GraphLollipop class="col-span-3" /> -->
	</div>
</template>

<script setup>
import { uniq, map, forEach } from 'lodash-es'
const { useVariantMatrix } = useHelper()
import { useGeneAPI } from '@/api/geneAPI'
const { SearchAPI, AggregateAPI, ConcateAggregateAPI } = useGeneAPI()

const diseaseList = ref([])
const snvClass = ref({
	'BM-TCGA': { data: [], categories: [] },
	'OC-TCGA': { data: [], categories: [] },
	'OT-TCGA': { data: [], categories: [] },
})
const variantType = ref({
	'BM-TCGA': { data: [], categories: [] },
	'OC-TCGA': { data: [], categories: [] },
	'OT-TCGA': { data: [], categories: [] },
})
const variantClass = ref({
	'BM-TCGA': { data: [], categories: [] },
	'OC-TCGA': { data: [], categories: [] },
	'OT-TCGA': { data: [], categories: [] },
})
const searchData = ref([])
const columns = [
	{ field: 'tcga_id', header: 'DB ID' },
	{ field: 'gene', header: 'Gene' },
	{ field: 'entrez_gene_id', header: 'Entrez Gene ID' },
	{ field: 'ncbi_build', header: 'NCBI Build' },
	{ field: 'chrom', header: 'Chromosome' },
	{ field: 'start', header: 'Start' },
	{ field: 'end', header: 'End' },
	{ field: 'variant_class', header: 'Variant Class' },
	{ field: 'variant_type', header: 'Variant Type' },
	{ field: 'ref_allele', header: 'Ref Allele' },
	{ field: 'tumor_seq_allele2', header: 'Tumor Seq Allele 2' },
	{ field: 'dbsnp_rs', header: 'dbSNP RS' },
	{ field: 'tumor_sample_barcode', header: 'Tumor Sample Barcode' },
	{ field: 'sample_id', header: 'Sample ID' },
	{ field: 'genome_change', header: 'Genome Change' },
	{ field: 'annotation_transcript', header: 'Annotation Transcript' },
	{ field: 'transcript_strand', header: 'Transcript Strand' },
	{ field: 'transcript_exon', header: 'Transcript Exon' },
	{ field: 'transcript_position', header: 'Transcript Position' },
	{ field: 'cDNA_change', header: 'cDNA Change' },
	{ field: 'codon_change', header: 'Codon Change' },
	{ field: 'protein_change', header: 'Protein Change' },
	{ field: 'disease', header: 'Disease' },
	{ field: 'reference_url', header: 'Reference URL' },
	{ field: 'reference', header: 'Reference' },
	{ field: 'remarks', header: 'Remarks' },
]

const props = defineProps({
	tableName: { type: String, default: '' },
})

const searchVariantType = async () => {
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await SearchAPI(props.tableName, {
			term: gene_list,
			exact_match: true,
			search_columns: ['gene'],
		})
		// console.log(response)
		searchData.value = response.results
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateDisease = async () => {
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await AggregateAPI(props.tableName, {
			column: 'disease',
			group_by: ['disease'],
			filters: { gene: gene_list },
		})
		diseaseList.value = uniq(map(response.result, (d) => d.disease))
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateVariantType = async (disease) => {
	let variant_categories = []
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await AggregateAPI(props.tableName, {
			column: 'variant_type',
			group_by: ['variant_type', 'gene'],
			filters: { gene: gene_list, disease: disease },
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_type))

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			gene_list,
			'variant_type',
			true,
		)
		variantType.value[disease].data = matrix
		variantType.value[disease].categories = sort_row_names
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateVariantClass = async (disease) => {
	let variant_categories = []
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await AggregateAPI(props.tableName, {
			column: 'variant_class',
			group_by: ['variant_class', 'gene'],
			filters: { gene: gene_list, disease: disease },
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_class))

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			gene_list,
			'variant_class',
			true,
		)
		variantClass.value[disease].data = matrix
		variantClass.value[disease].categories = map(sort_row_names, (d) =>
			d.replaceAll('_', ' ').replaceAll('Mutation', ''),
		)
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateSNVClass = async (disease) => {
	let variant_categories = []
	const gene_list = ['TP53', 'NOTCH1', 'BRCA2']
	try {
		const response = await ConcateAggregateAPI(props.tableName, {
			separator: '>',
			group_by: ['gene'],
			aggregation_type: 'count',
			columns: ['ref_allele', 'tumor_seq_allele2'],
			filters: { gene: gene_list, variant_type: 'SNP', disease: disease },
		})
		variant_categories = ['C>T', 'G>A', 'C>A', 'G>T', 'C>G', 'G>C', 'T>A', 'A>T', 'T>C', 'A>G', 'T>G', 'A>C']

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			gene_list,
			'concatenated_value',
		)
		snvClass.value[disease].data = matrix
		snvClass.value[disease].categories = sort_row_names
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

onBeforeMount(() => {
	nextTick(async () => {
		// Initialize the search variant type function
		searchVariantType()
		await aggregateDisease()
		map(diseaseList.value, (disease) => {
			aggregateSNVClass(disease)
			aggregateVariantType(disease)
			aggregateVariantClass(disease)
		})
	})
})
</script>

<style scoped></style>
