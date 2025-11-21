<template>
	<div class="w-full flex justify-center">
		<Skeleton height="24rem" v-if="isLoading" />
		<VChart :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
import { map, min, max } from 'lodash-es'
import { useGeneAPI } from '@/api/geneAPI'
const { OncoplotAPI, InteractionsAPI } = useGeneAPI()

const isLoading = ref(true)

const props = defineProps({
	name: { type: String, default: 'Heatmap Graph' },
})

const visualMapValue = ref({
	min: -3,
	max: 3,
})

const chartOption = ref({
	title: {
		top: '0%',
		left: 'center',
		text: props.name,
		textStyle: {
			fontFamily: 'Lexend Deca',
			fontWeight: 600,
			fontSize: 16,
		},
	},
	visualMap: {
		min: visualMapValue.value.min,
		max: visualMapValue.value.max,
		calculable: true,
		orient: 'vertical',
		bottom: '2%',
		right: '0%',
		inRange: {
			color: ['#8c510a', '#ffffff', '#01665e'],
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
		top: '6%',
		left: '0%',
		right: '0%',
		bottom: '0%',
		outerBoundsMode: 'same',
	},
	xAxis: {
		data: [],
		show: true,
		type: 'category',
		axisLabel: { fontWeight: 500, fontFamily: 'Lexend Deca' },
	},
	yAxis: {
		data: [],
		show: true,
		type: 'category',
		axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
	},
})

const getOncoplot = async () => {
	const colorMapping = {
		0: '#ffffff', // 0 - No mutation / Wild type
		1: '#33A02C', // 1 - Missense_Mutation
		2: '#6A3D9A', // 2 - Frame_Shift_Ins
		3: '#FFFF99', // 3 - In_Frame_Del
		4: '#1F78B4', // 4 - Frame_Shift_Del
		5: '#E31A1C', // 5 - Nonsense_Mutation
		6: '#FF7F00', // 6 - Splice_Site
		7: '#A6CEE3', // 7 - Nonstop_Mutation
		8: '#D53E4F', // 8 - In_Frame_Ins
		9: '#000000', // 9 - Multi_Hit
	}

	try {
		const response = await InteractionsAPI('tcga_exome_somatic_gene_interaction', {
			genes: [
				'TP53',
				'TTN',
				'FAT1',
				'NOTCH1',
				'CDKN2A',
				'MUC16',
				'PIK3CA',
				'CASP8',
				'HRAS',
				'AJUBA',
				'PCLO',
				'CSMD3',
				'DNAH5',
				'SYNE1',
				'LRP1B',
				'HUWE1',
				'KMT2D',
				'FLG',
				'NEB',
				'PLEC',
				'COL1A1',
			],
		})
		chartOption.value.series[0].data = map(response.heatmap, (item) => ({
			value: item,
			// itemStyle: { color: colorMapping[item[2]] },
		}))
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
	height: 30rem;
}
</style>
