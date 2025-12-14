<template>
	<div class="px-8 pt-8">
		<div
			class="p-4 mb-2 text-lg text-blue-900 rounded-2xl text-center bg-sky-100 flex justify-center items-center gap-2"
		>
			<Icon name="tabler:table-filled" class="!w-5 !h-5" />
			<span class="font-semibold">Variations from TCGA (Exome somatic specific)</span>
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
					v-for="disease in diseaseList"
					:key="disease"
					class="grid gap-8 p-8 grid-cols-1 md:grid-cols-2 border-b last:border-0"
					:class="
						variantClassNoncoding[disease]?.categories?.length > 0
							? 'lg:grid-cols-4'
							: 'lg:grid-cols-3'
					"
				>
					<GraphBar
						horizontal
						showAll
						title="Variant Class (Coding)"
						:ref="(el) => setGraphRef(el, disease, 'coding')"
						:isPercent="percentageSwitcher"
						:plotData="variantClassCoding[disease]"
					/>

					<GraphBar
						v-if="variantClassNoncoding[disease]?.categories?.length"
						horizontal
						showAll
						title="Variant Class (Non-Coding)"
						:ref="(el) => setGraphRef(el, disease, 'noncoding')"
						:isPercent="percentageSwitcher"
						:plotData="variantClassNoncoding[disease]"
					/>

					<GraphBar
						title="Variant Type"
						:ref="(el) => setGraphRef(el, disease, 'type')"
						:isPercent="percentageSwitcher"
						:plotData="variantType[disease]"
					/>

					<GraphBar
						showAll
						title="SNV Class"
						:ref="(el) => setGraphRef(el, disease, 'snv')"
						:isPercent="percentageSwitcher"
						:plotData="snvClass[disease]"
					/>
				</div>
			</div>
		</ClientOnly>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { uniq, map, sumBy } from 'lodash-es'
import { useGeneAPI } from '@/api/geneAPI'
import { useHelper } from '@/composables/useHelper'

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
const { useVariantMatrix, color_scheme } = useHelper()
const { AggregateAPI, ConcateAggregateAPI } = useGeneAPI()

const props = defineProps({
	tableName: String,
	noData: Boolean,
})

const isLoading = ref(true)
const percentageSwitcher = ref(false)
const genesList = computed(() => [].concat(route.query.genes_list || []))

// Data State
const snvClass = ref({})
const graphRefs = ref({})
const diseaseList = ref([])
const variantType = ref({})
const hiddenSeries = ref([])
const variantClassCoding = ref({})
const variantClassNoncoding = ref({})

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
	diseaseList.value.forEach((d) => {
		if (graphRefs.value[d]) {
			Object.values(graphRefs.value[d]).forEach((g) => g?.toggleSeries(gene))
		}
	})
}

// --- Data Processors ---

const processVariantType = (result) => {
	const diseases = uniq(map(result, 'disease'))

	diseases.forEach((disease) => {
		const diseaseData = result.filter((r) => r.disease === disease)
		// Calculate local total for this disease (crucial for per-disease percentage)
		const localTotal = sumBy(diseaseData, 'aggregated_value')

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
			categories: sort_row_names,
		}
	})
}

const processVariantClass = (result) => {
	const diseases = uniq(map(result, 'disease'))

	diseases.forEach((disease) => {
		const diseaseData = result.filter((r) => r.disease === disease)
		const localTotal = sumBy(diseaseData, 'aggregated_value')
		const all_categories = uniq(map(diseaseData, 'variant_class'))

		// --- Coding ---
		const coding_categories = CODING_VARIANTS.filter((d) => all_categories.includes(d))
		const codingData = diseaseData.filter((r) => CODING_VARIANTS.includes(r.variant_class))

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
			categories: map(c_sort, (d) => d.replaceAll('_', ' ').replaceAll('Mutation', '')),
		}

		// --- Non-Coding ---
		const noncoding_categories = NON_CODING_VARIANTS.filter((d) => all_categories.includes(d))
		const nonCodingData = diseaseData.filter((r) => NON_CODING_VARIANTS.includes(r.variant_class))

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
			categories: map(nc_sort, (d) => d.replaceAll('_', ' ').replaceAll('Mutation', '')),
		}
	})
}

const processSNVClass = (result) => {
	const diseases = uniq(map(result, 'disease'))

	diseases.forEach((disease) => {
		const diseaseData = result.filter((r) => r.disease === disease)
		const localTotal = sumBy(diseaseData, 'aggregated_value')

		const { matrix, sort_row_names } = useVariantMatrix(
			diseaseData,
			SNV_CATEGORIES,
			genesList.value,
			'concatenated_value',
		)

		snvClass.value[disease] = {
			data: matrix,
			total: localTotal,
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
		const [typeRes, classRes, snvRes] = await Promise.all([
			// 1. Variant Type (Grouped by Disease)
			AggregateAPI(props.tableName, {
				column: 'variant_type',
				group_by: ['disease', 'variant_type', 'gene'],
				aggregation_type: aggType,
				filters,
			}),
			// 2. Variant Class (Grouped by Disease)
			AggregateAPI(props.tableName, {
				column: 'variant_class',
				group_by: ['disease', 'variant_class', 'gene'],
				aggregation_type: aggType,
				filters,
			}),
			// 3. SNV Class (Concatenated & Grouped by Disease)
			ConcateAggregateAPI(props.tableName, {
				separator: '>',
				group_by: ['disease', 'gene'],
				columns: ['ref_allele', 'tumor_seq_allele2'],
				aggregation_type: aggType,
				filters: {
					logic: 'AND',
					conditions: [...filters.conditions, { column: 'variant_type', operator: 'eq', value: 'SNP' }],
				},
			}),
		])

		// Combine results to find ALL diseases present across datasets
		const allData = [...(typeRes.result || []), ...(classRes.result || []), ...(snvRes.result || [])]
		diseaseList.value = uniq(map(allData, 'disease')).sort()

		// Run Processors
		processVariantType(typeRes.result || [])
		processVariantClass(classRes.result || [])
		processSNVClass(snvRes.result || [])
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
watch(percentageSwitcher, fetchData)
watch(() => props.tableName, fetchData)
watch(genesList, fetchData)
</script>
