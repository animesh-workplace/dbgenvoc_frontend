<template>
	<div class="w-full flex justify-center">
		<Skeleton height="34rem" v-if="isLoading" />
		<VChart :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
const isLoading = ref(true)
const chartOption = ref({
	yAxis: {
		type: 'category',
		data: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
		axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
	},
	grid: {
		top: '0%',
		left: '0%',
		right: '0%',
		bottom: '0%',
		containLabel: true,
	},
	xAxis: { axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 } },
	series: [
		{
			type: 'bar',
			name: 'B1',
			stack: 'total',
			showBackground: true,
			data: [120, 200, 150, 80, 70, 110, 130],
			backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' },
		},
		{
			type: 'bar',
			stack: 'total',
			showBackground: true,
			data: [10, 20, 15, 8, 7, 11, 13],
			// itemStyle: { borderRadius: [5, 5, 0, 0] }, // Apply border for vertical bars
			itemStyle: { borderRadius: [0, 5, 5, 0] }, // Apply border for horizontal bars
			backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' },
			label: { show: true, fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
	],
})

// Initialize on mount
onMounted(() => {
	nextTick(() => {
		isLoading.value = false
	})
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 34rem;
}
</style>
