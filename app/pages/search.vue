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

		<section ref="tcgaSection" :class="somaticVariationType === 'Exome' ? 'min-h-[300px]' : 'mb-12'">
			<template v-if="isTcgaLoaded">
				<ResultSection
					tableName="tcga_exome_somatic_variants"
					sectionName="TCGA (Exome somatic specific)"
					:noData="somaticVariationType === 'Whole Genome' ? true : false"
				/>

				<div
					v-if="somaticVariationType === 'Whole Genome'"
					class="bg-blue-50 p-5 my-8 mx-8 rounded-2xl shadow-sm border-1 border-blue-100"
				>
					<div class="flex items-start">
						<div class="flex-shrink-0">
							<Icon name="solar:info-circle-bold-duotone" class="!w-6 !h-6 text-blue-500" />
						</div>
						<div class="ml-4">
							<h3 class="text-sm font-bold text-blue-900 uppercase tracking-wider mb-1">
								Data Availability Notice
							</h3>
							<p class="text-sm text-blue-800 leading-relaxed">
								Our database currently prioritizes public data from
								<strong>TCGA Exome</strong> somatic variation resources. Whole Genome Sequencing
								(WGS) datasets from the TCGA project will be integrated once the public data
								released.
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

		<section ref="peerReviewedSection" :class="somaticVariationType === 'Exome' ? 'min-h-[300px]' : 'mb-12'">
			<template v-if="isPeerReviewedLoaded">
				<ResultSection
					sectionName="peer-reviewed papers"
					tableName="journal_exome_somatic_variants"
					:noData="somaticVariationType === 'Whole Genome' ? true : false"
				/>

				<div
					v-if="somaticVariationType === 'Whole Genome'"
					class="bg-blue-50 p-5 my-8 mx-8 rounded-2xl shadow-sm border-1 border-blue-100"
				>
					<div class="flex items-start">
						<div class="flex-shrink-0">
							<Icon name="solar:info-circle-bold-duotone" class="!w-6 !h-6 text-blue-500" />
						</div>
						<div class="ml-4">
							<h3 class="text-sm font-bold text-blue-900 uppercase tracking-wider mb-1">
								Data Availability Notice
							</h3>
							<p class="text-sm text-blue-800">
								No Whole Genome Sequence dataset is available from peer-reviewed paper resources as
								of now.
							</p>
						</div>
					</div>
				</div>
			</template>

			<div v-else class="flex justify-center items-center h-full text-gray-400 text-sm">
				Scroll to load peer reviewed data...
			</div>
		</section>
	</div>
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core'

const somaticVariationType = ref('Exome')
const somaticVariationOptions = ref(['Exome', 'Whole Genome'])

let stopTcgaObserver = null
let stopPeerObserver = null
const tcgaSection = ref(null)
const isTcgaLoaded = ref(false)
const peerReviewedSection = ref(null)
const isPeerReviewedLoaded = ref(false)

const initObservers = () => {
	// 1. Cleanup previous observers if they exist (for the reset case)
	if (stopTcgaObserver) stopTcgaObserver()
	if (stopPeerObserver) stopPeerObserver()

	// 2. Setup TCGA Observer
	const tcgaOutput = useIntersectionObserver(
		tcgaSection,
		([{ isIntersecting }]) => {
			if (isIntersecting) {
				isTcgaLoaded.value = true
				stopTcgaObserver() // Stop observing once loaded (Load Once)
			}
		},
		{ rootMargin: '200px', threshold: 0.1 },
	)
	stopTcgaObserver = tcgaOutput.stop

	// 3. Setup Peer Reviewed Observer
	const peerOutput = useIntersectionObserver(
		peerReviewedSection,
		([{ isIntersecting }]) => {
			if (isIntersecting) {
				isPeerReviewedLoaded.value = true
				stopPeerObserver() // Stop observing once loaded
			}
		},
		{ rootMargin: '200px', threshold: 0.1 },
	)
	stopPeerObserver = peerOutput.stop
}

// Watch for dropdown changes
watch(
	somaticVariationType,
	() => {
		// Reset data state
		isTcgaLoaded.value = false
		isPeerReviewedLoaded.value = false

		// Re-initialize observers
		// This is crucial: It re-attaches the observer, which immediately checks
		// if the element is currently visible.
		initObservers()
	},
	{ immediate: true },
) // 'immediate: true' replaces onMounted
</script>

<style scoped></style>
