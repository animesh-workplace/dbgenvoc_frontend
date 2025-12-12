<template>
	<div class="px-8 pt-8">
		<div
			class="p-4 mb-2 text-lg text-blue-900 rounded-2xl text-center bg-sky-100 flex justify-center items-center gap-2"
		>
			<Icon name="tabler:table-filled" class="!w-5 !h-5" />
			<span class="font-semibold">Variations from TCGA (Exome somatic specific)</span>
		</div>
	</div>

	<div v-if="!noData">
		<div class="p-8">
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

		<div class="px-8 pt-8">
			<div
				class="p-4 mb-2 text-lg text-blue-900 rounded-2xl text-center bg-sky-50 flex justify-center items-center gap-2"
			>
				<Icon name="tabler:graph-filled" class="!w-5 !h-5" />
				<span class="font-semibold">Graphical Representation of TCGA variations</span>
			</div>
		</div>

		<div class="px-8 pt-8">
			<div class="flex flex-wrap justify-center gap-4">
				<button
					:key="gene"
					@click="handleLegendClick(gene)"
					v-for="(gene, index) in genesList"
					:style="{ backgroundColor: color_scheme[index] + '33' }"
					class="flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-all border"
					:class="
						!hiddenSeries.includes(gene)
							? 'border-gray-200 shadow-sm hover:shadow-md cursor-pointer'
							: 'border-gray-200 opacity-70 inset-shadow-sm hover:inset-shadow-md cursor-pointer'
					"
				>
					<span class="w-3 h-3 rounded-full" :style="{ backgroundColor: color_scheme[index] }"></span>
					<span class="font-medium text-gray-700">{{ gene }}</span>
				</button>
			</div>

			<div class="text-right">
				<div class="inline-flex items-center">
					<span class="mr-2 text-sm font-medium text-gray-700">Show in %</span>
					<ToggleSwitch v-model="percentageSwitcher" />
				</div>
			</div>
		</div>

		<div
			:index="index"
			v-for="(disease, index) in diseaseList"
			class="grid gap-8 p-8 md:grid-cols-2 grid-cols-1"
			:class="variantClassNoncoding[disease]?.categories?.length > 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'"
		>
			<div class="text-center">
				<div class="pb-2 text-sm font-semibold text-gray-700">
					Variant Classification Coding ({{ disease }})
				</div>
				<GraphBar
					showAll
					horizontal
					:isPercent="percentageSwitcher"
					:plotData="variantClassCoding[disease]"
					:ref="
						(el) => {
							if (el) variantClassCoding[disease].graph = el
						}
					"
				/>
			</div>

			<div class="text-center" v-if="variantClassNoncoding[disease].categories.length > 0">
				<div class="pb-2 text-sm font-semibold text-gray-700">
					Variant Classification Non-Coding ({{ disease }})
				</div>
				<GraphBar
					showAll
					horizontal
					:isPercent="percentageSwitcher"
					:plotData="variantClassNoncoding[disease]"
					:ref="
						(el) => {
							if (el) variantClassNoncoding[disease].graph = el
						}
					"
				/>
			</div>

			<div class="text-center">
				<div class="pb-2 text-sm font-semibold text-gray-700">Variant Type ({{ disease }})</div>
				<GraphBar
					:isPercent="percentageSwitcher"
					:plotData="variantType[disease]"
					:ref="
						(el) => {
							if (el) variantType[disease].graph = el
						}
					"
				/>
			</div>

			<div class="text-center">
				<div class="pb-2 text-sm font-semibold text-gray-700">SNV Class ({{ disease }})</div>
				<GraphBar
					showAll
					:plotData="snvClass[disease]"
					:isPercent="percentageSwitcher"
					:ref="
						(el) => {
							if (el) snvClass[disease].graph = el
						}
					"
				/>
			</div>
			<!-- <GraphLollipop class="col-span-4" /> -->
		</div>
	</div>
</template>

<script setup>
import { uniq, map } from 'lodash-es'
const { useVariantMatrix, color_scheme } = useHelper()
import { useGeneAPI } from '@/api/geneAPI'
const { SearchAPI, AggregateAPI, ConcateAggregateAPI } = useGeneAPI()

const route = useRoute()
const noOfRows = ref(50)
const genesList = ref([])
const searchData = ref({})
const diseaseList = ref([])
const hiddenSeries = ref([])
const percentageSwitcher = ref(false)
const snvClass = ref({
	'BM-TCGA': { data: [], categories: [], total: 0, graph: null },
	'OC-TCGA': { data: [], categories: [], total: 0, graph: null },
	'OT-TCGA': { data: [], categories: [], total: 0, graph: null },
})
const variantType = ref({
	'BM-TCGA': { data: [], categories: [], total: 0, graph: null },
	'OC-TCGA': { data: [], categories: [], total: 0, graph: null },
	'OT-TCGA': { data: [], categories: [], total: 0, graph: null },
})
const variantClassCoding = ref({
	'BM-TCGA': { data: [], categories: [], total: 0, graph: null },
	'OC-TCGA': { data: [], categories: [], total: 0, graph: null },
	'OT-TCGA': { data: [], categories: [], total: 0, graph: null },
})
const variantClassNoncoding = ref({
	'BM-TCGA': { data: [], categories: [], total: 0, graph: null },
	'OC-TCGA': { data: [], categories: [], total: 0, graph: null },
	'OT-TCGA': { data: [], categories: [], total: 0, graph: null },
})
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

const props = defineProps({
	tableName: { type: String, default: '' },
	noData: { type: Boolean, default: false },
})

const handleLegendClick = (seriesName) => {
	// 1. Toggle UI state (for greying out the button)
	if (hiddenSeries.value.includes(seriesName)) {
		hiddenSeries.value = hiddenSeries.value.filter((n) => n !== seriesName)
	} else {
		hiddenSeries.value.push(seriesName)
	}

	// 2. Trigger the toggle in all child charts
	// We use optional chaining (?.) just in case a chart isn't mounted yet
	map(diseaseList.value, (disease) => {
		variantClass.value[disease].graph?.toggleSeries(seriesName)
		variantType.value[disease].graph?.toggleSeries(seriesName)
		snvClass.value[disease].graph?.toggleSeries(seriesName)
	})
}

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
			page_size: noOfRows,
			filters: { logic: 'AND', conditions: [{ column: 'gene', operator: 'in', value: genesList.value }] },
		})
		searchData.value = response
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateDisease = async () => {
	try {
		const response = await AggregateAPI(props.tableName, {
			column: 'disease',
			group_by: ['disease'],
			aggregation_type: 'distinct_count',
			filters: { logic: 'AND', conditions: [{ column: 'gene', operator: 'in', value: genesList.value }] },
		})
		diseaseList.value = map(response.result, (d) => d.disease)
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateVariantType = async (disease) => {
	let variant_categories = []
	try {
		const response = await AggregateAPI(props.tableName, {
			column: 'variant_type',
			group_by: ['variant_type', 'gene'],
			aggregation_type: percentageSwitcher.value ? 'percentage' : 'count',
			filters: {
				logic: 'AND',
				conditions: [
					{ column: 'gene', operator: 'in', value: genesList.value },
					{ column: 'disease', operator: 'eq', value: disease },
				],
			},
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_type))

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			genesList.value,
			'variant_type',
			true,
		)
		variantType.value[disease].data = matrix
		variantType.value[disease].categories = sort_row_names
		variantType.value[disease].total = response.total_records
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateVariantClass = async (disease) => {
	let coding = [
		'Silent',
		'Splice_Site',
		'In_Frame_Ins',
		'In_Frame_Del',
		'Stop_Codon_Ins',
		'Stop_Codon_Del',
		'Frame_Shift_Del',
		'Frame_Shift_Ins',
		'Start_Codon_SNP',
		'Start_Codon_Ins',
		'Start_Codon_Del',
		'Nonstop_Mutation',
		'Missense_Mutation',
		'Nonsense_Mutation',
		'De_novo_Start_InFrame',
		'De_novo_Start_OutOfFrame',
	]
	let non_coding = ['IGR', 'Intron', "3'UTR", "5'Flank", "5'UTR", 'ncRNA']

	let variant_categories = []

	try {
		const response = await AggregateAPI(props.tableName, {
			column: 'variant_class',
			group_by: ['variant_class', 'gene'],
			aggregation_type: percentageSwitcher.value ? 'percentage' : 'count',
			filters: {
				logic: 'AND',
				conditions: [
					{ column: 'disease', operator: 'eq', value: disease },
					{ column: 'gene', operator: 'in', value: genesList.value },
				],
			},
		})
		variant_categories = uniq(map(response.result, (item) => item.variant_class))
		const coding_categories = coding.filter((d) => variant_categories.includes(d))
		const noncoding_categories = non_coding.filter((d) => variant_categories.includes(d))

		const { matrix: coding_matrix, sort_row_names: coding_sort_row_names } = useVariantMatrix(
			response.result,
			coding_categories,
			genesList.value,
			'variant_class',
			true,
		)

		variantClassCoding.value[disease].data = coding_matrix
		variantClassCoding.value[disease].total = response.total_records
		variantClassCoding.value[disease].categories = map(coding_sort_row_names, (d) =>
			d.replaceAll('_', ' ').replaceAll('Mutation', ''),
		)

		const { matrix: non_coding_matrix, sort_row_names: non_coding_sort_row_names } = useVariantMatrix(
			response.result,
			noncoding_categories,
			genesList.value,
			'variant_class',
			true,
		)

		variantClassNoncoding.value[disease].data = non_coding_matrix
		variantClassNoncoding.value[disease].total = response.total_records
		variantClassNoncoding.value[disease].categories = map(non_coding_sort_row_names, (d) =>
			d.replaceAll('_', ' ').replaceAll('Mutation', ''),
		)
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateSNVClass = async (disease) => {
	let variant_categories = []
	try {
		const response = await ConcateAggregateAPI(props.tableName, {
			separator: '>',
			group_by: ['gene'],
			columns: ['ref_allele', 'tumor_seq_allele2'],
			aggregation_type: percentageSwitcher.value ? 'percentage' : 'count',
			filters: {
				logic: 'AND',
				conditions: [
					{ column: 'disease', operator: 'eq', value: disease },
					{ column: 'variant_type', operator: 'eq', value: 'SNP' },
					{ column: 'gene', operator: 'in', value: genesList.value },
				],
			},
		})
		variant_categories = ['C>T', 'G>A', 'C>A', 'G>T', 'C>G', 'G>C', 'T>A', 'A>T', 'T>C', 'A>G', 'T>G', 'A>C']

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			variant_categories,
			genesList.value,
			'concatenated_value',
		)
		snvClass.value[disease].data = matrix
		snvClass.value[disease].categories = sort_row_names
		snvClass.value[disease].total = response.total_records
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

watch(
	() => props.tableName,
	() => {
		nextTick(async () => {
			searchVariantType()
			await aggregateDisease()
			map(diseaseList.value, (disease) => {
				aggregateSNVClass(disease)
				aggregateVariantType(disease)
				aggregateVariantClass(disease)
			})
		})
	},
	{ immediate: true }, // This will run the watcher callback immediately
)

watch(
	() => percentageSwitcher.value,
	() => {
		nextTick(async () => {
			searchVariantType()
			await aggregateDisease()
			map(diseaseList.value, (disease) => {
				aggregateSNVClass(disease)
				aggregateVariantType(disease)
				aggregateVariantClass(disease)
			})
		})
	},
	{ immediate: true }, // This will run the watcher callback immediately
)

onBeforeMount(() => {
	nextTick(async () => {
		genesList.value = [].concat(route.query.genes_list || [])
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
