<template>
	<div class="min-h-[calc(100vh-56px)]">
		<div class="px-8 pt-8 max-w-xl mx-auto">
			<SelectButton
				fluid
				size="large"
				defaultValue="Exome"
				v-model="somaticVariationType"
				:options="somaticVariationOptions"
				:pt="{
					pcToggleButton: {
						root: ({ props }) => {
							return props.onLabel == 'Exome'
								? '!bg-sky-100 !p-2 !rounded-l-3xl'
								: '!bg-sky-100 !p-2 !rounded-r-3xl'
						},
						content: ({ context }) => {
							return context.active ? '!bg-blue-800 text-white !rounded-2xl' : ''
						},
					},
				}"
			/>
		</div>

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
const somaticVariationType = ref('Exome')
const somaticVariationOptions = ref(['Exome', 'Whole Genome'])

onBeforeMount(() => {
	nextTick(async () => {})
})
</script>

<style scoped></style>
