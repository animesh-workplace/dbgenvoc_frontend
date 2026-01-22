<template>
	<div class="assistant-intro animate-fade-in">
		<ChatHeader />
		<!-- Introduction message -->
		<div class="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-xl p-5 mb-6 shadow-xs">
			<div class="max-w-none">
				<div class="text-stone-700">
					I am <strong class="font-semibold text-blue-900">OSCAR</strong>, an expert AI assistant for the
					<strong class="font-semibold text-stone-800">dbGENVOC</strong> database. I specialize in
					querying and analyzing somatic variants related to oral cancer research.
				</div>
			</div>
		</div>

		<!-- Capabilities section -->
		<div class="mb-6">
			<h3 class="text-sm font-semibold text-stone-700 mb-3 flex items-center gap-2">
				<Icon name="heroicons:bolt" class="!w-4 !h-4 text-amber-500" />
				My Capabilities
			</h3>

			<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
				<div
					:key="index"
					v-for="(capability, index) in capabilities"
					class="bg-white border border-stone-100 rounded-xl p-4 hover:border-blue-100 shadow-sm transition-all"
				>
					<div class="flex items-start gap-3">
						<div class="p-2 bg-blue-50 rounded-lg">
							<Icon :name="capability.icon" class="!w-5 !h-5 text-blue-500" />
						</div>
						<div>
							<h4 class="text-sm font-medium text-stone-800 mb-1">{{ capability.title }}</h4>
							<p class="text-xs text-stone-600">{{ capability.subtitle }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Example queries -->
		<div class="mt-4 pt-4 border-t border-stone-200">
			<h4 class="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">Example Queries</h4>
			<div class="flex flex-wrap gap-2">
				<button
					:key="index"
					v-for="(example, index) in examples"
					@click="$emit('query-example', example.query)"
					class="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
				>
					{{ example.label }}
				</button>
			</div>
		</div>
	</div>
</template>

<script setup>
const capabilities = [
	{
		title: 'Variant Search',
		subtitle: 'Find specific variants by gene, type, or position',
		icon: 'heroicons:magnifying-glass',
	},
	{
		title: 'Mutation Analysis',
		subtitle: 'Count mutations and calculate summary statistics',
		icon: 'heroicons:chart-bar',
	},
	{
		title: 'Data Filtering',
		subtitle: 'Apply filters by dataset, variant type, or frequency',
		icon: 'heroicons:funnel',
	},
	{
		title: 'Research Insights',
		subtitle: 'Generate comprehensive analytics and patterns',
		icon: 'heroicons:light-bulb',
	},
]

// Example queries for quick access
const examples = [
	{ label: 'TP53 mutations', query: 'Show me all TP53 mutations in the database' },
	{ label: 'Mutation counts', query: 'Count mutations by gene across all datasets' },
	{ label: 'Variant types', query: 'What are the most common variant types in oral cancer?' },
	{ label: 'Dataset comparison', query: 'Compare mutation frequencies between TCGA and dbGENVOC datasets' },
]

defineEmits(['query-example'])
</script>

<style scoped>
/* Animation for fade-in effect */
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-fade-in {
	animation: fadeIn 0.6s ease-out forwards;
}
</style>
