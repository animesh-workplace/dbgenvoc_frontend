import { map, forEach } from 'lodash-es'

type VariantMatrix = number[][]

interface VariantRecord {
	gene: string
	aggregated_value: number
	[key: string]: string | number | undefined
}

export const useHelper = () => {
	const useVariantMatrix = (
		result: VariantRecord[],
		row_names: string[],
		col_names: string[],
		key_name: string,
	) => {
		let matrix: VariantMatrix = map(col_names, (d) => Array(row_names.length).fill(0))

		// Index maps for quick lookup
		const geneIndex = new Map<string, number>(map(col_names, (g, i) => [g, i]))
		const categoryIndex = new Map<string, number>(map(row_names, (c, j) => [c, j]))

		// Populate the data array
		forEach(result, (item) => {
			const i = geneIndex.get(item.gene)
			const j = categoryIndex.get(item[key_name] as string)
			if (i !== undefined && j !== undefined && matrix[i]) {
				matrix[i][j] = item.aggregated_value
			}
		})

		return matrix
	}

	return { useVariantMatrix }
}
