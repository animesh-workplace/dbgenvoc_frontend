<template>
	<div class="min-h-[calc(100vh-56px)]">
		<div class="flex flex-col h-[85vh] bg-gray-50 font-sans">
			<div class="p-4 border-b bg-white rounded-t-2xl">
				<h1 class="text-xl font-bold text-center text-gray-800">VOCAL AI</h1>
				<p class="text-sm text-center text-gray-500">Your dbGENVOC Query Assistant</p>
			</div>

			<div ref="chatContainer" class="flex-1 p-6 space-y-6 overflow-y-auto">
				<div
					class="flex"
					:key="index"
					v-for="(message, index) in chatHistory"
					:class="message.sender === 'user' ? 'justify-end' : 'flex-col justify-start'"
				>
					<Accordion v-if="message.plan" class="max-w-md mb-2">
						<AccordionPanel
							class="mb-2"
							:key="index"
							:value="index"
							v-for="(plan, index) in message.plan"
						>
							<AccordionHeader class="text-xs font-medium text-gray-700">
								{{ plan.tool_name }}
							</AccordionHeader>
							<AccordionContent>
								<div>{{ plan.query_context }}</div>
								<div>
									<pre class="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{{
										plan.params
									}}</pre>
								</div>
							</AccordionContent>
						</AccordionPanel>
					</Accordion>

					<div
						class="rounded-lg px-4 py-2 max-w-md"
						:class="message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'"
					>
						<MDC :value="message.content" tag="article" />
					</div>

					<div v-if="message.tables && message.tables.length" class="mt-4 w-full">
						<div v-for="(table, tIndex) in message.tables" :key="`table-${tIndex}`" class="mt-6">
							<h3 class="text-md font-semibold mb-2">Results Table:</h3>
							<GenericTable :tableData="table.data" :tableParams="table.params" />
						</div>
					</div>
				</div>
			</div>

			<div v-if="isLoading" class="px-6 pb-2 text-sm text-gray-500 italic">
				<p>{{ streamStatus }}</p>
			</div>

			<div class="p-4 border-t bg-white rounded-b-2xl">
				<form @submit.prevent="sendMessage" class="flex items-center space-x-3">
					<input
						type="text"
						v-model="userInput"
						:disabled="isLoading"
						placeholder="Ask about oral cancer variants..."
						class="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
					/>
					<button
						type="submit"
						:disabled="isLoading || !userInput.trim()"
						class="px-5 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
					>
						Send
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { map } from 'lodash-es'
import { useGeneAPI } from '@/api/geneAPI'
const { AskAIAPI } = useGeneAPI()

const userInput = ref('')
const chatHistory = ref([
	{
		plan: null,
		tables: [],
		sender: 'ai',
		content: 'Hello! I am VOCAL. How can I help you query the dbGENVOC database today?',
	},
])
const isLoading = ref(false)
const streamStatus = ref('')
const chatContainer = ref(null)

const scrollToBottom = () => {
	nextTick(() => {
		if (chatContainer.value) {
			chatContainer.value.scrollTop = chatContainer.value.scrollHeight
		}
	})
}

const sendMessage = async () => {
	const query = userInput.value.trim()
	if (!query || isLoading.value) return

	// 1. Update UI immediately
	isLoading.value = true
	chatHistory.value.push({ sender: 'user', content: query })
	userInput.value = ''
	scrollToBottom()

	// 2. Call the backend API
	// await streamMockResponse(query)
	streamStatus.value = '🧠 Thinking and creating an execution plan...'
	await ChatWithAI(query)
	streamStatus.value = ''
}

const ChatWithAI = async (query) => {
	try {
		const response = await AskAIAPI({
			query: query,
		})
		const ai_output = {
			sender: 'ai',
			plan: map(response.results, (item) => ({
				tool_name: item.tool_name,
				query_context: item.context,
				params: JSON.stringify(item.params, null, 2),
			})),
			content: response.answer,
			tables: map(response.results, (item) =>
				item.tool_name == 'generic_search' ? { data: item.result, params: item.params } : null,
			).filter(Boolean),
		}
		chatHistory.value.push(ai_output)
		isLoading.value = false
		scrollToBottom()
	} catch (error) {
		isLoading.value = false
		let errorMessage = 'Sorry, an unexpected error occurred. Please check the console for details.'

		if (error.response && error.response.data && error.response.data.detail) {
			errorMessage = `I encountered an issue: ${error.response.data.detail}`
		} else if (error.message) {
			errorMessage = error.message
		}

		chatHistory.value.push({
			plan: null,
			tables: [],
			sender: 'ai',
			content: errorMessage,
		})
		console.error('Error fetching data:', error.response ? error.response.data : error)
		scrollToBottom()
	}
}

// const streamMockResponse = async (query) => {
// 	const mockStream = [
// 		{ status: 'thinking', data: '🧠 Thinking and creating an execution plan...', is_final: false },
// 		{ status: 'tool_call', data: '⚙️ Calling neccessary tools ...', is_final: false },
// 		{ status: 'synthesizing', data: '🗣️ Compiling results and generating a summary...', is_final: false },
// 	]

// 	for (const message of mockStream) {
// 		await new Promise((resolve) => setTimeout(resolve, 1200)) // Simulate network delay

// 		streamStatus.value = message.data // Update the status message
// 		scrollToBottom()
// 	}
// 	scrollToBottom()
// }
</script>

<style scoped></style>
