<template>
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
		@sort="onSort"
		@page="onPage"
		resizableColumns
		:value="tableData"
		scrollHeight="20rem"
		:rows="pagination.rows"
		columnResizeMode="expand"
		:totalRecords="totalRecords"
		:loading="loading || pending"
		:rowsPerPageOptions="[10, 25, 50, 100]"
		:pt="{
			header: 'rounded-t-2xl !p-4 !bg-sky-50',
			pcPaginator: {
				root: '!bg-sky-50',
				last: 'hover:!bg-blue-100',
				prev: 'hover:!bg-blue-100',
				next: 'hover:!bg-blue-100',
				first: 'hover:!bg-blue-100',
				page: '!bg-blue-100 hover:!bg-blue-200',
				pcRowPerPageDropdown: { root: '!rounded-2xl' },
				paginatorContainer: 'rounded-b-2xl p-1 !bg-sky-50',
			},
		}"
	>
		<template #header>
			<div class="grid lg:grid-cols-3 grid-cols-1 justify-end">
				<div class="col-start-3 flex items-center space-x-2">
					<FloatLabel variant="on" class="flex-1">
						<IconField>
							<InputIcon>
								<Icon name="tabler:search" class="!w-5 !h-5 text-gray-500" />
							</InputIcon>
							<InputText
								fluid
								id="table_search"
								v-model="keyword_search"
								:pt="{ root: '!rounded-2xl !focus:border-1 !focus:border-blue-800 ' }"
							/>
							<InputIcon v-if="keyword_search" @click="keyword_search = ''">
								<Icon
									name="solar:close-circle-line-duotone"
									class="!w-5 !h-5 text-gray-500 cursor-pointer"
								/>
							</InputIcon>
						</IconField>
						<label for="table_search">Keyword Search</label>
					</FloatLabel>

					<button
						class="flex-none flex items-center space-x-2 px-2 py-0.5 rounded-full text-sm transition-all cursor-pointer"
					>
						<Icon
							name="solar:cloud-download-bold-duotone"
							class="!w-8 !h-8 text-gray-500 hover:text-blue-800 cursor-pointer"
						/>
					</button>
				</div>
			</div>
		</template>

		<Column
			sortable
			:key="col.field"
			:field="col.field"
			:frozen="col.frozen"
			:header="col.header"
			:pt="{ columnHeaderContent: 'justify-between' }"
			v-for="col of columns.filter((c) => c.field !== 'reference_url')"
		>
			<template #body="slotProps">
				<template v-if="col.field === 'reference'">
					<NuxtLink
						target="_blank"
						:to="slotProps.data.reference_url"
						v-if="slotProps.data.reference_url"
						class="text-blue-600 hover:underline"
					>
						{{ slotProps.data.reference }}
					</NuxtLink>
					<span v-else>{{ slotProps.data.reference }}</span>
				</template>

				<template v-else-if="col.field === 'entrez_gene_id'">
					<NuxtLink
						target="_blank"
						class="text-blue-600 hover:underline"
						:to="`https://www.ncbi.nlm.nih.gov/gene/${slotProps.data.entrez_gene_id}`"
					>
						{{ slotProps.data.entrez_gene_id }}
					</NuxtLink>
				</template>

				<template v-else-if="col.field === 'genome_change_link'">
					<NuxtLink
						target="_blank"
						class="text-blue-600 hover:underline"
						:to="generateUCSCUrl(slotProps.data.genome_change)"
					>
						View in UCSC
					</NuxtLink>
				</template>

				<template v-else>
					{{ slotProps.data[col.field] }}
				</template>
			</template>
		</Column>
	</DataTable>
</template>

<script setup>
import { useGeneAPI } from '@/api/geneAPI'
const { SearchAPI } = useGeneAPI()

// 1. GENERIC PROPS
const props = defineProps({
	tableName: { type: String, required: true },
	// The structured filter object (logic: 'AND', conditions: [...])
	filters: { type: Object, default: () => ({ logic: 'AND', conditions: [] }) },
	// Any other top-level parameters (e.g., 'term', 'search_text')
	extraParams: { type: Object, default: () => ({}) },
})

// --- State ---
const tableData = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const keyword_search = ref('')

// Internal Pagination State
const pagination = ref({
	page: 1,
	rows: 25,
	sortField: null,
	sortOrder: 'asc',
})

// --- Helper to Construct Payload ---
const getPayload = () => {
	return {
		// Internal State (Pagination/Sort)
		term: keyword_search.value,
		page: pagination.value.page,
		page_size: pagination.value.rows,
		sort_by: pagination.value.sortField,
		sort_order: pagination.value.sortOrder,
		// External State (Props)
		filters: props.filters,
		...props.extraParams, // Spreads 'term' or other keys here
	}
}

// --- API Logic ---

// 1. Initial SSR Load
const { data, pending } = await useAsyncData(
	() => `table-${props.tableName}-${JSON.stringify(props.filters)}-${pagination.value.page}`,
	async () => {
		if (!props.tableName) return { results: [], total_results: 0 }
		return await SearchAPI(props.tableName, getPayload())
	},
	{
		watch: [() => props.tableName],
	},
)

watch(
	data,
	(newVal) => {
		if (newVal) {
			tableData.value = newVal.results
			totalRecords.value = newVal.total_results
		}
	},
	{ immediate: true },
)

watchDebounced(
	keyword_search,
	() => {
		pagination.value.page = 1 // Reset to first page on new search
		fetchClientSide()
	},
	{ debounce: 500 },
)

// 2. Client-Side Fetch
const fetchClientSide = async () => {
	loading.value = true
	try {
		const response = await SearchAPI(props.tableName, getPayload())
		tableData.value = response.results
		totalRecords.value = response.total_results
	} catch (error) {
		console.error('Table fetch error', error)
	} finally {
		loading.value = false
	}
}

// --- Event Handlers ---

const onSort = (event) => {
	pagination.value.sortField = event.sortField
	pagination.value.sortOrder = event.sortOrder === -1 ? 'desc' : 'asc'
	fetchClientSide()
}

const onPage = (event) => {
	pagination.value.rows = event.rows
	pagination.value.page = (event.page ?? 0) + 1
	fetchClientSide()
}

// IMPORTANT: Watch for external filter changes to reset table
watch(
	[() => props.filters, () => props.extraParams],
	() => {
		pagination.value.page = 1 // Reset to first page
		fetchClientSide()
	},
	{ deep: true },
)

// --- Columns & Utilities ---
const columns = [
	{ field: 'variant_id', header: 'DB ID', frozen: false },
	{ field: 'tumor_sample_barcode', header: 'Patient ID', frozen: true },
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
	{ field: 'annotation_transcript', header: 'Annotation Transcript', frozen: false },
	{ field: 'transcript_strand', header: 'Transcript Strand', frozen: false },
	{ field: 'transcript_exon', header: 'Transcript Exon', frozen: false },
	{ field: 'reference', header: 'Reference', frozen: false },
	{ field: 'reference_url', header: 'Reference URL', frozen: false },
]

const parseGenomicCoordinates = (genomeChange) => {
	const patterns = [
		/g\.(chr[XY\d]+):(\d+)([ACGT]>[ACGT])/i,
		/g\.(chr[XY\d]+):(\d+)del([ACGT]+)/i,
		/g\.(chr[XY\d]+):(\d+)ins([ACGT]+)/i,
		/g\.(chr[XY\d]+):(\d+)/i,
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
			const start = Math.max(1, position - 50)
			const end = position + 50
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

const generateUCSCUrl = (genomeChange) => {
	const coords = parseGenomicCoordinates(genomeChange)
	if (!coords) return '#'
	return `https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=${coords.formattedPosition}&hgsid=783385835_z0061mD0u0xo6HFQCdLHaeOZp9UA`
}
</script>
