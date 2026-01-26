<template>
	<VChart :option="option" class="chart" autoresize />
</template>

<script setup>
import { computed, ref } from 'vue'

/**
 * Props
 */
const props = defineProps({
	variant_type: {
		type: String,
		default: 'beyond', // 'range' | 'within' | 'beyond'
		validator: (v) => ['range', 'within', 'beyond'].includes(v),
	},
})

/**
 * [genomic_position_bp, mutation_count]
 */
const mutations = [
	[120, 3],
	[340, 6],
	[560, 2],
	[780, 9], // reference
	[910, 4],
]

/**
 * Reference point (max mutation count)
 */
const [refX, refY] = mutations.reduce((a, b) => (b[1] > a[1] ? b : a))

/**
 * Window logic based on variant_type
 */
const windowConfig = computed(() => {
	switch (props.variant_type) {
		case 'range':
			return { up: 200, down: 100, style: 'arrow' }
		case 'within':
			return { up: 300, down: 300, style: 'bracket' }
		default:
			return { up: 300, down: 300, style: 'arrow' }
	}
})

const option = ref({
	tooltip: {
		trigger: 'item',
		formatter: ({ value }) => `Position: ${value[0]} bp<br/>Count: ${value[1]}`,
	},
	grid: {
		top: 40,
		left: 60,
		right: 40,
		bottom: 50,
	},
	xAxis: {
		type: 'value',
		name: 'Genomic position (bp)',
		min: 0,
		max: 1200,
	},
	yAxis: {
		type: 'value',
		name: 'Mutation count',
	},
	series: [
		// 🧬 Lollipop stems
		{
			type: 'custom',
			renderItem(params, api) {
				const x = api.value(0)
				const y = api.value(1)
				const [cx, cy] = api.coord([x, y])
				const [, baseY] = api.coord([x, 0])

				return {
					type: 'line',
					shape: { x1: cx, y1: baseY, x2: cx, y2: cy },
					style: { stroke: '#aaa', lineWidth: 2 },
				}
			},
			data: mutations,
			z: 1,
		},

		// 🍭 Lollipop heads
		{
			type: 'scatter',
			symbolSize: 14,
			data: mutations,
			itemStyle: { color: '#5b8ff9' },
			z: 2,
		},

		// 🔥 Variant window arrows
		{
			type: 'custom',
			z: 10,
			renderItem(params, api) {
				const { up, down, style } = windowConfig.value

				const [cx, cy] = api.coord([refX, refY])
				const leftX = api.coord([refX - up, refY])[0]
				const rightX = api.coord([refX + down, refY])[0]
				const y = cy + 28

				const children = []

				// main line
				children.push({
					type: 'line',
					shape: { x1: leftX, y1: y, x2: rightX, y2: y },
					style: { stroke: '#000', lineWidth: 2 },
				})

				if (style === 'arrow') {
					// left arrow
					children.push({
						type: 'polygon',
						shape: {
							points: [
								[leftX, y],
								[leftX + 8, y - 5],
								[leftX + 8, y + 5],
							],
						},
						style: { fill: '#000' },
					})

					// right arrow
					children.push({
						type: 'polygon',
						shape: {
							points: [
								[rightX, y],
								[rightX - 8, y - 5],
								[rightX - 8, y + 5],
							],
						},
						style: { fill: '#000' },
					})
				}

				if (style === 'bracket') {
					// left bracket |
					children.push({
						type: 'line',
						shape: {
							x1: leftX,
							y1: y - 8,
							x2: leftX,
							y2: y + 8,
						},
						style: { stroke: '#000', lineWidth: 2 },
					})

					// right bracket |
					children.push({
						type: 'line',
						shape: {
							x1: rightX,
							y1: y - 8,
							x2: rightX,
							y2: y + 8,
						},
						style: { stroke: '#000', lineWidth: 2 },
					})
				}

				// label
				children.push({
					type: 'text',
					style: {
						text: up === down ? `±${up} bp` : `${up} bp upstream / ${down} bp downstream`,
						x: cx,
						y: y - 12,
						textAlign: 'center',
						fill: '#000',
						font: '12px Lexend Deca',
					},
				})

				return { type: 'group', children }
			},
			data: [0],
		},
	],
})
</script>

<style scoped>
.chart {
	width: 100%;
	height: 460px;
}
</style>
