<template>
	<div class="px-8 pt-8">
		<div
			class="p-4 mb-2 text-lg text-blue-900 rounded-2xl text-center bg-sky-100 flex justify-center items-center gap-2"
		>
			<Icon name="tabler:table-filled" class="!w-5 !h-5" />
			<span class="font-semibold">Variations from dbGENVOC</span>
		</div>
	</div>

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
				<Column
					sortable
					:key="col.field"
					:field="col.field"
					:frozen="col.frozen"
					:header="col.header"
					v-for="col of columns.filter((c) => c.field !== 'reference_url')"
				>
					<template #body="slotProps">
						<!-- Handling reference URL -->
						<template v-if="col.field === 'reference'">
							<NuxtLink
								target="_blank"
								:to="slotProps.data.reference_url"
								class="text-blue-600 hover:underline"
							>
								{{ slotProps.data.reference }}
							</NuxtLink>
						</template>

						<!-- Handling Entrez Gene ID -->
						<template v-else-if="col.field === 'entrez_gene_id'">
							<NuxtLink
								target="_blank"
								:to="`https://www.ncbi.nlm.nih.gov/gene/${slotProps.data.entrez_gene_id}`"
								class="text-blue-600 hover:underline"
							>
								{{ slotProps.data.entrez_gene_id }}
							</NuxtLink>
						</template>

						<!-- Handling UCSC Browser -->
						<template v-else-if="col.field === 'genome_change_link'">
							<NuxtLink
								target="_blank"
								:to="generateUCSCUrl(slotProps.data.genome_change)"
								class="text-blue-600 hover:underline"
							>
								View in UCSC
							</NuxtLink>
						</template>

						<!-- Default case for other columns -->
						<template v-else>
							{{ slotProps.data[col.field] }}
						</template>
					</template>
				</Column>
			</DataTable>
		</div>

		<div class="pt-8 col-span-3">
			<div
				class="p-4 mb-2 text-lg text-blue-900 rounded-2xl text-center bg-sky-50 flex justify-center items-center gap-2"
			>
				<Icon name="tabler:graph-filled" class="!w-5 !h-5" />
				<span class="font-semibold">Graphical Representation of dbGENVOC variations</span>
			</div>
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
const route = useRoute()
const searchData = ref({})
const genesList = ref([])
const snvClass = ref({ data: [], categories: [] })
const variantType = ref({ data: [], categories: [] })
const variantClass = ref({ data: [], categories: [] })
const columns = [
	{ field: 'variant_id', header: 'DB ID', frozen: false },
	{ field: 'gene', header: 'Gene', frozen: true },
	{ field: 'entrez_gene_id', header: 'Entrez ID', frozen: false },
	{ field: 'disease', header: 'Disease', frozen: false },
	{ field: 'chrom', header: 'Chromosome', frozen: false },
	{ field: 'start', header: 'Start', frozen: false },
	{ field: 'end', header: 'End', frozen: false },
	{ field: 'genome_change', header: 'Genome Change', frozen: false },
	{ field: 'genome_change_link', header: 'UCSC Browser', frozen: false },
	{ field: 'cDNA_change', header: 'cDNA Change', frozen: false },
	{ field: 'codon_change', header: 'Codon Change', frozen: false },
	{ field: 'protein_change', header: 'Protein Change', frozen: false },
	{ field: 'variant_class', header: 'Variant Class', frozen: false },
	{ field: 'variant_type', header: 'Variant Type', frozen: false },
	{ field: 'ref_allele', header: 'Ref Allele', frozen: false },
	{ field: 'tumor_seq_allele2', header: 'Tumor Allele', frozen: false },
	{ field: 'dbsnp_rs', header: 'dbSNP ID', frozen: false },
	{ field: 'tumor_sample_barcode', header: 'Patient ID', frozen: false },
	{ field: 'annotation_transcript', header: 'Annotation Transcript', frozen: false },
	{ field: 'transcript_strand', header: 'Transcript Strand', frozen: false },
	{ field: 'transcript_exon', header: 'Transcript Exon', frozen: false },
	{ field: 'reference', header: 'Reference', frozen: false },
	{ field: 'reference_url', header: 'Reference URL', frozen: false },
]
const props = defineProps({
	tableName: { type: String, default: '' },
})

const parseGenomicCoordinates = (genomeChange) => {
	// Patterns for different variant types:
	// 1. SNVs: g.chr13:32910626C>T, chr13:32910626C>T
	// 2. Deletions: g.chr17:7577092delC, chr17:7577092delC
	// 3. Insertions: g.chr1:12345insA, chr1:12345insA
	// 4. Simple coordinates: g.chr13:32910626, chr13:32910626

	const patterns = [
		// SNVs with g. prefix
		/g\.(chr[XY\d]+):(\d+)([ACGT]>[ACGT])/i,
		// Deletions with g. prefix
		/g\.(chr[XY\d]+):(\d+)del([ACGT]+)/i,
		// Insertions with g. prefix
		/g\.(chr[XY\d]+):(\d+)ins([ACGT]+)/i,
		// Simple coordinates with g. prefix
		/g\.(chr[XY\d]+):(\d+)/i,

		// Same patterns without g. prefix
		/(chr[XY\d]+):(\d+)([ACGT]>[ACGT])/i,
		/(chr[XY\d]+):(\d+)del([ACGT]+)/i,
		/(chr[XY\d]+):(\d+)ins([ACGT]+)/i,
		/(chr[XY\d]+):(\d+)/i,
	]

	for (const pattern of patterns) {
		const match = genomeChange.match(pattern)
		if (match) {
			const chromosome = match[1]
			const position = parseInt(match[2])

			// For UCSC Genome Browser, we typically show a small region around the variant
			const start = Math.max(1, position - 50) // 50bp upstream
			const end = position + 50 // 50bp downstream

			return {
				chromosome,
				position,
				start,
				end,
				formattedPosition: `${chromosome}:${start}-${end}`,
			}
		}
	}
	return null
}

// Function to generate UCSC Genome Browser URL
const generateUCSCUrl = (genomeChange) => {
	const coords = parseGenomicCoordinates(genomeChange)
	if (!coords) return '#'

	return `https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=${coords.formattedPosition}&hgsid=783385835_z0061mD0u0xo6HFQCdLHaeOZp9UA`
}

const HandleSort = async (event) => {
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
	await searchVariantType(event.sortField, sortOrder, (event.page ?? 0) + 1)
}

const searchVariantType = async (sort_by = null, sort_order = 'asc', page = 1) => {
	try {
		const response = await SearchAPI(props.tableName, {
			page,
			sort_by,
			sort_order,
			exact_match: true,
			page_size: noOfRows,
			term: genesList.value,
			search_columns: ['gene'],
		})
		searchData.value = response
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateVariantType = async () => {
	let variant_categories = []
	try {
		const response = await AggregateAPI(props.tableName, {
			column: 'variant_type',
			aggregation_type: 'count',
			group_by: ['variant_type', 'gene'],
			filters: { logic: 'AND', conditions: [{ column: 'gene', operator: 'in', value: genesList.value }] },
		})

		variant_categories = uniq(map(response.result, (item) => item.variant_type))

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			genesList.value,
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
	try {
		const response = await AggregateAPI(props.tableName, {
			column: 'variant_class',
			aggregation_type: 'percentage',
			group_by: ['variant_class', 'gene'],
			filters: { logic: 'AND', conditions: [{ column: 'gene', operator: 'in', value: genesList.value }] },
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_class))

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			genesList.value,
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
	try {
		const response = await ConcateAggregateAPI(props.tableName, {
			separator: '>',
			group_by: ['gene'],
			aggregation_type: 'count',
			columns: ['ref_allele', 'tumor_seq_allele2'],
			filters: { gene: genesList.value, variant_type: 'SNP' },
		})
		variant_categories = ['C>T', 'G>A', 'C>A', 'G>T', 'C>G', 'G>C', 'T>A', 'A>T', 'T>C', 'A>G', 'T>G', 'A>C']

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			genesList.value,
			'concatenated_value',
		)
		snvClass.value.data = matrix
		snvClass.value.categories = sort_row_names
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

watch(
	() => props.tableName,
	() => {
		nextTick(async () => {
			searchVariantType()
			aggregateSNVClass()
			aggregateVariantType()
			aggregateVariantClass()
		})
	},
	{ immediate: true }, // This will run the watcher callback immediately
)

onBeforeMount(() => {
	nextTick(async () => {
		genesList.value = route.query.genes_list
		// Initialize the search variant type function
		searchVariantType()
		aggregateSNVClass()
		aggregateVariantType()
		aggregateVariantClass()
	})
})
</script>

<style scoped></style>
