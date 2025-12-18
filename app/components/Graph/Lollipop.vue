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
const calculateDimensions = () => {
	if (!chartContainer.value?.$el) return
	return [chartContainer.value.$el.clientWidth, chartContainer.value.$el.clientHeight]
}

const calculatePiePosition = (categoryIndex, value, maxValue) => {
	if (!value) return ['0%', '0%']

	// Recalculate percentages based on the specific coordinate (value[0] is X, value[1] is Y)
	const baseXPercent = (value[0] / (maxValue + 100)) * 100
	const shiftXPercent = 0.4 - 1.2 * (baseXPercent / 100)
	const xPercent = baseXPercent + shiftXPercent

	const baseYPercent = (value[1] / (props.dataPoints.maxValue + 2)) * 100
	const shiftYPercent = 15.5 - 0.155 * baseYPercent
	const yPercent = baseYPercent + shiftYPercent

	return [xPercent + '%', 100 - yPercent + '%']
}

const truncateText = (text, maxWidth, fontSize = 10) => {
	const avgCharWidth = fontSize * 0.6
	const maxChars = Math.floor(maxWidth / avgCharWidth)
	if (text.length > maxChars) {
		return text.substring(0, maxChars - 2) + '…'
	}
	return text
}

// --- Reactive Chart Option ---
// Using computed() ensures this object rebuilds whenever props.dataPoints or props.pieDataArray changes
const chartOption = computed(() => {
	const domainAxisMax = props.dataDomain.length

	// 1. FILTER DATA based on hiddenCategories
	const visibleData = (props.dataPoints?.data || []).filter(
		(item) => !props.hiddenCategories.includes(item.header.replaceAll(' ', '_')),
	)
	const stemData = visibleData.map((item) => ({ value: item.value }))
	const visiblePieData = (props.pieDataArray || []).filter(
		(item) => !props.hiddenCategories.includes(item.header.replaceAll(' ', '_')),
	)

	const dynamicPieSeries = map(visiblePieData, (pieData, index) => {
		const coordinate = visibleData[index]?.value || [0, 0]

		return {
			z: 10,
			type: 'pie',
			data: pieData,
			showInLegend: false,
			radius: ['12%', '7%'],
			xAxisId: 'lollipopXAxis',
			yAxisId: 'lollipopYAxis',
			name: `Distribution ${index}`, // Unique name
			// Recalculate position for this specific point
			center: calculatePiePosition(index, coordinate, currentMaxX),
			itemStyle: {
				borderWidth: 1,
				borderRadius: 2,
				borderColor: '#fff',
			},
			padAngle: 5,
			label: { show: false },
			labelLine: { show: false },
			emphasis: {
				itemStyle: {
					shadowBlur: 5,
					shadowOffsetX: 0,
					shadowColor: 'rgba(0, 0, 0, 0.3)',
				},
			},
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
			extraCssText: 'padding: 0;',
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
			axisTick: { show: true },
			splitLine: { show: false },
			max: props.dataPoints.maxValue + 2,
			min: props.dataPoints.maxValue > 10 ? -2 : -1,
			axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
		xAxis: {
			min: 0,
			type: 'value',
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
								style: api.style(),
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
				symbolSize: 20,
				type: 'scatter',
				data: visibleData,
				tooltip: {
					formatter: (params) => {
						return `
						<div class="text-sm">
							<div class="flex items-center justify-center gap-2 border-b border-gray-400 pb-2 bg-gray-200 px-4 pt-2">
								<span class="font-bold text-base text-gray-900">${params.data.header}</span>
							</div>

							<div class="flex flex-col gap-1 bg-gray-50 p-2">
								<div class="flex justify-between gap-4">
									<span class="text-gray-500 font-medium">Location:</span>
									<span class="font-semibold">${params.value[0]}</span>
								</div>

								<div class="flex justify-between gap-4">
									<span class="text-gray-500 font-medium">Count:</span>
									<span class="font-semibold">${params.value[1]}</span>
								</div>

								<div class="flex justify-between gap-4">
									<span class="text-gray-500 font-medium">Type:</span>
									<span class="font-semibold">${params.data.type}</span>
								</div>

								<div class="flex justify-between gap-4">
									<span class="text-gray-500 font-medium">Variations:</span>
									<span class="font-semibold">${params.data.variations}</span>
								</div>
							</div>
            			</div>
						`
					},
				},
			},

			// Dynamic Pie Series
			// ...dynamicPieSeries,
		],
	}
})

// Initialize on mount
onMounted(() => {
	nextTick(() => {
		isLoading.value = false
		setTimeout(calculateDimensions, 50)
	})
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 20rem;
}
</style>
