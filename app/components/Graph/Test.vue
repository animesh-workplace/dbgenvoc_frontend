<template>
	<div class="w-full flex justify-center">
		<Skeleton height="34rem" v-if="isLoading" />
		<VChart ref="chartContainer" :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
const category = ['Category A']
const isLoading = ref(false)
const chartContainer = ref(null)

// Static data with values between 0–300
const data = [
	{
		name: 'Type 1',
		value: [0, 10, 80, 70], // [categoryIndex, start, end, duration]
		itemStyle: { color: '#7b9ce1' },
	},
	{
		name: 'Type 2',
		value: [0, 90, 160, 70],
		itemStyle: { color: '#bd6d6c' },
	},
	{
		name: 'Type 3',
		value: [0, 170, 250, 80],
		itemStyle: { color: '#75d874' },
	},
]

function renderItem(params, api) {
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
		},
		style: api.style(),
	}
}

const chartOption = ref({
	title: { text: 'Static Profile (0–300)', left: 'center' },
	tooltip: { formatter: (p) => `${p.marker}${p.name}: ${p.value[3]} units` },
	grid: { height: 200 },
	xAxis: {
		min: 0,
		max: 300,
		scale: true,
		axisLabel: { formatter: (val) => val + ' ms' },
	},
	yAxis: { data: category },
	series: [
		{
			type: 'custom',
			renderItem,
			encode: { x: [1, 2], y: 0 },
			data,
		},
	],
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 34rem;
}
</style>
