<template>
	<div class="flex gap-6 md:mr-10">
		<div
			class="w-10 h-10 rounded-full bg-stone-300 hidden md:flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10"
		>
			<Icon name="tabler:robot" class="!w-5 !h-5 text-stone-600" />
		</div>

		<div class="lg:min-w-2xl min-w-full max-w-full">
			<div class="mb-2">
				<button
					@click="toggleThinking"
					class="flex items-center gap-2 text-xs text-stone-400 hover:text-blue-800 transition-colors"
				>
					{{ props.message.thinking || 'Show Thinking' }}
					<Icon
						class="transition-transform duration-200"
						:name="showThinking ? 'tabler:chevron-down' : 'tabler:chevron-right'"
					/>
				</button>

				<Transition
					leave-from-class="opacity-100 max-h-[600px]"
					leave-to-class="opacity-0 max-h-0 -translate-y-1"
					enter-from-class="opacity-0 max-h-0 -translate-y-1"
					enter-to-class="opacity-100 max-h-[600px] translate-y-0"
					leave-active-class="transition-all duration-300 ease-in-out"
					enter-active-class="transition-all duration-300 ease-in-out"
				>
					<div v-if="showThinking" class="mt-3 overflow-hidden">
						<Timeline
							:value="props.message.events"
							:pt="{
								event: '!min-h-8',
								eventOpposite: 'hidden',
								eventMarker: 'timeline-marker-primary',
							}"
						>
							<template #content="slotProps">
								<span class="text-stone-500 text-sm">
									{{ slotProps.item.status }}
								</span>
								<Panel
									toggleable
									collapsed
									v-if="slotProps.item.content"
									class="!rounded-2xl timeline-button"
								>
									<template #header>
										<div class="flex items-center gap-2">
											<span class="font-sans text-xs">Code </span>
											<Icon name="tabler:code" class="!w-4 !h-4 !text-stone-600" />
										</div>
									</template>
									<pre class="bg-gray-100 p-2 rounded text-xs overflow-x-auto text-wrap">
									{{ slotProps.item.content }} </pre
									>
									<template #toggleicon>
										<Icon name="tabler:chevron-down" class="!w-4 !h-4 !text-stone-600" />
									</template>
								</Panel>
							</template>
						</Timeline>
					</div>
				</Transition>

				<!-- <div
					v-if="showThinking"
					class="mt-3 p-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-mono text-stone-500 leading-relaxed animate-in fade-in slide-in-from-top-1"
				>
					{{ props.message.thinking }}
				</div> -->
			</div>

			<div
				v-if="props.message.content"
				class="p-4 md:px-8 md:pt-8 md:pb-3 rounded-2xl w-full md:border-t-4 md:border-blue-900 md:bg-white md:shadow-sm"
			>
				<div
					v-if="props.message.isWidget"
					class="h-64 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-500"
				>
					<span class="font-medium">{{ props.message.content }}</span>
				</div>

				<div v-else>
					<h2
						v-if="props.message.title"
						class="text-xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100"
					>
						{{ props.message.title }}
					</h2>

					<MDC :value="props.message.content" />
				</div>

				<div
					class="mt-4 flex items-center justify-between pt-4 border-t border-stone-50 text-sm text-stone-400"
				>
					<span class="flex items-center gap-1">
						<Icon name="tabler:stopwatch" class="!w-4 !h-4" />
						Generated in 2.4s
					</span>
					<div class="flex gap-3">
						<button class="hover:text-stone-800 transition flex justify-center items-center gap-1">
							<Icon name="tabler:copy" class="!w-4 !h-4" />
							<span> Copy </span>
						</button>
						<button class="hover:text-blue-800 transition flex justify-center items-center gap-1">
							<Icon name="tabler:thumb-up" class="!w-4 !h-4" />
						</button>
						<button class="hover:text-red-700 transition flex justify-center items-center gap-1">
							<Icon name="tabler:thumb-down" class="!w-4 !h-4" />
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	message: {
		type: Object,
		required: true,
		default: {
			title: '',
			content: '',
			isWidget: false,
			events: [
				{ status: 'Workflow started', timestamp: '2024-06-01 10:00:00' },
				{ status: 'Fetching data from database', timestamp: '2024-06-01 10:00:05' },
				{ status: 'Processing data', timestamp: '2024-06-01 10:00:10' },
				{ status: 'Generating response', timestamp: '2024-06-01 10:00:15' },
			],
		},
	},
})
const showThinking = ref(false)
const autoControlled = ref(true) // 🔑 controls when auto logic applies

watch(
	() => props.message.content,
	(content) => {
		if (!autoControlled.value) return

		if (!content) {
			showThinking.value = true
		} else {
			showThinking.value = false
			autoControlled.value = false // 🔒 release control forever
		}
	},
	{ immediate: true },
)

const toggleThinking = () => {
	showThinking.value = !showThinking.value
	autoControlled.value = false // 🔒 user takes control
}
</script>

<style scoped></style>
