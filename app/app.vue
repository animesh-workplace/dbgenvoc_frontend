<script setup>
const { colorMode } = useTheme()
import { materialTheme } from 'notivue'

const isLoading = useGlobalLoader()

// Optional: Hook into Nuxt routing to auto-start/stop
const nuxtApp = useNuxtApp()
nuxtApp.hook('page:start', () => {
	isLoading.value = true
})
nuxtApp.hook('page:finish', () => {
	isLoading.value = false
})
</script>

<template>
	<div class="min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text transition-colors">
		<div
			v-if="isLoading"
			class="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center"
		>
			<div class="flex flex-col items-center">
				<Icon name="svg-spinners:ring-resize" class="w-20 h-20 text-blue-600 mb-4" />
				<h2 class="text-xl font-bold text-gray-800">Fetching the data...</h2>
			</div>
		</div>

		<NuxtLayout>
			<NuxtPage />
			<Notivue v-slot="item">
				<Notification :item="item" :theme="materialTheme" />
			</Notivue>
		</NuxtLayout>
	</div>
</template>
