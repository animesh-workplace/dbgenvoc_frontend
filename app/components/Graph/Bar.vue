<template>
	<div class="w-full flex justify-center">
		<Skeleton height="24rem" v-if="isLoading" />
		<VChart :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
const isLoading = ref(true)

const props = defineProps({
	plotData: {
		type: Object,
		default: () => ({
			categories: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
			data: [
				[120, 200, 150, 80, 70, 110, 130],
				[10, 20, 15, 8, 7, 11, 13],
			],
		}),
	},
})

const chartOption = ref({
	series: [],
	grid: {
		top: '0%',
		left: '0%',
		right: '0%',
		bottom: '0%',
		outerBoundsMode: 'same',
	},
	xAxis: { axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 } },
	yAxis: { axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 } },
})

const updateChart = () => {
	const { categories, data } = props.plotData
	const horizontal = categories.length > 4
	const roundedRadii = horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]

	console.log()
	if (categories.length > 4) {
		chartOption.value.yAxis.data = categories
		chartOption.value.yAxis.type = 'category'
	} else {
		chartOption.value.xAxis.data = categories
		chartOption.value.xAxis.type = 'category'
	}
	chartOption.value.series = data.map((dataSet, index) => ({
		type: 'bar',
		stack: 'total',
		realtimeSort: true,
		data: dataSet.map((value, i) => {
			let topIdx = -1
			for (let j = data.length - 1; j >= 0; j--) {
				if ((data[j]?.[i] ?? 0) !== 0) {
					topIdx = j
					break
				}
			}
			const isTop = index === topIdx && value !== 0
			return {
				value,
				itemStyle: isTop ? { borderRadius: roundedRadii } : { borderRadius: 0 },
			}
		}),
		name: `B${index + 1}`,
		showBackground: false,
		backgroundStyle: { color: 'rgba(180, 180, 180, 0.2)' },
		// itemStyle:
		// 	index + 1 == data.length
		// 		? categories.length > 4
		// 			? { borderRadius: [0, 5, 5, 0] }
		// 			: { borderRadius: [5, 5, 0, 0] }
		// 		: 0,
		// label: { show: true, fontFamily: 'Lexend Deca', fontWeight: 500 },
	}))
}

watch(
	() => props.plotData,
	() => {
		updateChart()
	},
	{ immediate: true, deep: true },
)

// Initialize on mount
onMounted(() => {
	nextTick(() => {
		isLoading.value = false
		updateChart()
	})
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 24rem;
}
</style>
