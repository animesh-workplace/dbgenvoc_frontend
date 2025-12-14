<template>
	<div class="px-8 pt-8">
		<div
			class="p-4 mb-2 text-lg text-blue-900 rounded-2xl text-center bg-sky-100 flex justify-center items-center gap-2"
		>
			<Icon name="tabler:table-filled" class="!w-5 !h-5" />
			<span class="font-semibold">Variations from dbGENVOC</span>
		</div>
	</div>

	<div>
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
				<span class="font-semibold">Graphical Representation of dbGENVOC variations</span>
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
			<div class="text-right col-span-3">
				<div class="inline-flex items-center">
					<span class="mr-2 text-sm font-medium text-gray-700">Show in %</span>
					<ToggleSwitch v-model="percentageSwitcher" />
				</div>
			</div>
		</div>

		<div
			class="grid gap-8 p-8 md:grid-cols-2 grid-cols-1"
			:class="variantClassNoncoding?.categories?.length > 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'"
		>
			<div class="text-center">
				<div class="pb-2 text-sm font-semibold text-gray-700">Variant Classification Coding</div>
				<GraphBar
					showAll
					horizontal
					ref="graph1"
					:plotData="variantClassCoding"
					:isPercent="percentageSwitcher"
				/>
			</div>

			<div class="text-center" v-if="variantClassNoncoding.categories.length > 0">
				<div class="pb-2 text-sm font-semibold text-gray-700">Variant Classification Non-Coding</div>
				<GraphBar
					showAll
					horizontal
					ref="graph2"
					:isPercent="percentageSwitcher"
					:plotData="variantClassNoncoding"
				/>
			</div>

			<div class="text-center">
				<div class="pb-2 text-sm font-semibold text-gray-700">Variant Type</div>
				<GraphBar ref="graph3" :plotData="variantType" :isPercent="percentageSwitcher" />
			</div>

			<div class="text-center">
				<div class="pb-2 text-sm font-semibold text-gray-700">SNV Class</div>
				<GraphBar ref="graph4" :plotData="snvClass" showAll :isPercent="percentageSwitcher" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { uniq, map } from 'lodash-es'
import { useGeneAPI } from '@/api/geneAPI'

// SETUP & IMPORTS
const route = useRoute()
const { useVariantMatrix, color_scheme } = useHelper()
const { AggregateAPI, ConcateAggregateAPI } = useGeneAPI()

// STATE & REFS
const graph1 = ref(null)
const graph2 = ref(null)
const graph3 = ref(null)
const graph4 = ref(null)
const hiddenSeries = ref([])
const percentageSwitcher = ref(false)
const genesList = computed(() => [].concat(route.query.genes_list || []))

const snvClass = ref({ data: [], categories: [], total: 0 })
const variantType = ref({ data: [], categories: [], total: 0 })
const variantClassCoding = ref({ data: [], categories: [], total: 0 })
const variantClassNoncoding = ref({ data: [], categories: [], total: 0 })

// PROPS
const props = defineProps({
	tableName: { type: String, default: '' },
})

// ==================================================================================
// DATA PROCESSING LOGIC
// ==================================================================================

const processVariantType = (result, total) => {
	const categories = uniq(map(result, (item) => item.variant_type))
	const { matrix, sort_row_names } = useVariantMatrix(result, categories, genesList.value, 'variant_type', true)
	variantType.value = {
		data: matrix,
		total: total,
		categories: sort_row_names,
	}
}

const processVariantClass = (result, total) => {
	const coding = [
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
	const non_coding = ['IGR', 'Intron', "3'UTR", "5'Flank", "5'UTR", 'ncRNA']

	const all_categories = uniq(map(result, (item) => item.variant_class))
	const coding_categories = coding.filter((d) => all_categories.includes(d))
	const noncoding_categories = non_coding.filter((d) => all_categories.includes(d))

	const { matrix: c_mat, sort_row_names: c_sort } = useVariantMatrix(
		result,
		coding_categories,
		genesList.value,
		'variant_class',
		true,
	)
	variantClassCoding.value = {
		data: c_mat,
		total: total,
		categories: map(c_sort, (d) => d.replaceAll('_', ' ').replaceAll('Mutation', '')),
	}

	const { matrix: nc_mat, sort_row_names: nc_sort } = useVariantMatrix(
		result,
		noncoding_categories,
		genesList.value,
		'variant_class',
		true,
	)
	variantClassNoncoding.value = {
		data: nc_mat,
		total: total,
		categories: map(nc_sort, (d) => d.replaceAll('_', ' ').replaceAll('Mutation', '')),
	}
}

const processSNVClass = (result, total) => {
	const categories = ['C>T', 'G>A', 'C>A', 'G>T', 'C>G', 'G>C', 'T>A', 'A>T', 'T>C', 'A>G', 'T>G', 'A>C']
	const { matrix, sort_row_names } = useVariantMatrix(result, categories, genesList.value, 'concatenated_value')
	snvClass.value = {
		data: matrix,
		total: total,
		categories: sort_row_names,
	}
}

// ==================================================================================
// SSR & INITIAL DATA LOADING (Hybrid Pattern)
// ==================================================================================

const { data, pending, refresh } = await useAsyncData(
	`gene-analysis-wrapper-${props.tableName || 'default'}`,
	async () => {
		if (!props.tableName) return null

		const commonFilters = {
			logic: 'AND',
			conditions: [{ column: 'gene', operator: 'in', value: genesList.value }],
		}
		const aggType = percentageSwitcher.value ? 'percentage' : 'count'

		const [aggTypeRes, aggClassRes, aggSnvRes] = await Promise.all([
			// 1. Variant Type
			AggregateAPI(props.tableName, {
				column: 'variant_type',
				group_by: ['variant_type', 'gene'],
				aggregation_type: aggType,
				filters: commonFilters,
			}),
			// 2. Variant Class
			AggregateAPI(props.tableName, {
				column: 'variant_class',
				group_by: ['variant_class', 'gene'],
				aggregation_type: aggType,
				filters: commonFilters,
			}),
			// 3. SNV Class
			ConcateAggregateAPI(props.tableName, {
				separator: '>',
				group_by: ['gene'],
				columns: ['ref_allele', 'tumor_seq_allele2'],
				aggregation_type: aggType,
				filters: {
					...commonFilters,
					conditions: [
						...commonFilters.conditions,
						{ column: 'variant_type', operator: 'eq', value: 'SNP' },
					],
				},
			}),
		])
		return { aggTypeRes, aggClassRes, aggSnvRes }
	},
	{
		watch: [() => props.tableName], // Re-fetch on table name change
	},
)

// Sync State when Data Arrives
watch(
	data,
	(newData) => {
		if (newData) {
			processVariantType(newData.aggTypeRes.result, newData.aggTypeRes.total_records)
			processVariantClass(newData.aggClassRes.result, newData.aggClassRes.total_records)
			processSNVClass(newData.aggSnvRes.result, newData.aggSnvRes.total_records)
		}
	},
	{ immediate: true },
)

// ==================================================================================
// CLIENT-SIDE INTERACTION (Toggles)
// ==================================================================================

// --- Graph Handlers (Legend Toggle) ---
const handleLegendClick = (seriesName) => {
	// Toggle UI state (for greying out the button)
	if (hiddenSeries.value.includes(seriesName)) {
		hiddenSeries.value = hiddenSeries.value.filter((n) => n !== seriesName)
	} else {
		hiddenSeries.value.push(seriesName)
	}

	// Trigger the toggle in all child charts
	graph1.value?.toggleSeries(seriesName)
	graph2.value?.toggleSeries(seriesName)
	graph3.value?.toggleSeries(seriesName)
	graph4.value?.toggleSeries(seriesName)
}

// --- Graph Handlers (Percentage Toggle) ---
const updateGraphData = async () => {
	const commonFilters = {
		logic: 'AND',
		conditions: [{ column: 'gene', operator: 'in', value: genesList.value }],
	}
	const aggType = percentageSwitcher.value ? 'percentage' : 'count'

	try {
		const [aggTypeRes, aggClassRes, aggSnvRes] = await Promise.all([
			AggregateAPI(props.tableName, {
				column: 'variant_type',
				filters: commonFilters,
				aggregation_type: aggType,
				group_by: ['variant_type', 'gene'],
			}),
			AggregateAPI(props.tableName, {
				filters: commonFilters,
				column: 'variant_class',
				aggregation_type: aggType,
				group_by: ['variant_class', 'gene'],
			}),
			ConcateAggregateAPI(props.tableName, {
				separator: '>',
				group_by: ['gene'],
				aggregation_type: aggType,
				columns: ['ref_allele', 'tumor_seq_allele2'],
				filters: {
					logic: 'AND',
					conditions: [
						...commonFilters.conditions,
						{ column: 'variant_type', operator: 'eq', value: 'SNP' },
					],
				},
			}),
		])

		processSNVClass(aggSnvRes.result, aggSnvRes.total_records)
		processVariantType(aggTypeRes.result, aggTypeRes.total_records)
		processVariantClass(aggClassRes.result, aggClassRes.total_records)
	} catch (error) {
		console.error(error)
	}
}

// Watch Percentage Switcher
watch(percentageSwitcher, () => {
	updateGraphData()
})
</script>

<style scoped></style>
