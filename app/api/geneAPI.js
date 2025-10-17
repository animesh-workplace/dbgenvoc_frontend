export function useGeneAPI() {
	// const config = useRuntimeConfig()
	// const BASEURL = `${config.public.API_BASE_URL}`
	const BASEURL = 'http://10.10.6.80/dbgenvoc/api/v2'

	const AutocompleteAPI = async (payload) => {
		try {
			const { data, error } = await useFetch(`${BASEURL}/autocomplete/`, {
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
			const { data, error } = await useFetch(`${BASEURL}/${table_name}/search/`, {
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
			const { data, error } = await useFetch(`${BASEURL}/${table_name}/aggregate/`, {
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
			const { data, error } = await useFetch(`${BASEURL}/${table_name}/aggregate-concatenated/`, {
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
			const { data, error } = await useFetch(`${BASEURL}/ask/`, {
				method: 'GET',
				query: payload,
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

	return {
		AskAIAPI,
		SearchAPI,
		AggregateAPI,
		AutocompleteAPI,
		ConcateAggregateAPI,
	}
}
