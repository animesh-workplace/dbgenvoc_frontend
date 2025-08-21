<template>
	<div class="min-h-[calc(100vh-56px)]">
		<div class="grid grid-cols-3 gap-12 p-8">
			<GraphBar />
			<GraphBar />
			<GraphBar />
			<GraphLollipop class="col-span-3" />
		</div>
	</div>
</template>

<script setup>
import { useGeneAPI } from '@/api/geneAPI'

const searchVariantType = async () => {
	const { getSearchAPI } = useGeneAPI()
	try {
		const response = await getSearchAPI('exome_somatic', {
			term: 'TP53',
			exact_match: true,
			search_columns: ['gene'],
		})
		console.log(response)
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

onMounted(() => {
	nextTick(async () => {
		// Initialize the search variant type function
		searchVariantType()
	})
})
</script>

<style scoped></style>
