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
	showAll: { type: Boolean, default: false },
	horizontal: { type: Boolean, default: false },
})

const chartOption = ref({
	series: [],
	grid: {
		top: '0%',
		right: '0%',
		bottom: '0%',
		outerBoundsMode: 'same',
		left: props.horizontal ? '5%' : '0%',
	},
	xAxis: {
		axisTick: { show: true },
		axisLine: { show: true },
		minorTick: { show: true },
		splitLine: { show: false },
		axisLabel: {
			fontWeight: 500,
			fontFamily: 'Lexend Deca',
			interval: props.showAll ? 0 : 'auto',
		},
	},
	yAxis: {
		axisTick: { show: true },
		axisLine: { show: true },
		minorTick: { show: true },
		splitLine: { show: false },
		inverse: props.horizontal ? true : false,
		axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
	},
})

const updateChart = () => {
	const { categories, data } = props.plotData
	const roundedRadii = props.horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]

	if (props.horizontal) {
		chartOption.value.yAxis.data = categories
		chartOption.value.yAxis.type = 'category'
		chartOption.value.xAxis.type = 'value'
	} else {
		chartOption.value.xAxis.data = categories
		chartOption.value.xAxis.type = 'category'
		chartOption.value.yAxis.type = 'value'
	}
	chartOption.value.series = data.map((dataSet, index) => ({
		type: 'bar',
		stack: 'total',
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
	height: 14rem;
}
</style>
