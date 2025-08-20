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
const categories = [1, 2, 3, 4, 5, 6, 7] // L1 to L7
const data1 = [120, 200, 150, 80, 70, 110, 130]
const data2 = [300]
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
// Sample pie data for each scatter point (2-3 segments each)
const pieDataArray = [
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
]

function scaleValue(value, min = 0, max = 300, newMin = 1, newMax = 96) {
	if (value < min) value = min
	if (value > max) value = max

	return ((value - min) / (max - min)) * (newMax - newMin) + newMin
}

// Calculate positions for pie charts based on data values and categories
const calculatePiePosition = (categoryIndex, value, maxValue) => {
	const xPercent = (categoryIndex * 2 + 1) * 7 + 1.85
	const yPercent = Math.round(scaleValue(value), 2)
	console.log('🚀 ~ :58 ~ calculatePiePosition ~ xPercent, yPercent:', xPercent, yPercent)
	return [xPercent + '%', 100 - yPercent + '%']
}

const maxValue = Math.max(...data1)

const chartOption = ref({
	yAxis: {
		show: false,
		type: 'category',
		data: [1, 2, 3, 4, 5, 6, 7], // L1 to L7
		id: 'lollipopXAxis',
		name: 'lollipopXAxis',
		axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
	},

	animation: false,
	xAxis: {
		show: true,
		type: 'value',
		id: 'lollipopYAxis',
		max: maxValue + 100, // Add some padding
		axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		axisTick: { show: true },
		axisLine: { show: true },
		splitLine: { show: false },
	},
	grid: {
		top: '0%',
		left: '0%',
		right: '0%',
		bottom: '0%',
		outerBoundsMode: 'same',
	},
	series: [
		{
			type: 'bar',
			data: data2,
			barWidth: 30,
			itemStyle: { borderRadius: 30, color: '#4b5563', opacity: 0.6 },
			z: -1,
		},
		{
			type: 'custom',
			renderItem(params, api) {
				const categoryIndex = api.value(0)
				const start = api.coord([api.value(1), categoryIndex])
				const end = api.coord([api.value(2), categoryIndex])
				const height = api.size([0, 1])[1] * 0.6
				return {
					type: 'rect',
					shape: {
						x: start[0],
						y: start[1] - height / 2,
						width: end[0] - start[0],
						height,
						r: 20,
					},
					style: api.style(),
				}
			},
			encode: { x: [1, 2], y: 0 },
			data,
			z: 10,
		},
		// Stem series (thin bars from 0 to value)
		// {
		// 	xAxisId: 'lollipopXAxis',
		// 	yAxisId: 'lollipopYAxis',
		// 	type: 'bar',
		// 	data: data1,
		// 	barWidth: 2,
		// 	name: 'Stems',
		// 	itemStyle: {
		// 		color: '#666666',
		// 		borderRadius: [0, 2, 2, 0],
		// 	},
		// },
		// Dot series
		// {
		// 	xAxisId: 'lollipopXAxis',
		// 	yAxisId: 'lollipopYAxis',
		// 	data: data1,
		// 	name: 'Values',
		// 	symbolSize: 20,
		// 	type: 'scatter',
		// 	itemStyle: { color: 'red' },
		// },
		// Create multiple pie series - one for each data point
		// ...pieDataArray.map((pieData, index) => ({
		// 	type: 'pie',
		// 	data: pieData,
		// 	xAxisId: 'lollipopXAxis',
		// 	yAxisId: 'lollipopYAxis',
		// 	radius: ['6%', '3%'], // Small donut charts
		// 	name: `Distribution ${categories[index]}`,
		// 	center: calculatePiePosition(index, data1[index], maxValue),
		// 	itemStyle: {
		// 		borderWidth: 1,
		// 		borderRadius: 2,
		// 		borderColor: '#fff',
		// 	},
		// 	padAngle: 5,
		// 	label: { show: false },
		// 	labelLine: { show: false },
		// 	emphasis: {
		// 		itemStyle: {
		// 			shadowBlur: 5,
		// 			shadowOffsetX: 0,
		// 			shadowColor: 'rgba(0, 0, 0, 0.3)',
		// 		},
		// 	},
		// 	z: 10,
		// 	showInLegend: false, // Don't show each pie in legend individually
		// })),
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
	height: 34rem;
}
</style>
