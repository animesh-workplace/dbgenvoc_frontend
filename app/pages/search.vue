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
		<section>
			<ResultSectionJournal tableName="es_journal" />
		</section>
		<Divider />
	</div>
</template>

<script setup>
onBeforeMount(() => {
	nextTick(async () => {})
})
</script>

<style scoped></style>
