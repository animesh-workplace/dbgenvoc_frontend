import Aura from '@primeuix/themes/aura'
import tailwindcss from '@tailwindcss/vite'
import { definePreset } from '@primeuix/themes'
import AutoComplete from 'primevue/autocomplete'

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
	features: { inlineStyles: true },
	css: ['@/assets/css/tailwind.css', 'notivue/notification.css', 'notivue/animations.css'],
	app: {
		baseURL: process.env.ROUTER_BASE || '/dbgenvoc/',
		head: {
			title: 'dbGENVOC | National Institute of Biomedical Genomics | BRIC-NIBMG',
			meta: [],
			link: [],
			// script: [{ src: 'https://challenges.cloudflare.com/turnstile/v0/api.js', async: true, defer: true }],
			script: [
				// { src: 'https://unpkg.com/@hcaptcha/vue3-hcaptcha', async: true, defer: true },
				// {
				// 	src: 'https://client-api.arkoselabs.com/v2/YOUR_PUBLIC_KEY/api.js',
				// 	async: true,
				// 	defer: true,
				// 	// Arkose requires a global callback function name
				// 	'data-callback': 'setupFunCaptcha',
				// },
			],
		},
	},
	build: { transpile: ['echarts', 'echarts-gl', 'zrender'] },
	vite: {
		plugins: [tailwindcss()],
		build: { cssCodeSplit: true },
	},
	googleFonts: {
		preload: true,
		prefetch: true,
		useStylesheet: true,
		outputDir: 'app/assets',
		families: { Poppins: true, 'Lexend+Deca': { wght: '100..900' } },
	},
	icon: { clientBundle: { scan: true }, serverBundle: { collections: ['solar', 'tabler', 'svg-spinners'] } },
	modules: [
		'@nuxt/icon',
		'@nuxt/image',
		'nuxt-echarts',
		'@vueuse/nuxt',
		'notivue/nuxt',
		'@nuxtjs/google-fonts',
		'@primevue/nuxt-module',
	],
	primevue: {
		options: {
			ripple: true,
			theme: { preset: dbgenvocTheme, options: { darkModeSelector: '.dark' } },
		},
		components: { include: [AutoComplete] },
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
