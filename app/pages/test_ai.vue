<template>
	<div class="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
		<main class="flex-1 w-full pb-20 pt-8 px-4">
			<div v-if="messages.length === 0" class="space-y-10 mx-auto max-w-5xl">
				<ChatIntro @query-example="(query) => (userInput = query)" />
			</div>

			<div class="space-y-4 md:space-y-8" v-else>
				<ChatHeader center />
				<template v-for="(msg, idx) in messages" :key="idx">
					<ChatUser :message="msg" v-if="msg.role == 'user'" />
					<ChatAI :message="msg" v-else />
				</template>
			</div>
		</main>

		<footer
			class="sticky bottom-0 left-0 right-0 p-4 md:p-8 z-20 bg-gradient-to-t from-stone-100 to-transparent backdrop-blur-xs"
		>
			<div class="flex justify-center mx-auto relative group">
				<div
					class="relative bg-white rounded-xl shadow-sm shadow-blue-200 flex items-end border border-stone-200 hover:scale-100 sm:hover:scale-105 transition-all duration-300 w-full sm:w-[32rem] md:w-[42rem] focus-within:w-5xl focus-within:ring-2 focus-within:ring-blue-800/50"
				>
					<textarea
						rows="1"
						ref="textareaRef"
						v-model="userInput"
						@input="adjustHeight"
						placeholder="Enter your research query"
						class="w-full resize-none bg-transparent border-none focus:ring-0 p-4 text-sm text-stone-800 placeholder-stone-400 outline-none max-h-60 overflow-y-auto"
					/>

					<div class="p-2 flex flex-col gap-2 shrink-0 self-end">
						<button
							class="p-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl shadow-md transition flex items-center justify-center active:scale-95"
						>
							<Icon name="solar:arrow-right-outline" class="!w-5 !h-5" />
						</button>
					</div>
				</div>
			</div>

			<div class="text-center mt-2 text-xs text-stone-400 font-medium">
				VOCAL AI can make mistakes. Check important info
			</div>
		</footer>
	</div>
</template>

<script setup>
// Fake state for the conversation
const messages = ref([
	{
		role: 'user',
		content:
			'Analyze the variant call format (VCF) data from the recent sequencing run, focusing on chromosome 17.',
	},
	{
		role: 'assistant',
		thinking: 'thoughts',
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
])

const userInput = ref('')
const textareaRef = ref(null)

// Automatically adjust height based on content
const adjustHeight = () => {
	if (textareaRef.value) {
		// Reset height to 'auto' first to allow it to shrink if text is deleted
		textareaRef.value.style.height = 'auto'
		// Set height to scrollHeight (the total height of the content)
		textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
	}
}

// Watch the input to trigger resizing
watch(userInput, () => {
	nextTick(() => {
		adjustHeight()
	})
})
</script>

<style></style>
