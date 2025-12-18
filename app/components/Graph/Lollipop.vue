<template>
	<div class="w-full flex justify-center">
		<Skeleton height="34rem" v-if="isLoading" />
		<VChart ref="chartContainer" :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
import { map, filter } from 'lodash-es'
// Define a fixed height for the background track (Genomic Backbone)
const TRACK_HEIGHT = 23
const pieCenters = ref([])
const isLoading = ref(true)
const chartContainer = ref(null)

const props = defineProps({
	pieDataArray: { type: Array, default: () => [] },
	hiddenCategories: { type: Array, default: () => [] },
	dataPoints: { type: Object, default: () => ({ maxValue: 7, data: [] }) },
	dataDomain: {
		type: Object,
		default: () => ({
			length: 400,
			structure: [
				{
					name: 'Type 1',
					value: [0, 10, 80, 0],
					itemStyle: { color: '#7b9ce1' },
				},
				{
					name: 'Type 2',
					value: [0, 90, 150, 0],
					itemStyle: { color: '#bd6d6c' },
				},
				{
					name: 'Type 3',
					value: [0, 170, 250, 0],
					itemStyle: { color: '#75d874' },
				},
			],
		}),
	},
})

// --- Helpers ---
const updatePieCenters = () => {
	// 1. Safety check for the VChart component ref
	if (!chartContainer.value) return

	// 2. Access the ECharts instance safely
	const chartInstance =
		chartContainer.value.getChart?.() || chartContainer.value.chartInstance || chartContainer.value.chart
	if (!chartInstance) return

	// 3. Map visible data points to pixel coordinates
	pieCenters.value = map(props.dataPoints?.data || [], (point) => {
		try {
			return chartInstance.convertToPixel({ xAxisId: 'mainXAxis', yAxisId: 'mainYAxis' }, point.value)
		} catch (e) {
			return ['-100%', '-100%']
		}
	})
}

const truncateText = (text, maxWidth, fontSize = 10) => {
	const avgCharWidth = fontSize * 0.6
	const maxChars = Math.floor(maxWidth / avgCharWidth)
	if (text.length > maxChars) {
		return text.substring(0, maxChars - 2) + '…'
	}
	return text
}

// Using computed() ensures this object rebuilds whenever props.dataPoints or props.pieDataArray changes
const chartOption = computed(() => {
	const domainAxisMax = props.dataDomain.length

	// 1. FILTER DATA based on hiddenCategories
	const visibleData = filter(
		props.dataPoints?.data || [],
		(item) => !props.hiddenCategories.includes(item.header.replaceAll(' ', '_')),
	)
	const stemData = map(visibleData, (item) => ({ value: item.value }))

	// 2. DYNAMIC PIE SERIES based on visible data
	const dynamicPieSeries = map(props.pieDataArray, (pieData, index) => {
		return {
			z: 0,
			type: 'pie',
			padAngle: 5,
			silent: true,
			data: pieData,
			showInLegend: false,
			radius: ['8%', '6%'],
			label: { show: false },
			labelLine: { show: false },
			emphasis: { disabled: true },
			itemStyle: { borderRadius: 5 },
			center: pieCenters.value[index],
		}
	})

	return {
		animation: false,
		tooltip: {
			show: true,
			confine: true,
			trigger: 'item',
			borderColor: '#e5e7eb',
			backgroundColor: '#ebe6e7',
			extraCssText: 'padding: 0; border-radius: 0.75rem;',
			textStyle: { fontSize: 12, color: '#374151', fontFamily: 'Lexend Deca' },
		},
		grid: {
			top: '0%',
			left: '0%',
			right: '0%',
			bottom: '2%', // Space for X-axis labels
			outerBoundsMode: 'same',
		},
		yAxis: {
			show: false,
			type: 'value',
			id: 'mainYAxis',
			axisTick: { show: true },
			splitLine: { show: false },
			max: props.dataPoints.maxValue + 2,
			min: props.dataPoints.maxValue > 10 ? -2 : -1,
			axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
		xAxis: {
			min: 0,
			type: 'value',
			id: 'mainXAxis',
			max: domainAxisMax,
			position: 'bottom',
			axisTick: { show: true },
			splitLine: { show: false },
			axisLine: { show: true, onZero: false },
			axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
		series: [
			// 1. BACKGROUND TRACK (The Grey Bar)
			{
				z: 1,
				silent: true,
				type: 'custom',
				// We only need one entry: from 0 to domainAxisMax
				data: [[0, domainAxisMax]],
				renderItem(params, api) {
					// Calculate pixels for start (0) and end (max) at Y=0
					const start = api.coord([0, 0])
					const end = api.coord([api.value(1), 0])
					const width = end[0] - start[0]

					return {
						type: 'rect',
						shape: {
							x: start[0],
							y: start[1],
							width: width,
							r: TRACK_HEIGHT / 2,
							height: TRACK_HEIGHT - 8,
						},
						style: { fill: '#4b5563', opacity: 0.3 },
					}
				},
			},
			// 2. DOMAIN REGIONS (The Colored Rectangles)
			{
				z: 4,
				type: 'custom',
				data: props.dataDomain.structure,
				renderItem(params, api) {
					const start = api.coord([api.value(1), 0])
					const end = api.coord([api.value(2), 0])
					const rectWidth = end[0] - start[0]

					return {
						type: 'group',
						children: [
							{
								type: 'rect',
								shape: {
									r: 8,
									x: start[0],
									width: rectWidth,
									height: TRACK_HEIGHT,
									y: start[1] - 0.2 * TRACK_HEIGHT,
								},
								style: {
									stroke: null,
									fill: api.visual('color'),
								},
							},
							{
								type: 'text',
								style: {
									fontSize: 10,
									fontWeight: 400,
									textAlign: 'center',
									fontFamily: 'Lexend Deca',
									textVerticalAlign: 'middle',
									x: start[0] + rectWidth / 2,
									y: start[1] + TRACK_HEIGHT / 2 - 0.15 * TRACK_HEIGHT,
									text: truncateText(
										props.dataDomain.structure[params.dataIndex].name,
										rectWidth,
									),
								},
							},
						],
					}
				},
				tooltip: {
					formatter: (params) => {
						const d = params.data
						return `
						<div class="text-sm p-2 text-center">
							<div class="font-bold">${d.name}</div>
							<div class="text-xs text-gray-500">Range: ${d.value[1]} - ${d.value[2]}</div>
						</div>
                    `
					},
				},
			},
			// 3. STEMS (Grow from Y=0)
			{
				z: 2,
				type: 'bar',
				barWidth: 2,
				silent: true,
				data: stemData,
				itemStyle: { color: '#666666' },
			},
			// 4. DOTS (Scatter)
			{
				z: 3,
				symbolSize: 15,
				type: 'scatter',
				data: visibleData,
				tooltip: {
					formatter: (params) => {
						// 1. DATA PREPARATION
						// Subtract the 0.5 visual offset to show the real database count
						const realCount = params.value[1]
						const isMixedType = params.data.header === 'Mixed'
						const diseaseData = params.data.diseaseBreakdown || []
						const hasDiseaseData = params.data.diseaseBreakdown.length > 0

						// 2. COMPONENT: Disease Breakdown Rows
						const diseaseHtml = map(
							diseaseData,
							(d) => `
								<div class="flex justify-between items-center gap-4 py-0.5">
									<div class="flex items-center gap-2">
										<span class="w-2 h-2 rounded-full" style="background-color: ${d.itemStyle.color}"></span>
										<span class="text-gray-500 font-medium">${d.name}:</span>
									</div>
									<span class="font-semibold text-gray-800">${d.value}</span>
								</div>
							`,
						).join('')

						// 3. COMPONENT: Variation List (Handles long lists with truncation/scroll)
						const variationList = params.data.variations || 'N/A'

						// 4. MAIN TOOLTIP TEMPLATE (Unified for DRY code)
						return `
							<div class="text-sm min-w-[220px]">
								<div class="flex items-center justify-center gap-2 border-b border-gray-300 pb-2 rounded-t-xl px-4 pt-2" 
									style="background-color: ${params.color}22">
									<span class="w-2.5 h-2.5 rounded-full shadow-sm" style="background-color: ${params.color}"></span>
									<span class="font-bold text-base text-gray-900">${params.data.header}</span>
								</div>

								<div class="flex flex-col gap-2 bg-white p-3 rounded-b-xl border border-gray-200 border-t-0">
									<div class="grid grid-cols-2 gap-x-4 gap-y-1">
										<span class="text-gray-500 text-left">Position:</span>
										<span class="font-semibold text-right">${params.value[0]}</span>
										
										<span class="text-gray-500 text-left">Total Count:</span>
										<span class="font-semibold text-right">${realCount}</span>
									</div>

									${
										isMixedType
											? `
											<div class="flex flex-col border-t border-gray-100 pt-2">
												<span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Functional Type</span>
												<span class="font-semibold text-gray-800">${params.data.type}</span>
											</div>
										`
											: ''
									}
									${
										hasDiseaseData
											? `
										<div class="flex flex-col border-t border-gray-100 pt-2 mt-1">
											<span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Disease Distribution</span>
											<div class="flex flex-col">${diseaseHtml}</div>
										</div>
									`
											: ''
									}

									<div class="flex flex-col border-t border-gray-100 pt-2 mt-1">
										<span class="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Specific Variations</span>
										<div class="text-gray-600 italic leading-snug break-words max-w-[250px]">
											${variationList}
										</div>
									</div>
								</div>
							</div>
						`
					},
				},
			},

			// 5. Dynamic Pie Series
			...dynamicPieSeries,
		],
	}
})

// Initialize on mount
onMounted(() => {
	nextTick(() => {
		isLoading.value = false
		setTimeout(updatePieCenters, 50)
	})
})

useResizeObserver(chartContainer, () => {
	nextTick(() => {
		updatePieCenters()
	})
})

watch(
	() => props.dataPoints,
	() => {
		setTimeout(updatePieCenters, 50)
	},
	{ deep: true },
)
</script>

<style scoped>
.chart {
	width: 100%;
	height: 20rem;
}
</style>
