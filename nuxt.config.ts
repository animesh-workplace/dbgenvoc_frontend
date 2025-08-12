import Aura from '@primeuix/themes/aura'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	devtools: { enabled: true },
	compatibilityDate: '2025-07-15',
	css: ['@/assets/css/tailwind.css'],
	vite: { plugins: [tailwindcss()] },
	googleFonts: {
		preload: true,
		prefetch: true,
		useStylesheet: true,
		families: { Poppins: true, 'Lexend+Deca': { wght: '100..900' } },
		outputDir: 'app/assets',
	},
	modules: ['@nuxt/icon', '@primevue/nuxt-module', '@nuxtjs/google-fonts'],
	icon: { clientBundle: { scan: true }, serverBundle: { collections: ['solar'] } },
	primevue: {
		options: {
			ripple: true,
			theme: { preset: Aura, options: { darkModeSelector: '.dark' } },
		},
		components: {
			include: [],
		},
	},
})
