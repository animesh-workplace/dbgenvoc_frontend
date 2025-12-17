<template>
	<div class="px-8 pt-8">
		<div
			class="p-4 mb-2 text-lg text-blue-900 rounded-2xl text-center bg-sky-100 flex justify-center items-center gap-2"
		>
			<Icon name="tabler:table-filled" class="!w-5 !h-5" />
			<span class="font-semibold">Variations from {{ props.sectionName }}</span>
		</div>
	</div>

	<div v-if="!props.noData">
		<div class="p-8">
			<TableVariants
				:tableName="props.tableName"
				:filters="{
					logic: 'AND',
					conditions: [{ column: 'gene', operator: 'in', value: genesList }],
				}"
			/>
		</div>

		<div class="px-8 pt-8">
			<div
				class="p-4 mb-2 text-lg text-blue-900 rounded-2xl text-center bg-sky-50 flex justify-center items-center gap-2"
			>
				<Icon name="tabler:graph-filled" class="!w-5 !h-5" />
				<span class="font-semibold">Graphical Representation of {{ props.sectionName }} variations</span>
			</div>
		</div>

		<div class="px-8 pt-8">
			<div class="flex flex-wrap justify-center gap-4">
				<button
					:key="gene"
					@click="handleLegendClick(gene)"
					v-for="(gene, index) in visibleGenes"
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

				<button
					v-if="genesList.length > GENE_LIMIT"
					@click="isExpanded = !isExpanded"
					class="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100"
				>
					<span>{{ isExpanded ? 'Show Less' : `+${genesList.length - GENE_LIMIT} More` }}</span>
					<Icon :name="isExpanded ? 'tabler:chevron-up' : 'tabler:chevron-down'" class="w-4 h-4" />
				</button>
			</div>

			<div class="text-right mt-4">
				<div class="inline-flex items-center">
					<span class="mr-2 text-sm font-medium text-gray-700">Show in %</span>
					<ToggleSwitch v-model="percentageSwitcher" />
				</div>
			</div>
		</div>

		<ClientOnly>
			<div v-if="isLoading" class="p-8 text-center">
				<Skeleton height="20rem" width="100%" />
			</div>

			<div v-else>
				<div
					:key="disease"
					v-for="disease in diseaseList"
					class="grid gap-8 p-8 md:grid-cols-2 grid-cols-1"
					:class="
						variantClassNoncoding[disease]?.categories?.length > 0
							? 'lg:grid-cols-4'
							: 'lg:grid-cols-3'
					"
				>
					<div class="text-center">
						<div class="pb-2 text-sm font-semibold text-gray-700">
							Variant Class (Coding) ({{ disease }})
						</div>
						<GraphBar
							showAll
							horizontal
							:isPercent="percentageSwitcher"
							:plotData="variantClassCoding[disease]"
							:ref="(el) => setGraphRef(el, disease, 'coding')"
						/>
					</div>

					<div class="text-center" v-if="variantClassNoncoding[disease]?.categories?.length">
						<div class="pb-2 text-sm font-semibold text-gray-700">
							Variant Class (Non-Coding) ({{ disease }})
						</div>
						<GraphBar
							showAll
							:isPercent="percentageSwitcher"
							:plotData="variantClassNoncoding[disease]"
							:ref="(el) => setGraphRef(el, disease, 'noncoding')"
							:horizontal="variantClassNoncoding[disease]?.categories?.length > 4"
						/>
					</div>

					<div class="text-center">
						<div class="pb-2 text-sm font-semibold text-gray-700">Variant Type ({{ disease }})</div>
						<GraphBar
							title="Variant Type"
							:isPercent="percentageSwitcher"
							:plotData="variantType[disease]"
							:ref="(el) => setGraphRef(el, disease, 'type')"
						/>
					</div>

					<div class="text-center">
						<div class="pb-2 text-sm font-semibold text-gray-700">SNV Class ({{ disease }})</div>
						<GraphBar
							showAll
							title="SNV Class"
							:plotData="snvClass[disease]"
							:isPercent="percentageSwitcher"
							:ref="(el) => setGraphRef(el, disease, 'snv')"
						/>
					</div>
				</div>
			</div>

			<div class="px-8 pt-8 text-center">
				<div class="pb-2 text-sm font-semibold text-gray-700">Lollipop Plot</div>

				<Tabs
					v-model:value="selectedTab"
					scrollable
					@update:value="() => console.log('Value emitted from tabs')"
				>
					<TabList>
						<Tab v-for="(gene, index) in genesList" :key="index" :value="gene">
							{{ gene }}
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel v-for="(gene, index) in genesList" :key="index" :value="gene">
							<p class="m-0">{{ gene }}</p>
							<GraphLollipop :dataPoints="lollipopData" />
						</TabPanel>
					</TabPanels>
				</Tabs>
			</div>
		</ClientOnly>
	</div>
</template>

<script setup>
import { useGeneAPI } from '@/api/geneAPI'
import { useHelper } from '@/composables/useHelper'
import { uniq, map, sumBy, forEach, filter, orderBy } from 'lodash-es'

// --- Constants ---
const CODING_VARIANTS = [
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
const NON_CODING_VARIANTS = ['IGR', 'Intron', "3'UTR", "5'Flank", "5'UTR", 'ncRNA']
const SNV_CATEGORIES = ['C>T', 'G>A', 'C>A', 'G>T', 'C>G', 'G>C', 'T>A', 'A>T', 'T>C', 'A>G', 'T>G', 'A>C']

// --- Setup & Refs ---
const route = useRoute()
const { AggregateAPI, ConcateAggregateAPI } = useGeneAPI()
const { useVariantMatrix, useLollipopMatrix, color_scheme } = useHelper()

const props = defineProps({
	noData: Boolean,
	tableName: String,
	sectionName: String,
})

const GENE_LIMIT = 20
const isLoading = ref(true)
const isExpanded = ref(false)
const selectedTab = ref(null)
const percentageSwitcher = ref(false)
const genesList = ref([])
// const genesList = computed(() => [].concat(route.query.genes_list || []))

// Data State
const snvClass = ref({})
const graphRefs = ref({})
const diseaseList = ref([])
const variantType = ref({})
const hiddenSeries = ref([])
const variantClassCoding = ref({})
const variantClassNoncoding = ref({})
const lollipopData = ref([])

// --- Graph Ref Helper ---
const setGraphRef = (el, d, t) => {
	if (!graphRefs.value[d]) graphRefs.value[d] = {}
	if (el) graphRefs.value[d][t] = el
}

const handleLegendClick = (gene) => {
	if (hiddenSeries.value.includes(gene)) {
		hiddenSeries.value = hiddenSeries.value.filter((n) => n !== gene)
	} else {
		hiddenSeries.value.push(gene)
	}
	forEach(diseaseList.value, (d) => {
		if (graphRefs.value[d]) {
			forEach(Object.values(graphRefs.value[d]), (g) => g?.toggleSeries(gene))
		}
	})
}

const visibleGenes = computed(() => {
	// If expanded, show everything. If not, slice the array.
	if (isExpanded.value) return genesList.value
	return genesList.value.slice(0, GENE_LIMIT)
})

// --- Data Processors ---

const processVariantType = (result, group_total) => {
	forEach(diseaseList.value, (disease) => {
		const diseaseData = filter(result, (r) => r.disease === disease)
		// Calculate local total for this disease (crucial for per-disease percentage)
		const localTotal =
			group_total && group_total[disease] ? group_total[disease] : sumBy(diseaseData, 'aggregated_value')

		const categories = uniq(map(diseaseData, (item) => item.variant_type))
		const { matrix, sort_row_names } = useVariantMatrix(
			diseaseData,
			categories,
			genesList.value,
			'variant_type',
			true,
		)

		variantType.value[disease] = {
			data: matrix,
			total: localTotal,
			stack: genesList.value,
			categories: sort_row_names,
		}
	})
}

const processVariantClass = (result, group_total) => {
	forEach(diseaseList.value, (disease) => {
		const diseaseData = filter(result, (r) => r.disease === disease)
		const localTotal =
			group_total && group_total[disease] ? group_total[disease] : sumBy(diseaseData, 'aggregated_value')
		const all_categories = uniq(map(diseaseData, 'variant_class'))

		// --- Coding ---
		const coding_categories = filter(CODING_VARIANTS, (d) => all_categories.includes(d))
		const codingData = filter(diseaseData, (r) => CODING_VARIANTS.includes(r.variant_class))

		const { matrix: c_mat, sort_row_names: c_sort } = useVariantMatrix(
			codingData,
			coding_categories,
			genesList.value,
			'variant_class',
			true,
		)

		variantClassCoding.value[disease] = {
			data: c_mat,
			total: localTotal,
			stack: genesList.value,
			categories: map(c_sort, (d) => d.replaceAll('_', ' ').replaceAll('Mutation', '')),
		}

		// --- Non-Coding ---
		const noncoding_categories = filter(NON_CODING_VARIANTS, (d) => all_categories.includes(d))
		const nonCodingData = filter(diseaseData, (r) => NON_CODING_VARIANTS.includes(r.variant_class))

		const { matrix: nc_mat, sort_row_names: nc_sort } = useVariantMatrix(
			nonCodingData,
			noncoding_categories,
			genesList.value,
			'variant_class',
			true,
		)

		variantClassNoncoding.value[disease] = {
			data: nc_mat,
			total: localTotal,
			stack: genesList.value,
			categories: map(nc_sort, (d) => d.replaceAll('_', ' ').replaceAll('Mutation', '')),
		}
	})
}

const processSNVClass = (result, group_total) => {
	forEach(diseaseList.value, (disease) => {
		const diseaseData = filter(result, (r) => r.disease === disease)
		const localTotal =
			group_total && group_total[disease] ? group_total[disease] : sumBy(diseaseData, 'aggregated_value')

		const { matrix, sort_row_names } = useVariantMatrix(
			diseaseData,
			SNV_CATEGORIES,
			genesList.value,
			'concatenated_value',
		)

		snvClass.value[disease] = {
			data: matrix,
			total: localTotal,
			stack: genesList.value,
			categories: sort_row_names,
		}
	})
}

// --- Main Fetcher ---

const fetchData = async () => {
	if (!genesList.value.length || props.noData) return
	isLoading.value = true

	// Clear previous refs to avoid stale tooltip issues
	graphRefs.value = {}

	const filters = {
		logic: 'AND',
		conditions: [{ column: 'gene', operator: 'in', value: genesList.value }],
	}

	const aggType = percentageSwitcher.value ? 'percentage' : 'count'

	try {
		const [geneRes, typeRes, classRes, snvRes, lolliRes] = await Promise.all([
			// 0. Gene list
			AggregateAPI(props.tableName, {
				filters,
				group_by: ['gene'],
				column: 'variant_type',
				aggregation_type: 'count',
			}),

			// 1. Variant Type (Grouped by Disease)
			AggregateAPI(props.tableName, {
				filters,
				column: 'variant_type',
				aggregation_type: aggType,
				percentage_by: ['disease'],
				group_by: ['disease', 'variant_type', 'gene'],
			}),
			// 2. Variant Class (Grouped by Disease)
			AggregateAPI(props.tableName, {
				filters,
				column: 'variant_class',
				aggregation_type: aggType,
				percentage_by: ['disease'],
				group_by: ['disease', 'variant_class', 'gene'],
			}),
			// 3. SNV Class (Concatenated & Grouped by Disease)
			ConcateAggregateAPI(props.tableName, {
				separator: '>',
				aggregation_type: aggType,
				percentage_by: ['disease'],
				group_by: ['disease', 'gene'],
				columns: ['ref_allele', 'tumor_seq_allele2'],
				filters: {
					logic: 'AND',
					conditions: [...filters.conditions, { column: 'variant_type', operator: 'eq', value: 'SNP' }],
				},
			}),
			// 4. Lollipop Data (Need better grouping)
			AggregateAPI(props.tableName, {
				column: 'protein_change',
				aggregation_type: 'count',
				group_by: ['protein_change', 'variant_class'],
				filters: {
					logic: 'AND',
					conditions: [
						{ column: 'gene', operator: 'eq', value: 'TP53' },
						{ column: 'protein_change', operator: 'neq', value: null },
					],
				},
			}),
		])

		genesList.value = map(orderBy(geneRes.result, ['aggregated_value'], ['desc']), (item) => item.gene)
		lollipopData.value = map(useLollipopMatrix(lolliRes.result || []), (item) => [item.location, item.count])

		// Combine results to find ALL diseases present across datasets
		const allData = [...(typeRes.result || []), ...(classRes.result || []), ...(snvRes.result || [])]
		diseaseList.value = uniq(map(allData, 'disease')).sort()
		selectedTab.value = genesList.value[0]

		// Run Processors
		processSNVClass(snvRes.result || [], snvRes.group_totals)
		processVariantType(typeRes.result || [], typeRes.group_totals)
		processVariantClass(classRes.result || [], classRes.group_totals)
	} catch (error) {
		console.error('Failed to fetch variant data:', error)
	} finally {
		isLoading.value = false
	}
}

// --- Lifecycle ---
onMounted(() => {
	nextTick(async () => {
		fetchData()
	})
})

watch(
	() => route.query.genes_list,
	(q) => {
		genesList.value = q ? (Array.isArray(q) ? q : [q]) : []
	},
	{ immediate: true },
)
watch(percentageSwitcher, fetchData)
watch(() => props.tableName, fetchData)
</script>
