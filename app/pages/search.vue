<template>
	<div class="min-h-[calc(100vh-56px)]">
		<div class="px-8 pt-8 max-w-xl mx-auto">
			<SelectButton
				fluid
				size="large"
				:allowEmpty="false"
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
			<ResultSection
				sectionName="dbGENVOC"
				:tableName="
					somaticVariationType == 'Exome' ? 'nibmg_exome_somatic_variants' : 'nibmg_wg_somatic_variants'
				"
			/>
		</section>
		<Divider />

		<section ref="tcgaSection" class="min-h-[300px]">
			<template v-if="isTcgaLoaded">
				<ResultSection
					tableName="tcga_exome_somatic_variants"
					sectionName="TCGA (Exome somatic specific)"
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
								Our database contains public data from TCGA Exome somatic variation resources.
								Whole Genome Sequence dataset from TCGA project will be available later once the
								project data is publicly accessible.
							</p>
						</div>
					</div>
				</div>
			</template>
			<div v-else class="flex justify-center items-center h-full text-gray-400 text-sm">
				Scroll to load TCGA data...
			</div>
		</section>
		<Divider />

		<section ref="peerReviewedSection" class="mb-12 min-h-[300px]">
			<template v-if="isPeerReviewedLoaded">
				<ResultSection
					sectionName="peer-reviewed papers"
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
								No Whole Genome Sequence dataset is available from peer-reviewed paper resources as
								of now.
							</p>
						</div>
					</div>
				</div>
			</template>
		</section>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const somaticVariationType = ref('Exome')
const somaticVariationOptions = ref(['Exome', 'Whole Genome'])

// Refs for the DOM elements to observe
const tcgaSection = ref(null)
const peerReviewedSection = ref(null)

// State to track if the component should be rendered
const isTcgaLoaded = ref(false)
const isPeerReviewedLoaded = ref(false)

let observer = null

onMounted(() => {
	// specific options for the observer
	const options = {
		root: null, // viewport
		rootMargin: '200px', // Load data when user scrolls within 200px of the section
		threshold: 0.1, // Trigger when 10% of the placeholder is visible
	}

	observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				// If TCGA section comes into view
				if (entry.target === tcgaSection.value) {
					isTcgaLoaded.value = true
					observer.unobserve(entry.target) // Stop observing once loaded (load once behavior)
				}
				// If Peer Reviewed section comes into view
				if (entry.target === peerReviewedSection.value) {
					isPeerReviewedLoaded.value = true
					observer.unobserve(entry.target)
				}
			}
		})
	}, options)

	// Start observing
	if (tcgaSection.value) observer.observe(tcgaSection.value)
	if (peerReviewedSection.value) observer.observe(peerReviewedSection.value)
})

onUnmounted(() => {
	if (observer) observer.disconnect()
})
</script>

<style scoped></style>
