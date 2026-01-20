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
					<ChatAI :message="msg" v-else ref="aiRefs" />
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
						@keydown.enter.prevent="sendMessage"
						placeholder="Enter your research query"
						class="w-full resize-none bg-transparent border-none focus:ring-0 p-4 text-sm text-stone-800 placeholder-stone-400 outline-none max-h-60 overflow-y-auto"
					/>

					<div class="p-2 flex flex-col gap-2 shrink-0 self-end">
						<button
							@click="sendMessage"
							:disabled="isLoading"
							:class="{ 'opacity-50 cursor-not-allowed': isLoading }"
							class="p-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl shadow-md transition flex items-center justify-center active:scale-95"
						>
							<Icon v-if="isLoading" name="svg-spinners:90-ring-with-bg" class="!w-5 !h-5" />
							<Icon v-else name="solar:arrow-right-outline" class="!w-5 !h-5" />
						</button>
					</div>
				</div>
			</div>

			<div class="text-center mt-2 text-xs text-stone-400 font-medium">
				OSCAR AI can make mistakes. Check important info
			</div>
		</footer>
	</div>
</template>

<script setup>
import { useGeneAPI } from '@/api/geneAPI'
const { AskAIAPI } = useGeneAPI()

// -- State --
const messages = ref([])
const userInput = ref('')
const textareaRef = ref(null)
const bottomRef = ref(null) // Reference for auto-scrolling
const isLoading = ref(false)

// -- Auto Resize Logic --
const adjustHeight = () => {
	if (textareaRef.value) {
		textareaRef.value.style.height = 'auto'
		textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
	}
}

watch(userInput, () => {
	nextTick(adjustHeight)
})

// -- Auto Scroll Logic --
const scrollToBottom = () => {
	nextTick(() => {
		const lastAI = aiRefs.value.at(-1)
		lastAI?.$el?.scrollIntoView({ behavior: 'smooth' })
	})
}

// -- Streaming Logic --
const sendMessage = async () => {
	const query = userInput.value.trim()
	if (!query || isLoading.value) return

	userInput.value = ''
	adjustHeight()
	isLoading.value = true

	// Add user message
	messages.value.push({ role: 'user', content: query })

	// Add assistant placeholder
	const botMsgIndex = messages.value.length
	messages.value.push({
		title: '',
		events: [],
		content: '',
		results: {},
		role: 'assistant',
		thinking: 'Initializing workflow...',
		total_time: 0,
	})

	scrollToBottom()
	let start_time = Date.now()

	try {
		// Call the updated API function
		const response = await AskAIAPI({
			query: query,
			stream: true,
		})

		if (!response.body) throw new Error('ReadableStream not supported.')

		const reader = response.body.getReader()
		const decoder = new TextDecoder()
		let buffer = ''

		while (true) {
			const { done, value } = await reader.read()
			if (done) break

			buffer += decoder.decode(value, { stream: true })
			const lines = buffer.split('\n')
			buffer = lines.pop() // Keep incomplete line in buffer

			for (const line of lines) {
				const trimmedLine = line.trim()
				if (!trimmedLine) continue

				// Handle SSE format: "data: {...}"
				if (trimmedLine.startsWith('data: ')) {
					const jsonStr = trimmedLine.slice(6) // Remove "data: " prefix
					try {
						// Check if it's the "[DONE]" message often sent by SSE
						if (jsonStr.trim() === '[DONE]') continue

						const event = JSON.parse(jsonStr)
						console.log('Parsed event:', event)
						handleStreamEvent(event, botMsgIndex)
					} catch (e) {
						console.error('JSON Parse error on line:', trimmedLine, e)
					}
				}
				// Handle standard NDJSON (fallback)
				else if (trimmedLine.startsWith('{')) {
					try {
						const event = JSON.parse(trimmedLine)
						console.log('🚀 ~ :152 ~ sendMessage ~ event:', event)
						handleStreamEvent(event, botMsgIndex)
					} catch (e) {
						console.error(e)
					}
				}
			}
		}
	} catch (error) {
		console.error('Stream error:', error)
		messages.value[botMsgIndex].content = `Error: ${error.message}`
	} finally {
		isLoading.value = false
		const end_time = Date.now()
		messages.value[botMsgIndex].total_time = ((end_time - start_time) / 1000).toFixed(2)
	}
}

// Helper to map event types to UI updates
const handleStreamEvent = (event, index) => {
	const msg = messages.value[index]

	switch (event.type) {
		case 'status':
			// Update the "thinking" indicator
			msg.thinking = event.data.message
			msg.events.push({
				status: event.data.message,
				timestamp: new Date().toISOString(),
			})
			break

		case 'plan':
			// Determine if we should update title or thinking based on plan
			msg.thinking = 'Execution plan generated...'
			msg.events.push({
				status: 'Plan created',
				timestamp: new Date().toISOString(),
				content: event.data?.plan,
			})
			break

		case 'step_complete':
			// Determine if we should update title or thinking based on plan
			msg.thinking = 'Tool executed...'
			msg.events.push({
				status: 'Tool executed',
				timestamp: new Date().toISOString(),
				content: event.data?.result?.params,
			})
			break

		case 'synthesis_complete':
			// The final answer text is here
			msg.content = event.data.synthesis
			break

		case 'final':
			// Final consistency check
			if (event.data.synthesis) {
				msg.content = event.data.synthesis
				msg.results = event.data.results || {}
			}
			msg.thinking = 'Thoughts' // or set to null to hide thinking UI
			break
	}
}
</script>
