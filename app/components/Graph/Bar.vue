<template>
	<div class="w-full flex justify-center">
		<Skeleton height="24rem" v-if="isLoading" />
		<VChart ref="chartRef" :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
import { round } from 'lodash-es'
const route = useRoute()
const chartRef = ref(null)
const isLoading = ref(true)
const { color_scheme } = useHelper()

const props = defineProps({
	plotData: {
		type: Object,
		default: () => ({
			stack: ['A1', 'A2'],
			categories: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'],
			data: [
				[120, 200, 150, 80, 70, 110, 130],
				[10, 20, 15, 8, 7, 11, 13],
			],
			total: 500,
		}),
	},
	showAll: { type: Boolean, default: false },
	isPercent: { type: Boolean, default: false },
	horizontal: { type: Boolean, default: false },
})

const chartOption = ref({
	series: [],
	tooltip: {
		trigger: 'item',
		axisPointer: { type: 'shadow' },
		textStyle: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		valueFormatter: (value) =>
			props.isPercent ? `${value}% [${round((props.plotData.total * value) / 100)}]` : `${value}`,
	},
	grid: {
		top: '0%',
		left: '0%',
		right: '0%',
		bottom: '0%',
		outerBoundsMode: 'same',
	},
	xAxis: {
		nameLocation: 'center',
		axisTick: { show: true },
		axisLine: { show: true },
		minorTick: { show: true },
		splitLine: { show: false },
		axisLabel: {
			fontWeight: 500,
			fontFamily: 'Lexend Deca',
			interval: props.showAll ? 0 : 'auto',
		},
		nameTextStyle: { fontFamily: 'Lexend Deca', fontWeight: 500 },
	},
	yAxis: {
		nameLocation: 'center',
		axisTick: { show: true },
		axisLine: { show: true },
		minorTick: { show: true },
		splitLine: { show: false },
		inverse: props.horizontal ? true : false,
		axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		nameTextStyle: { fontFamily: 'Lexend Deca', fontWeight: 500 },
	},
})

const updateChart = () => {
	const { categories, data } = props.plotData
	const genes_list = props.plotData.stack
	const roundedRadii = props.horizontal ? [0, 5, 5, 0] : [5, 5, 0, 0]

	chartOption.value.tooltip.trigger = props.plotData.data.length > 20 ? 'item' : 'axis'
	chartOption.value.legend = {
		show: false,
		data: genes_list.map((genes_list, index) => ({
			icon: 'circle',
			name: genes_list,
			itemStyle: { color: color_scheme[index] },
			textStyle: { fontFamily: 'Lexend Deca', fontWeight: 500, fontSize: 12 },
		})),
	}

	if (props.horizontal) {
		chartOption.value.yAxis.data = categories
		chartOption.value.yAxis.type = 'category'
		chartOption.value.xAxis.type = 'value'
		chartOption.value.xAxis.name = props.isPercent ? '%' : 'Count'
	} else {
		chartOption.value.xAxis.data = categories
		chartOption.value.xAxis.type = 'category'
		chartOption.value.yAxis.type = 'value'
		chartOption.value.yAxis.name = props.isPercent ? '%' : 'Count'
	}
	chartOption.value.series = data.map((dataSet, index) => ({
		type: 'bar',
		stack: 'total',
		barMaxWidth: 80,
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
				itemStyle: isTop
					? { borderRadius: roundedRadii, color: color_scheme[index] }
					: { borderRadius: 0, color: color_scheme[index] },
			}
		}),
		showBackground: false,
		name: genes_list[index],
	}))
}

const toggleSeries = (seriesName) => {
	if (chartRef.value) {
		// dispatchAction is the native ECharts method to toggle legends
		chartRef.value.dispatchAction({
			type: 'legendToggleSelect',
			name: seriesName,
		})
	}
}

defineExpose({
	toggleSeries,
})

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
	height: 15rem;
}
</style>
