export function useGeneAPI() {
	// const config = useRuntimeConfig()
	// const BASEURL = `${config.public.API_BASE_URL}`
	const BASEURL = 'http://10.10.6.80/dbgenvoc/api/v2'

	const AutocompleteAPI = async (payload) => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/autocomplete`, {
				method: 'POST',
				body: payload,
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const StructureAPI = async (payload) => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/structure`, {
				method: 'POST',
				body: payload,
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const SearchAPI = async (table_name, payload) => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/${table_name}/search`, {
				method: 'POST',
				body: payload,
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const AggregateAPI = async (table_name, payload) => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/${table_name}/aggregate`, {
				method: 'POST',
				body: payload,
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const ConcateAggregateAPI = async (table_name, payload) => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/${table_name}/aggregate-concatenated`, {
				method: 'POST',
				body: payload,
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const OncoplotAPI = async (table_name, payload) => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/${table_name}/oncoplot`, {
				method: 'POST',
				body: payload,
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const InteractionsAPI = async (table_name, payload) => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/${table_name}/interactions`, {
				method: 'POST',
				body: payload,
			})

			if (error.value) {
				throw new Error(error.value || 'An error occurred')
			}

			return data.value
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	const AskAIAPI = async (payload) => {
		try {
			// Construct query parameters
			const params = new URLSearchParams(payload).toString()
			const url = `${BASEURL}/ask?${params}`

			// Use native fetch to keep the stream open
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					// Add authentication headers here if needed
				},
			})

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`)
			}

			// Return the raw response object so we can access response.body
			return response
		} catch (err) {
			console.error(err)
			throw err
		}
	}

	return {
		AskAIAPI,
		SearchAPI,
		OncoplotAPI,
		AggregateAPI,
		StructureAPI,
		InteractionsAPI,
		AutocompleteAPI,
		ConcateAggregateAPI,
	}
}
