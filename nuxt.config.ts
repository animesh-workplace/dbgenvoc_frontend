import Aura from '@primeuix/themes/aura'
import tailwindcss from '@tailwindcss/vite'
import { definePreset } from '@primeuix/themes'

const dbgenvocTheme = definePreset(Aura, {
	semantic: {
		primary: {
			50: '{blue.50}',
			100: '{blue.100}',
			200: '{blue.200}',
			300: '{blue.300}',
			400: '{blue.400}',
			500: '{blue.500}',
			600: '{blue.600}',
			700: '{blue.700}',
			800: '{blue.800}',
			900: '{blue.900}',
			950: '{blue.950}',
		},
	},
})

export default defineNuxtConfig({
	devServer: { port: 3011 },
	devtools: { enabled: true },
	compatibilityDate: '2025-07-15',
	css: ['@/assets/css/tailwind.css'],
	app: {
		baseURL: process.env.ROUTER_BASE || '/dbgenvoc/',
		head: {
			title: 'dbGENVOC | National Institute of Biomedical Genomics | BRIC-NIBMG',
			meta: [],
			link: [],
		},
	},
	build: { transpile: ['echarts', 'echarts-gl', 'zrender'] },
	vite: { plugins: [tailwindcss()] },
	googleFonts: {
		preload: true,
		prefetch: true,
		useStylesheet: true,
		outputDir: 'app/assets',
		families: { Poppins: true, 'Lexend+Deca': { wght: '100..900' } },
	},
	icon: { clientBundle: { scan: true }, serverBundle: { collections: ['solar'] } },
	modules: ['@nuxt/icon', '@nuxt/image', 'nuxt-echarts', '@nuxtjs/google-fonts', '@primevue/nuxt-module'],
	primevue: {
		options: {
			ripple: true,
			theme: { preset: dbgenvocTheme, options: { darkModeSelector: '.dark' } },
		},
		components: { include: [] },
	},
	echarts: {
		renderer: ['canvas'],
		features: ['UniversalTransition'],
		charts: ['BarChart', 'PieChart', 'CustomChart', 'ScatterChart', 'HeatmapChart'],
		components: [
			'GridComponent',
			'TitleComponent',
			'LegendComponent',
			'MatrixComponent',
			'DatasetComponent',
			'TooltipComponent',
			'ToolboxComponent',
			'VisualMapComponent',
		],
	},
})
