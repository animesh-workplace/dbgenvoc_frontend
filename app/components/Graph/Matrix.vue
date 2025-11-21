<template>
	<div class="w-full flex justify-center">
		<Skeleton height="24rem" v-if="isLoading" />
		<VChart :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
import { map, min, max } from 'lodash-es'
import { useGeneAPI } from '@/api/geneAPI'
const { InteractionsAPI } = useGeneAPI()
const isLoading = ref(true)
const selectedGenes = ref([])

const chartOption = ref({
	matrix: {
		x: {
			data: [],
			show: true,
			levelSize: '15%',
			itemStyle: { borderWidth: 0 },
			dividerLineStyle: { width: 0 },
			label: {
				show: true,
				rotate: 90,
				align: 'left',
				fontWeight: 500,
				fontFamily: 'Lexend Deca',
				position: 'insideBottomRight',
			},
		},
		y: {
			data: [],
			show: true,
			levelSize: '15%',
			itemStyle: { borderWidth: 0 },
			dividerLineStyle: { width: 0 },
			label: {
				show: true,
				align: 'right',
				fontWeight: 500,
				position: 'right',
				fontFamily: 'Lexend Deca',
			},
		},
		width: 500,
		height: 500,
		top: '0%',
		left: '0%',
		right: '0%',
		bottom: '0%',
		backgroundStyle: { borderColor: 'none' },
		body: { itemStyle: { borderColor: 'none' } },
	},
	visualMap: {
		max: 3,
		min: -3,
		show: false,
		calculable: true,
		orient: 'vertical',
		inRange: {
			color: ['#8c510a', '#ffffff', '#01665e'],
		},
	},
	series: {
		data: [],
		type: 'heatmap',
		coordinateSystem: 'matrix',
	},
	tooltip: {
		show: true,
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
				'COL1A2',
			],
		})
		chartOption.value.series.data = response.heatmap
		chartOption.value.matrix.x.data = [...response.xAxis]
		chartOption.value.matrix.y.data = [...response.yAxis].reverse()
		chartOption.value.tooltip.formatter = (params) => {
			return `${params.data[1]} and ${params.data[0]}`
		}
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

// Initialize on mount
onMounted(() => {
	nextTick(async () => {
		await getOncoplot()
		isLoading.value = false
	})
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 30rem;
}
</style>
