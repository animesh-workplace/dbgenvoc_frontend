<template>
	<div class="w-full flex justify-center">
		<Skeleton height="34rem" v-if="isLoading" />
		<VChart ref="chartContainer" :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
import { map } from 'lodash-es'
const isLoading = ref(true)
const chartContainer = ref(null)

const props = defineProps({
	pieDataArray: { type: Array, default: () => [] },
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
	// 1. Calculate dynamic scaling based on current props
	const currentMaxX = props.dataDomain.length
	const domainAxisMax = props.dataDomain.length
	const stemData = map(props.dataPoints?.data || [], (item) => ({
		value: item.value,
	}))

	// 2. Generate Pie Series dynamically
	// We map over props.pieDataArray and use corresponding coordinate from props.dataPoints
	const dynamicPieSeries = map(props.pieDataArray, (pieData, index) => {
		const coordinate = props.dataPoints[index] || [0, 0]

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
		animation: true,
		// --- ADDED TOOLTIP CONFIGURATION ---
		tooltip: {
			show: true,
			confine: true,
			trigger: 'item',
			borderColor: '#e5e7eb',
			backgroundColor: '#ebe6e7',
			extraCssText: 'padding: 0;',
			textStyle: { fontSize: 12, color: '#374151', fontFamily: 'Lexend Deca' },
		},
		yAxis: [
			{
				show: false,
				type: 'category',
				position: 'left',
				id: 'normalYAxis',
				axisTick: { show: true },
				axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
				data: map(Array.from({ length: props.dataPoints.maxValue }), (_, i) => i + 1),
			},
			{
				min: -1,
				show: false,
				type: 'value',
				position: 'left',
				id: 'lollipopYAxis',
				splitLine: { show: false },
				max: props.dataPoints.maxValue + 2,
				axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
			},
		],
		xAxis: [
			{
				show: false,
				type: 'value',
				id: 'normalXAxis',
				position: 'bottom',
				axisTick: { show: true },
				axisLine: { show: true },
				splitLine: { show: false },
				max: domainAxisMax, // Dynamic Max
				axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
			},
			{
				show: true,
				type: 'value',
				position: 'bottom',
				id: 'lollipopXAxis',
				axisLine: { show: true },
				splitLine: { show: false },
				max: domainAxisMax, // Dynamic Max
				axisTick: { show: true, alignWithLabel: true },
				axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
			},
		],
		grid: {
			top: '0%',
			left: '0%',
			right: '0%',
			bottom: '0%',
			outerBoundsMode: 'same',
		},
		series: [
			{
				z: 1,
				type: 'bar',
				barWidth: 15,
				silent: true,
				xAxisId: 'normalXAxis',
				yAxisId: 'normalYAxis',
				data: [domainAxisMax], // Ensure background bar stretches to new max
				itemStyle: { borderRadius: 30, color: '#4b5563', opacity: 0.2 },
			},
			{
				z: 10,
				type: 'custom',
				xAxisId: 'normalXAxis',
				yAxisId: 'normalYAxis',
				data: props.dataDomain.structure, // Static background rectangles
				renderItem(params, api) {
					const categoryIndex = api.value(0)
					const start = api.coord([api.value(1), categoryIndex])
					const end = api.coord([api.value(2), categoryIndex])
					const height = api.size([0, 1])[1] * 0.5
					const rectWidth = end[0] - start[0]

					return {
						type: 'group',
						children: [
							{
								type: 'rect',
								shape: {
									height,
									x: start[0],
									width: rectWidth,
									r: 8,
									y: start[1] - height / 2,
								},
								style: api.style(),
							},
							{
								type: 'text',
								style: {
									y: start[1],
									fontSize: 10,
									fontWeight: 400,
									textAlign: 'center',
									fontFamily: 'Lexend Deca',
									x: start[0] + rectWidth / 2,
									textVerticalAlign: 'middle',
									text: truncateText(
										props.dataDomain.structure[params.dataIndex].name,
										rectWidth,
										10,
									),
								},
								z: 10,
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
			// Stem series (Reactive to props.dataPoints)
			{
				z: -1,
				type: 'bar',
				barWidth: 2,
				silent: true,
				name: 'Stems',
				data: stemData,
				xAxisId: 'lollipopXAxis',
				yAxisId: 'lollipopYAxis',
				itemStyle: { color: '#666666' },
			},
			// Dot series (Reactive to props.dataPoints)
			{
				name: 'Values',
				symbolSize: 20,
				type: 'scatter',
				xAxisId: 'lollipopXAxis',
				yAxisId: 'lollipopYAxis',
				data: props.dataPoints.data,
				itemStyle: { color: 'red' },
				tooltip: {
					formatter: (params) => {
						return `
						<div class="text-sm">
							<div class="flex items-center justify-center gap-2 border-b border-gray-400 pb-2 bg-gray-200 px-4 pt-2">
								<span class="font-bold text-base text-gray-900">${params.data.type}</span>
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
			...dynamicPieSeries,
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
