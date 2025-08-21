export function useGeneAPI() {
	// const config = useRuntimeConfig()
	// const BASEURL = `${config.public.API_BASE_URL}`
	const BASEURL = 'http://10.10.6.80/dbgenvoc/api/v2'

	const getSearchAPI = async (table_name, payload) => {
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

	return {
		getSearchAPI,
	}
}
