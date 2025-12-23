<template>
	<Dialog v-model:visible="visible" modal header="Solve CAPTCHA">
		<div class="flex items-center gap-4 mb-4">
			<VueHcaptcha
				ref="Hcaptcha"
				@verify="exportCSV"
				sitekey="0c102196-a888-4902-8dfc-b10251923386"
				@expired="() => console.log('Captcha expired')"
				@error="(err) => console.log('Some error found', err)"
			/>
		</div>
	</Dialog>

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
		ref="dataTableRef"
		scrollHeight="20rem"
		:rows="pagination.rows"
		columnResizeMode="expand"
		:totalRecords="totalRecords"
		:loading="loading || pending"
		:exportFilename="downloadFilename"
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
						@click="visible = true"
						class="flex-none flex items-center space-x-2 px-2 py-2 rounded-full text-sm transition-all cursor-pointer hover:bg-blue-200 group"
					>
						<Icon
							name="solar:cloud-download-bold-duotone"
							class="!w-7 !h-7 text-gray-500 group-hover:text-blue-800 cursor-pointer"
						/>
					</button>

					<div class="relative inline-block">
						<button
							@click="openLockDropdown"
							class="flex-none flex items-center space-x-2 px-2 py-2 rounded-full text-sm transition-all cursor-pointer hover:bg-blue-200 group"
						>
							<Icon
								name="solar:lock-keyhole-minimalistic-bold-duotone"
								class="!w-7 !h-7 text-gray-500 group-hover:text-blue-800 cursor-pointer"
							/>
						</button>

						<MultiSelect
							ref="lockSelect"
							optionValue="index"
							optionLabel="header"
							:selectionLimit="LockLimit"
							v-model="lockSelectedColumns"
							class="absolute-hidden-select"
							@update:modelValue="lockColumn"
							:options="columns.filter((c) => c.field !== 'reference_url')"
						/>
					</div>

					<div class="relative inline-block">
						<button
							@click="openDropdown"
							class="relative flex-none flex items-center space-x-2 px-2 py-2 rounded-full text-sm transition-all cursor-pointer hover:bg-blue-200 group"
						>
							<Icon
								name="solar:filter-bold-duotone"
								class="!w-7 !h-7 text-gray-500 group-hover:text-blue-800 cursor-pointer"
							/>
						</button>

						<MultiSelect
							ref="columnSelect"
							optionValue="index"
							optionLabel="header"
							v-model="selectedColumns"
							class="absolute-hidden-select"
							@update:model-value="showColumn"
							:options="columns.filter((c) => c.field !== 'reference_url')"
						/>
					</div>
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
			v-for="col of columns.filter((c) => c.field !== 'reference_url' && c.show)"
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
import { map } from 'lodash-es'
import { useNotivue } from 'notivue'
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha'

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
const config = useNotivue()

// --- State ---
const LockLimit = 4
const tableData = ref([])
const visible = ref(false)
const Hcaptcha = ref(null)
const loading = ref(false)
const totalRecords = ref(0)
const dataTableRef = ref(null)
const keyword_search = ref('')
const lockSelectedColumns = ref([1, 2])
const downloadFilename = ref('export_variants_')
const lockSelect = ref(null) // Reference to the MultiSelect component
const columnSelect = ref(null) // Reference to the MultiSelect component
const selectedColumns = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22])

// Internal Pagination State
const pagination = ref({
	page: 1,
	rows: 25,
	sortField: null,
	sortOrder: 'asc',
})

// --- Helper ---
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

const openDropdown = (event) => {
	columnSelect.value.show()
}

const openLockDropdown = (event) => {
	lockSelect.value.show()
}

const lockColumn = (data) => {
	map(columns.value, (col) => (col.frozen = false))
	map(data, (colIndex) => {
		columns.value[colIndex].frozen = true
	})
}

const showColumn = (data) => {
	map(columns.value, (col) => (col.show = false))
	map(data, (colIndex) => {
		columns.value[colIndex].show = true
	})
}

const exportCSV = async (event) => {
	console.log('CAPTCHA solved, exporting CSV...', event)
	const now = new Date()
	const timestamp = now.toLocaleString('sv-SE').replace(/ /g, '_').replace(/:/g, '-')
	downloadFilename.value = `${props.tableName}_export_${timestamp}`
	await nextTick()
	dataTableRef.value.exportCSV()
	visible.value = false
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
const columns = ref([
	{ show: true, index: 0, field: 'variant_id', header: 'DB ID', frozen: false },
	{ show: true, index: 1, field: 'tumor_sample_barcode', header: 'Patient ID', frozen: true },
	{ show: true, index: 2, field: 'gene', header: 'Gene', frozen: true },
	{ show: true, index: 3, field: 'entrez_gene_id', header: 'Entrez ID', frozen: false },
	{ show: true, index: 4, field: 'disease', header: 'Disease', frozen: false },
	{ show: true, index: 5, field: 'chrom', header: 'Chromosome', frozen: false },
	{ show: true, index: 6, field: 'start', header: 'Start', frozen: false },
	{ show: true, index: 7, field: 'end', header: 'End', frozen: false },
	{ show: true, index: 8, field: 'genome_change', header: 'Genome Change', frozen: false },
	{ show: true, index: 9, field: 'genome_change_link', header: 'UCSC Browser', frozen: false },
	{ show: true, index: 10, field: 'cDNA_change', header: 'cDNA Change', frozen: false },
	{ show: true, index: 11, field: 'codon_change', header: 'Codon Change', frozen: false },
	{ show: true, index: 12, field: 'protein_change', header: 'Protein Change', frozen: false },
	{ show: true, index: 13, field: 'variant_class', header: 'Variant Class', frozen: false },
	{ show: true, index: 14, field: 'variant_type', header: 'Variant Type', frozen: false },
	{ show: true, index: 15, field: 'ref_allele', header: 'Ref Allele', frozen: false },
	{ show: true, index: 16, field: 'tumor_seq_allele2', header: 'Tumor Allele', frozen: false },
	{ show: true, index: 17, field: 'dbsnp_rs', header: 'dbSNP ID', frozen: false },
	{ show: true, index: 18, field: 'annotation_transcript', header: 'Annotation Transcript', frozen: false },
	{ show: true, index: 19, field: 'transcript_strand', header: 'Transcript Strand', frozen: false },
	{ show: true, index: 20, field: 'transcript_exon', header: 'Transcript Exon', frozen: false },
	{ show: true, index: 21, field: 'reference', header: 'Reference', frozen: false },
	{ show: true, index: 22, field: 'reference_url', header: 'Reference URL', frozen: false },
])

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

<style>
.absolute-hidden-select {
	bottom: 0;
	left: 50%;
	overflow: hidden;
	opacity: 0 !important;
	width: 0px !important;
	height: 0px !important;
	transform: translateX(-50%);
	position: absolute !important;
	pointer-events: none !important;
}
</style>
