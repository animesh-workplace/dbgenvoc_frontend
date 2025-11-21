<template>
	<div class="w-full flex justify-center">
		<Skeleton height="34rem" v-if="isLoading" />
		<VChart ref="chartContainer" :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
const isLoading = ref(true)
const chartContainer = ref(null)

const calculateDimensions = () => {
	if (!chartContainer.value?.$el) return
	return [chartContainer.value.$el.clientWidth, chartContainer.value.$el.clientHeight]
}

// Sample data
const categories = [1, 2, 3, 4, 5, 6, 7] // Count of each position
const data1 = [
	[0, 0],
	[120, 1],
	[200, 2],
	[150, 3],
	[80, 3],
	[70, 5],
	[110, 2],
	[130, 7],
	[300, 9],
]

// const data2 = [300]
const data = [
	{
		name: 'Type 1',
		value: [0, 10, 80, 0], // [categoryIndex, start, end, duration]
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
// // Sample pie data for each scatter point (2-3 segments each)
const pieDataArray = [
	[{ value: 70, name: 'A' }],
	[
		{ value: 70, name: 'A' },
		{ value: 30, name: 'B' },
	], // L1
	[
		{ value: 60, name: 'A' },
		{ value: 25, name: 'B' },
		{ value: 15, name: 'C' },
	], // L2
	[
		{ value: 50, name: 'A' },
		{ value: 50, name: 'B' },
	], // L3
	[
		{ value: 45, name: 'A' },
		{ value: 35, name: 'B' },
		{ value: 20, name: 'C' },
	], // L4
	[
		{ value: 65, name: 'A' },
		{ value: 35, name: 'B' },
	], // L5
	[
		{ value: 40, name: 'A' },
		{ value: 30, name: 'B' },
		{ value: 30, name: 'C' },
	], // L6
	[
		{ value: 55, name: 'A' },
		{ value: 45, name: 'B' },
	], // L7
	[{ value: 70, name: 'A' }],
]

function scaleValue(value, min = 0, max = 300, newMin = 1, newMax = 100) {
	if (value < min) value = min
	if (value > max) value = max

	return ((value - min) / (max - min)) * (newMax - newMin) + newMin
}

const maxValue = 200
const maxCategories = 7

// // Calculate positions for pie charts based on data values and categories
const calculatePiePosition = (categoryIndex, value, maxValue) => {
	const baseXPercent = (value[0] / (maxValue + 100)) * 100
	const shiftXPercent = 0.4 - 1.2 * (baseXPercent / 100)
	const xPercent = baseXPercent + shiftXPercent // 0 -> 0.67 100-> -0.67
	const baseYPercent = (value[1] / (maxCategories + 2)) * 100
	const shiftYPercent = 15.5 - 0.155 * baseYPercent
	const yPercent = baseYPercent + shiftYPercent
	return [xPercent + '%', 100 - yPercent + '%']
}

// const truncateText = (text, maxWidth, fontSize = 10) => {
// 	// Approximate text width (ECharts doesn't give exact here, so use char * fontSize * factor)
// 	const avgCharWidth = fontSize * 0.6
// 	const maxChars = Math.floor(maxWidth / avgCharWidth)
// 	if (text.length > maxChars) {
// 		return text.substring(0, maxChars - 2) + '…'
// 	}
// 	return text
// }

const chartOption = ref({
	animation: false,
	yAxis: [
		{
			show: false,
			type: 'category',
			id: 'normalYAxis',
			position: 'left',
			axisTick: { show: true },
			data: [1, 2, 3, 4, 5, 6, 7], // L1 to L7
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
			max: maxValue + 100, // Add some padding
			axisTick: { show: true },
			axisLine: { show: true },
			splitLine: { show: false },
			axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
		{
			show: true,
			type: 'value',
			position: 'bottom',
			id: 'lollipopXAxis',
			max: maxValue + 100, // Add some padding
			axisTick: { show: true, alignWithLabel: true },
			axisLine: { show: true },
			splitLine: { show: false },
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
			data: [maxValue + 100],
			itemStyle: { borderRadius: 30, color: '#4b5563', opacity: 0.2 },
		},
		{
			data,
			z: 10,
			type: 'custom',
			xAxisId: 'normalXAxis',
			yAxisId: 'normalYAxis',
			// encode: { x: [1, 2], y: 0 },
			renderItem(params, api) {
				const categoryIndex = api.value(0)
				const start = api.coord([api.value(1), categoryIndex])
				const end = api.coord([api.value(2), categoryIndex])
				const height = api.size([0, 1])[1] * 0.5
				const rectWidth = end[0] - start[0]

				return {
					type: 'group',
					children: [
						// Rounded rectangle
						{
							type: 'rect',
							shape: {
								x: start[0],
								y: start[1] - height / 2,
								width: rectWidth,
								height,
								r: 8, // rounded corners
							},
							style: api.style(),
						},
						// Label text centered in the rectangle
						// {
						// 	type: 'text',
						// 	style: {
						// 		text: truncateText('params.name', rectWidth, 10), // use rect's name
						// 		x: start[0] + rectWidth / 2,
						// 		y: start[1],
						// 		textAlign: 'center',
						// 		textVerticalAlign: 'middle',
						// 		fontFamily: 'Lexend Deca',
						// 		fontWeight: 400,
						// 		fontSize: 10,
						// 	},
						// 	z: 10,
						// },
					],
				}
			},
		},
		// Stem series (thin bars from 0 to value)
		{
			z: -1,
			type: 'bar',
			data: data1,
			xAxisId: 'lollipopXAxis',
			yAxisId: 'lollipopYAxis',
			barWidth: 2,
			name: 'Stems',
			itemStyle: {
				color: '#666666',
			},
		},
		// Dot series
		{
			xAxisId: 'lollipopXAxis',
			yAxisId: 'lollipopYAxis',
			data: data1,
			name: 'Values',
			symbolSize: 20,
			type: 'scatter',
			itemStyle: { color: 'red' },
		},

		// Create multiple pie series - one for each data point
		...pieDataArray.map((pieData, index) => ({
			z: 10,
			type: 'pie',
			data: pieData,
			showInLegend: false, // Don't show each pie in legend individually
			radius: ['12%', '7%'], // Small donut charts
			xAxisId: 'lollipopXAxis',
			yAxisId: 'lollipopYAxis',
			name: `Distribution ${categories[index]}`,
			center: calculatePiePosition(index, data1[index], maxValue),
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
		})),
	],
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
