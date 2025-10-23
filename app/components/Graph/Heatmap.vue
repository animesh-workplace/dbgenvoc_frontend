<template>
	<div class="w-full flex justify-center">
		<Skeleton height="24rem" v-if="isLoading" />
		<VChart :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
import { useGeneAPI } from '@/api/geneAPI'
const { OncoplotAPI } = useGeneAPI()

const isLoading = ref(true)

const chartOption = ref({
	visualMap: {
		min: 0,
		max: 10,
		show: false,
		left: 'right',
		top: 'center',
		calculable: true,
		orient: 'vertical',
		inRange: {
			color: ['#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#fee090', '#fdae61', '#f46d43', '#d73027'],
		},
	},
	series: [
		{
			type: 'heatmap',
			data: [],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
			},
		},
	],
	grid: {
		top: '0%',
		left: '0%',
		right: '0%',
		bottom: '0%',
		outerBoundsMode: 'same',
	},
	xAxis: {
		data: [],
		type: 'category',
		axisLabel: { fontWeight: 500, fontFamily: 'Lexend Deca' },
	},
	yAxis: {
		data: [],
		type: 'category',
		axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
	},
})

const getOncoplot = async () => {
	try {
		const response = await OncoplotAPI('exome_somatic_oncoplot', {
			genes: ['TP53', 'TTN', 'FAT1'],
		})
		chartOption.value.series[0].data = response.heatmap
		chartOption.value.xAxis.data = response.xAxis
		chartOption.value.yAxis.data = response.yAxis
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

onMounted(async () => {
	await getOncoplot()
	isLoading.value = false
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 20rem;
}
</style>
