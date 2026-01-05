<template>
	<div class="flex gap-6 md:mr-10">
		<div
			class="w-10 h-10 rounded-full bg-stone-300 hidden md:flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10"
		>
			<Icon name="tabler:robot" class="!w-5 !h-5 text-stone-600" />
		</div>

		<div>
			<div class="mb-2">
				<button
					@click="showThinking = !showThinking"
					class="flex items-center gap-2 text-xs text-stone-400 hover:text-blue-800 transition-colors"
				>
					Show Thinking
					<Icon :name="showThinking ? 'tabler:chevron-down' : 'tabler:chevron-right'" />
				</button>

				<div
					v-if="showThinking"
					class="mt-3 p-4 bg-stone-50 border border-stone-100 rounded-xl text-xs font-mono text-stone-500 leading-relaxed animate-in fade-in slide-in-from-top-1"
				>
					{{ props.message.thinking }}
				</div>
			</div>

			<div
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
	message: { type: Object, required: true, default: { title: '', content: '', isWidget: false } },
})
const showThinking = ref(false)
</script>

<style scoped></style>
