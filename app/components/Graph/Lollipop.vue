<template>
	<div class="w-full flex justify-center">
		<Skeleton height="34rem" v-if="isLoading" />
		<VChart ref="chartContainer" :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
const isLoading = ref(true)
const chartContainer = ref(null)

const props = defineProps({
	dataPoints: {
		type: Array,
		default: () => [],
	},
	pieDataArray: {
		type: Array,
		default: () => [],
	},
	// If your domain rectangles (data) are also dynamic, add them to props
	// For now keeping 'data' static as per your snippet
})

const calculateDimensions = () => {
	if (!chartContainer.value?.$el) return
	return [chartContainer.value.$el.clientWidth, chartContainer.value.$el.clientHeight]
}

// --- Static Data (Rectangles) ---
const data = [
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
]

// --- Helpers ---

// Calculate max dynamically based on new data props so the chart scales correctly
const getMaxValue = (points) => {
	if (!points || points.length === 0) return 200
	// points is [[x, y], [x, y]], we want max X
	return Math.max(...points.map((p) => p[0]))
}

// Note: Ensure maxCategories aligns with your Y-axis max
const maxCategories = 7

const calculatePiePosition = (categoryIndex, value, maxValue) => {
	if (!value) return ['0%', '0%']

	// Recalculate percentages based on the specific coordinate (value[0] is X, value[1] is Y)
	const baseXPercent = (value[0] / (maxValue + 100)) * 100
	const shiftXPercent = 0.4 - 1.2 * (baseXPercent / 100)
	const xPercent = baseXPercent + shiftXPercent

	const baseYPercent = (value[1] / (maxCategories + 2)) * 100
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
	const currentMaxX = getMaxValue(props.dataPoints)
	const axisMax = currentMaxX + 100 // Add padding

	// 2. Generate Pie Series dynamically
	// We map over props.pieDataArray and use corresponding coordinate from props.dataPoints
	const dynamicPieSeries = props.pieDataArray.map((pieData, index) => {
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
		animation: true, // Keep false for performance updates, or true for smooth transitions
		yAxis: [
			{
				show: false,
				type: 'category',
				id: 'normalYAxis',
				position: 'left',
				axisTick: { show: true },
				data: [1, 2, 3, 4, 5, 6, 7],
				axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
			},
			{
				min: -1,
				show: false,
				type: 'value',
				position: 'left',
				id: 'lollipopYAxis',
				max: maxCategories + 2,
				splitLine: { show: false },
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
				max: axisMax, // Dynamic Max
				axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
			},
			{
				show: true,
				type: 'value',
				position: 'bottom',
				id: 'lollipopXAxis',
				axisLine: { show: true },
				splitLine: { show: false },
				max: axisMax, // Dynamic Max
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
				xAxisId: 'normalXAxis',
				yAxisId: 'normalYAxis',
				data: [axisMax], // Ensure background bar stretches to new max
				itemStyle: { borderRadius: 30, color: '#4b5563', opacity: 0.2 },
			},
			{
				data: data, // Static background rectangles
				z: 10,
				type: 'custom',
				xAxisId: 'normalXAxis',
				yAxisId: 'normalYAxis',
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
									text: truncateText(data[params.dataIndex].name, rectWidth, 10),
								},
								z: 10,
							},
						],
					}
				},
			},
			// Stem series (Reactive to props.dataPoints)
			{
				z: -1,
				type: 'bar',
				data: props.dataPoints,
				barWidth: 2,
				name: 'Stems',
				xAxisId: 'lollipopXAxis',
				yAxisId: 'lollipopYAxis',
				itemStyle: { color: '#666666' },
			},
			// Dot series (Reactive to props.dataPoints)
			{
				data: props.dataPoints,
				name: 'Values',
				symbolSize: 20,
				type: 'scatter',
				xAxisId: 'lollipopXAxis',
				yAxisId: 'lollipopYAxis',
				itemStyle: { color: 'red' },
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
