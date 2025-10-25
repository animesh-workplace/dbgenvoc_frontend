<template>
	<div class="w-full flex justify-center">
		<Skeleton height="24rem" v-if="isLoading" />
		<VChart :option="chartOption" class="chart" autoresize v-else />
	</div>
</template>

<script setup>
import { map, min, max, random, uniq, reverse } from 'lodash-es'
import { useGeneAPI } from '@/api/geneAPI'
const { useVariantMatrix } = useHelper()
const { OncoplotAPI, AggregateAPI } = useGeneAPI()

const isLoading = ref(true)

const props = defineProps({
	name: { type: String, default: 'Heatmap Graph' },
})

const chartOption = ref({
	// title: {
	// 	top: '0%',
	// 	left: 'center',
	// 	text: props.name,
	// 	textStyle: {
	// 		fontFamily: 'Lexend Deca',
	// 		fontWeight: 600,
	// 		fontSize: 16,
	// 	},
	// },
	visualMap: { show: false },
	grid: [
		{
			// Sample Bar grid
			// show: true,
			top: '11%',
			left: '80%',
			right: '0%',
			bottom: '0.5%',
			outerBoundsMode: 'same',
			borderColor: 'red',
			backgroundColor: 'transparent',
		},
		{
			// Oncoplot grid
			show: true,
			top: '20%',
			right: '20%',
			left: '0%',
			bottom: '0.5%',
			outerBoundsMode: 'same',
			borderColor: 'green',
			backgroundColor: 'transparent',
		},
		{
			// TMB grid
			show: true,
			top: '0%',
			bottom: '82%',
			right: '20%',
			left: '7%',
			borderColor: 'pink',
			backgroundColor: 'transparent',
		},
	],
	xAxis: [
		{
			// Sample X axis
			nameGap: 10,
			gridIndex: 0,
			type: 'value',
			splitNumber: 1,
			position: 'top',
			name: 'No of samples',
			nameLocation: 'middle',
			axisTick: { show: true },
			splitLine: { show: false },
			axisLine: { show: true, onZero: false },
			axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
		{
			// Oncoplot X axis
			data: [],
			show: false,
			gridIndex: 1,
			type: 'category',
			position: 'top',
			axisLabel: { fontWeight: 500, fontFamily: 'Lexend Deca' },
		},
		{
			// TMB X axis
			data: [],
			show: false,
			gridIndex: 2,
			type: 'category',
			axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
	],
	yAxis: [
		{
			// Sample Y axis
			data: [],
			show: true,
			gridIndex: 0,
			type: 'category',
			axisTick: { show: true },
			axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
		{
			// Oncoplot Y axis
			data: [],
			show: true,
			gridIndex: 1,
			type: 'category',
			axisTick: { show: true },
			axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
		{
			// TMB Y axis
			gridIndex: 2,
			type: 'value',
			splitNumber: 1,
			position: 'top',
			name: 'TMB',
			nameGap: 10,
			nameLocation: 'middle',
			axisTick: { show: true },
			axisLine: { show: true },
			splitLine: { show: false },
			axisLabel: { fontFamily: 'Lexend Deca', fontWeight: 500 },
		},
	],
	series: [
		{
			// Sample bar
			data: [],
			type: 'bar',
			xAxisIndex: 0,
			yAxisIndex: 0,
			itemStyle: { borderRadius: [0, 3, 3, 0] },
		},
		{
			// Oncoplot
			xAxisIndex: 1,
			yAxisIndex: 1,
			type: 'heatmap',
			data: [],
			emphasis: {
				itemStyle: {
					shadowBlur: 10,
					shadowColor: 'rgba(0, 0, 0, 0.5)',
				},
			},
		},
		{
			// TMB bar
			data: [],
			type: 'bar',
			xAxisIndex: 2,
			yAxisIndex: 2,
			itemStyle: { borderRadius: [3, 3, 0, 0] },
		},
	],
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
		const response = await OncoplotAPI('es_tcga_oncoplot', {
			genes: [
				'FLG',
				'TTN',
				'NEB',
				'TP53',
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
				'PLEC',
				'COL1A1',
			],
		})
		chartOption.value.xAxis[1].data = response.xAxis
		chartOption.value.yAxis[1].data = response.yAxis
		chartOption.value.series[1].data = map(response.heatmap, (item) => ({
			value: item,
			itemStyle: { color: colorMapping[item[2]] },
		}))

		chartOption.value.xAxis[2].data = response.yAxis
		chartOption.value.series[2].data = map(response.yAxis, (item) => random(10, 200))
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const aggregateVariantClass = async () => {
	let variant_categories = []
	const colorMapping = {
		0: '#33A02C',
		1: '#6A3D9A',
		2: '#FFFF99',
		3: '#1F78B4',
		4: '#E31A1C',
		5: '#FF7F00',
		6: '#A6CEE3',
		7: '#D53E4F',
	}
	try {
		const response = await AggregateAPI('es_tcga', {
			column: 'variant_class',
			group_by: ['variant_class', 'gene'],
			filters: {
				gene: [
					'FLG',
					'TTN',
					'NEB',
					'TP53',
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
					'PLEC',
					'COL1A1',
				],
				variant_class: [
					'Missense_Mutation',
					'Frame_Shift_Ins',
					'In_Frame_Del',
					'Frame_Shift_Del',
					'Nonsense_Mutation',
					'Splice_Site',
					'Nonstop_Mutation',
					'In_Frame_Ins',
				],
			},
		})
		variant_categories = [
			'Missense_Mutation',
			'Frame_Shift_Ins',
			'In_Frame_Del',
			'Frame_Shift_Del',
			'Nonsense_Mutation',
			'Splice_Site',
			'Nonstop_Mutation',
			'In_Frame_Ins',
		]

		const { matrix, sort_row_names } = useVariantMatrix(
			response.result,
			chartOption.value.yAxis[1].data,
			variant_categories,
			'gene',
			false,
			'variant_class',
		)

		const number_of_sample_chartoption = matrix.map((dataSet, index) => ({
			type: 'bar',
			stack: 'total',
			data: dataSet.map((value, i) => {
				return {
					value,
					itemStyle: { borderRadius: 0, color: colorMapping[index] },
				}
			}),
			name: `B${index + 1}`,
			xAxisIndex: 0,
			yAxisIndex: 0,
		}))
		chartOption.value.yAxis[0].data = chartOption.value.yAxis[1].data
		chartOption.value.series = [
			...number_of_sample_chartoption,
			chartOption.value.series[1],
			chartOption.value.series[2],
		]
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

onMounted(async () => {
	await getOncoplot()
	await aggregateVariantClass()
	isLoading.value = false
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 30rem;
}
</style>
