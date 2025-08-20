import Aura from '@primeuix/themes/aura'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	devtools: { enabled: true },
	compatibilityDate: '2025-07-15',
	css: ['@/assets/css/tailwind.css'],
	app: {
		// baseURL: process.env.ROUTER_BASE || '/dbgenvoc/',
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
	modules: ['@nuxt/icon', '@primevue/nuxt-module', '@nuxtjs/google-fonts', '@nuxt/image', 'nuxt-echarts'],
	primevue: {
		options: {
			ripple: true,
			theme: { preset: Aura, options: { darkModeSelector: '.dark' } },
		},
		components: { include: [] },
	},
	echarts: {
		renderer: ['canvas'],
		features: ['UniversalTransition'],
		charts: [
			'ScatterChart',
			'HeatmapChart',
			'CustomChart',
			'ThemeRiverChart',
			'BoxplotChart',
			'BarChart',
			'PieChart',
		],
		components: [
			'GridComponent',
			'TitleComponent',
			'LegendComponent',
			'GraphicComponent',
			'DatasetComponent',
			'TooltipComponent',
			'ToolboxComponent',
			'DataZoomComponent',
			'VisualMapComponent',
			'SingleAxisComponent',
		],
	},
})
