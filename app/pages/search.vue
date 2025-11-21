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
			<ResultSectionMain
				:tableName="
					somaticVariationType == 'Exome' ? 'nibmg_exome_somatic_variants' : 'nibmg_wg_somatic_variants'
				"
			/>
		</section>
		<Divider />

		<section>
			<ResultSectionTCGA
				tableName="tcga_exome_somatic_variants"
				:noData="somaticVariationType === 'Whole Genome' ? true : false"
			/>

			<div
				v-if="somaticVariationType === 'Whole Genome'"
				class="bg-blue-50 border-l-4 border-blue-400 p-4 my-8 mx-8 rounded-2xl"
			>
				<div class="flex">
					<div class="flex-shrink-0">
						<Icon name="solar:info-circle-bold-duotone" class="!w-5 !h-5 text-blue-400" />
					</div>
					<div class="ml-3">
						<p class="text-sm text-blue-800">
							Our database contains public data from TCGA Exome somatic variation resources. Whole
							Genome Sequence dataset from TCGA project will be available later once the project data
							is publicly accessible.
						</p>
					</div>
				</div>
			</div>
		</section>
		<Divider />

		<section class="mb-12">
			<ResultSectionJournal
				tableName="journal_exome_somatic_variants"
				:noData="somaticVariationType === 'Whole Genome' ? true : false"
			/>

			<div
				v-if="somaticVariationType === 'Whole Genome'"
				class="bg-blue-50 border-l-4 border-blue-400 p-4 my-8 mx-8 rounded-2xl"
			>
				<div class="flex">
					<div class="flex-shrink-0">
						<Icon name="solar:info-circle-bold-duotone" class="!w-5 !h-5 text-blue-400" />
					</div>
					<div class="ml-3">
						<p class="text-sm text-blue-800">
							No Whole Genome Sequence dataset is available from peer-reviewed paper resources as of
							now.
						</p>
					</div>
				</div>
			</div>
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
