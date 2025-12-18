<template>
	<div class="w-full flex justify-center relative">
		<Skeleton height="34rem" v-if="isLoading" />
		<VChart ref="chartRef" :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
import { computed, ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({
	pieDataArray: { type: Array, default: () => [] },
	dataPoints: { type: Object, default: () => ({ maxValue: 7, data: [] }) },
	dataDomain: { type: Object, default: () => ({ length: 400, structure: [] }) },
	hiddenCategories: { type: Array, default: () => [] },
})

// --- 1. STATE & CONSTANTS FIRST ---
const isLoading = ref(true)
const chartRef = ref(null)
const pieCenters = ref([])

const TRACK_HEIGHT = 22
const BASEMENT_GAP = -5
const SHARED_X_ID = 'mainXAxis'
const SHARED_Y_ID = 'mainYAxis'

// --- 2. COMPUTED DATA (Initialize before functions use them) ---
const visibleData = computed(() => {
	return (props.dataPoints?.data || []).filter((item) => {
		if (!item?.type) return true
		const safeType = item.type.replaceAll(' ', '_')
		return !props.hiddenCategories.includes(safeType)
	})
})

// --- 3. LOGIC FUNCTIONS ---
const updatePieCenters = () => {
	// Check if component and internal ECharts instance exist
	if (!chartRef.value) return

	// Attempt to get internal chart instance (works for most vue-echarts versions)
	const chartInstance = chartRef.value.getChart?.() || chartRef.value.chartInstance || chartRef.value.chart
	if (!chartInstance) return

	// Calculate pixels for the head of each visible stem
	pieCenters.value = visibleData.value.map((point) => {
		try {
			return chartInstance.convertToPixel(
				{ xAxisId: SHARED_X_ID, yAxisId: SHARED_Y_ID },
				point.value, // [location, count]
			)
		} catch (e) {
			return ['-100%', '-100%'] // Default off-screen if conversion fails
		}
	})
}

const truncateText = (text, maxWidth, fontSize = 10) => {
	const avgCharWidth = fontSize * 0.6
	const maxChars = Math.floor(maxWidth / avgCharWidth)
	return text.length > maxChars ? text.substring(0, maxChars - 2) + '…' : text
}

// --- 4. CHART OPTION ---
const chartOption = computed(() => {
	const domainAxisMax = props.dataDomain?.length || 100
	const yMax = (props.dataPoints?.maxValue || 1) + 2

	// Map Pie Series to the calculated pixel centers
	const dynamicPieSeries = visibleData.value.map((point, index) => {
		const center = pieCenters.value[index] || ['-100%', '-100%']
		const pieSegments = props.pieDataArray[index] || []

		return {
			type: 'pie',
			z: 20,
			radius: [0, 10],
			center: center,
			data: pieSegments,
			silent: false,
			label: { show: false },
			itemStyle: { borderWidth: 1, borderColor: '#fff' },
			animation: false,
		}
	})

	return {
		// animation: true,
		tooltip: {
			show: true,
			trigger: 'item',
			confine: true,
			backgroundColor: '#ffffff',
			textStyle: { fontFamily: 'Lexend Deca', fontSize: 12 },
		},
		grid: {
			top: '10%',
			left: '8%',
			right: '5%',
			bottom: '15%',
			containLabel: false,
		},
		xAxis: {
			id: SHARED_X_ID,
			type: 'value',
			min: 0,
			max: domainAxisMax,
			position: 'bottom',
			axisLine: { show: true, onZero: false, lineStyle: { color: '#9ca3af' } },
			axisTick: { show: true, length: 10 },
			axisLabel: { fontFamily: 'Lexend Deca', margin: 12 },
			splitLine: { show: false },
		},
		yAxis: {
			id: SHARED_Y_ID,
			type: 'value',
			min: BASEMENT_GAP,
			max: yMax,
			axisLine: { show: false },
			axisLabel: { formatter: (val) => (val >= 0 ? val : '') },
			splitLine: {
				interval: (val) => val > 0,
				lineStyle: { type: 'dashed', opacity: 0.1 },
			},
		},
		series: [
			{
				z: 1,
				type: 'custom',
				silent: true,
				data: [[0, domainAxisMax]],
				renderItem(params, api) {
					const start = api.coord([0, 0])
					const end = api.coord([domainAxisMax, 0])
					return {
						type: 'rect',
						shape: {
							x: start[0],
							y: start[1],
							width: end[0] - start[0],
							height: TRACK_HEIGHT,
							r: TRACK_HEIGHT / 2,
						},
						style: { fill: '#4b5563', opacity: 0.15 },
					}
				},
			},
			{
				z: 2,
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
								shape: { x: start[0], y: start[1], width: rectWidth, height: TRACK_HEIGHT, r: 4 },
								style: api.style(),
							},
							{
								type: 'text',
								style: {
									x: start[0] + rectWidth / 2,
									y: start[1] + TRACK_HEIGHT / 2,
									text: truncateText(
										props.dataDomain.structure[params.dataIndex].name,
										rectWidth,
									),
									fontSize: 10,
									fontFamily: 'Lexend Deca',
									textAlign: 'center',
									textVerticalAlign: 'middle',
									fill: '#333',
								},
							},
						],
					}
				},
			},
			{
				z: 3,
				type: 'bar',
				barWidth: 2,
				data: visibleData.value.map((d) => d.value),
				itemStyle: { color: '#6b7280' },
				silent: true,
			},
			{
				z: 4,
				type: 'scatter',
				symbolSize: 20,
				data: visibleData.value,
			},
			// ...dynamicPieSeries,
		],
	}
})

// --- 5. LIFECYCLE & WATCHERS ---
// Debounced update to prevent overhead during rapid changes
let updateTimeout = null
const triggerUpdate = () => {
	clearTimeout(updateTimeout)
	updateTimeout = setTimeout(() => {
		nextTick(updatePieCenters)
	}, 50)
}

watch([visibleData, chartOption], triggerUpdate, { deep: true })

onMounted(() => {
	isLoading.value = false
	// Initial calculation requires a delay for ECharts layout completion
	setTimeout(updatePieCenters, 200)
	window.addEventListener('resize', triggerUpdate)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', triggerUpdate)
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 30rem;
}
</style>
