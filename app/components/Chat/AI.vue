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
					<span :class="{ shimmer: isShimmering }">
						{{ props.message.thinking || 'Show Thinking' }}
					</span>
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
										<code class="lang-js">{{ slotProps.item.content }}</code>
									</pre>
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
				class="p-4 md:px-8 md:pt-8 md:pb-3 rounded-2xl w-full !max-w-full md:border-t-4 md:border-blue-900 md:bg-white md:shadow-sm"
			>
				<div v-for="(step, tIndex) in props.message.results" :key="`table-${tIndex}`">
					<div v-if="step.tool == 'generic_search'">
						<h3 class="text-md font-semibold mb-2">
							Search Table for
							{{
								step.result.table_name
									.replaceAll('_somatic_variants', '')
									.replaceAll('_', ' ')
									.replace(/\b\w/g, (c) => c.toUpperCase())
							}}:
						</h3>
						<GenericTable :tableData="step.result" :tableParams="step.params" class="!p-0" />
					</div>
				</div>

				<div>
					<h2
						v-if="props.message.title"
						class="text-xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100"
					>
						{{ props.message.title }}
					</h2>

					<div class="prose prose-sm prose-stone max-w-none" v-if="props.message.content">
						<MDC :value="props.message.content" unwrap="p" />
					</div>
					<span class="shimmer" v-else>Generating Text</span>
				</div>

				<div
					class="mt-4 flex items-center justify-between pt-4 border-t border-stone-50 text-sm text-stone-400"
				>
					<span class="flex items-center gap-1">
						<Icon name="tabler:stopwatch" class="!w-4 !h-4" />
						Generated in {{ props.message.total_time }}s
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
import Prism from 'prismjs'
import 'prismjs/themes/prism.min.css'

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

const isShimmering = computed(() => {
	return showThinking.value && !props.message.content
})

onMounted(() => {
	Prism.highlightAll()
})
</script>

<style scoped>
@keyframes shimmer {
	0% {
		-webkit-mask-position: right;
		mask-position: right;
	}

	100% {
		-webkit-mask-position: left;
		mask-position: left;
	}
}

.shimmer {
	animation: shimmer 1.5s linear infinite;
	-webkit-mask-image: linear-gradient(-70deg, #000 50%, #0005 60%, #000 70%);
	mask-image: linear-gradient(-70deg, #000 50%, #0005 60%, #000 70%);
	-webkit-mask-size: 300% 100%;
	mask-size: 300% 100%;
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;
}

.prose-compact {
	--tw-prose-body: 1rem;
	--tw-prose-headings: 1em;
	--tw-prose-lead: 1.25em;
	--tw-prose-links: 1em;
	--tw-prose-bold: 1em;
	--tw-prose-counters: 1em;
	--tw-prose-bullets: 1em;
	--tw-prose-hr: 0;
	--tw-prose-quotes: 1em;
	--tw-prose-quote-borders: 1em;
	--tw-prose-captions: 1em;
	--tw-prose-code: 1em;
	--tw-prose-pre-code: 1em;
	--tw-prose-th-borders: 1px;
}

.prose-compact :deep(p) {
	margin-top: 0.75em;
	margin-bottom: 0.75em;
}

.prose-compact :deep(h2) {
	margin-top: 1.2em;
	margin-bottom: 0.6em;
}

.prose-compact :deep(h3) {
	margin-top: 1em;
	margin-bottom: 0.5em;
}

.prose-compact :deep(ul),
.prose-compact :deep(ol) {
	margin-top: 0.25em;
	margin-bottom: 0.25em;
}

.prose-compact :deep(li) {
	margin-top: 0em;
	margin-bottom: 0em;
}

.prose-compact :deep(pre) {
	margin-top: 1em;
	margin-bottom: 1em;
	padding: 0.75em;
}

.prose-compact :deep(blockquote) {
	margin-top: 1em;
	margin-bottom: 1em;
}
</style>
