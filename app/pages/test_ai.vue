<script setup lang="ts">
// Fake state for the conversation
const messages = ref([
	{
		role: 'user',
		content:
			'Analyze the variant call format (VCF) data from the recent sequencing run, focusing on chromosome 17.',
	},
	{
		role: 'assistant',
		title: 'VCF Analysis: Chromosome 17 Region',
		content: `
			Based on the provided dataset, I have analyzed the requested genomic regions. Below is a summary of high-impact variants found within the *TP53* locus on Chromosome 17.

			### Key Findings

			- **Variant rs28934578 (c.733G>A):**  
			A missense mutation observed with a frequency of 12% in the sample set. Pathogenicity prediction tools classify this as likely pathogenic.

			- **Indel at pos 7,577,120:**  
			A 4bp deletion causing a frameshift. This is a novel variant not previously recorded in dbSNP.

			### Interpretation

			The concentration of variants in the DNA-binding domain suggests potential functional disruption. I recommend cross-referencing these findings with the ClinVar database for established clinical significance.
    	`,
	},
	{
		role: 'user',
		content: 'Generate a visualization for the allele frequency distribution of the missense mutation.',
	},
	{
		role: 'assistant',
		title: 'Visualization Generated',
		// Simulating a placeholder for a chart or complex output
		isWidget: true,
		content: 'Allele Frequency Distribution Chart',
	},
])

const userInput = ref('')
</script>

<template>
	<div class="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
		<main class="flex-1 w-full py-20 px-4">
			<div class="space-y-12">
				<template v-for="(msg, idx) in messages" :key="idx">
					<div v-if="msg.role === 'user'" class="flex gap-4 justify-end pl-12">
						<div
							class="bg-white border-2 border-stone-200 p-5 rounded-2xl rounded-tr-sm shadow-sm max-w-xl"
						>
							<p class="text-stone-700 font-medium text-[15px] leading-relaxed">
								{{ msg.content }}
							</p>
						</div>
						<div
							class="w-10 h-10 rounded-full bg-stone-300 flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="w-5 h-5 text-stone-600"
							>
								<path
									fill-rule="evenodd"
									d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
									clip-rule="evenodd"
								/>
							</svg>
						</div>
					</div>

					<div v-else class="relative pr-12">
						<div class="absolute left-5 -top-12 bottom-0 w-0.5 bg-stone-200 -z-10"></div>

						<div class="flex gap-6 mr-10">
							<div
								class="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0 border-2 border-white shadow-sm z-10"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									class="w-5 h-5 text-blue-900"
								>
									<path d="M16.5 7.5h-9v9h9v-9z" />
									<path
										fill-rule="evenodd"
										d="M8.25 2.25A.75.75 0 019 3v1.5h6V3a.75.75 0 011.5 0v1.5A2.25 2.25 0 0118.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25V6.75A2.25 2.25 0 017.5 4.5V3a.75.75 0 01.75-.75zM6.75 6.75h10.5v10.5H6.75V6.75z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>

							<div class="p-8 rounded-2xl w-full border-t-4 border-blue-900 bg-white shadow-sm">
								<div
									v-if="msg.isWidget"
									class="h-64 bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-500"
								>
									<span class="font-medium">{{ msg.content }}</span>
								</div>

								<div v-else class="overflow-scroll">
									<h2
										v-if="msg.title"
										class="text-xl font-bold text-stone-900 mb-6 pb-4 border-b border-stone-100"
									>
										{{ msg.title }}
									</h2>
									<MDC :value="msg.content" />
								</div>

								<div
									class="mt-4 flex items-center justify-between pt-4 border-t border-stone-50 text-sm text-stone-400"
								>
									<span class="flex items-center gap-1"
										><svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 20 20"
											fill="currentColor"
											class="w-4 h-4"
										>
											<path
												fill-rule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
												clip-rule="evenodd"
											/>
										</svg>
										Generated in 2.4s</span
									>
									<div class="flex gap-3">
										<button class="hover:text-stone-700 transition">Copy</button>
										<button class="hover:text-stone-700 transition">Cite</button>
									</div>
								</div>
								<div class="text-right mt-3 text-xs text-stone-500 font-medium">
									dbgenvoc.research builds upon verified genomic datasets. Verify critical
									findings.
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>
		</main>

		<footer class="sticky bottom-0 left-0 right-0 p-4 md:p-8 z-20">
			<div class="max-w-4xl mx-auto relative group">
				<div
					class="absolute -inset-1 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"
				></div>

				<div class="relative bg-white rounded-xl shadow-xl flex items-end p-2 border border-stone-200">
					<textarea
						v-model="userInput"
						rows="2"
						class="w-full resize-none bg-transparent border-none focus:ring-0 p-4 text-lg text-stone-800 placeholder-stone-400 outline-none"
						placeholder="Enter your research query or provide data context..."
					></textarea>
					<div class="p-2 flex flex-col gap-2 shrink-0">
						<button
							class="p-3 bg-blue-800 hover:bg-blue-800 text-white rounded-lg shadow-md transition flex items-center justify-center"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								class="w-6 h-6 transform rotate-90"
							>
								<path
									d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>
		</footer>
	</div>
</template>

<style></style>
