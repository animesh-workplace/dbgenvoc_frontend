<template>
	<div class="min-h-[calc(100vh-56px)]">
		<section>
			<ResultSectionMain tableName="exome_somatic" />
		</section>
		<Divider />

		<section>
			<ResultSectionTCGA tableName="es_tcga" />
		</section>
		<Divider />

		<section class="mb-12">
			<ResultSectionJournal tableName="es_journal" />
		</section>
	</div>
</template>

<script setup>
onBeforeMount(() => {
	nextTick(async () => {})
})
</script>

<style scoped></style>
