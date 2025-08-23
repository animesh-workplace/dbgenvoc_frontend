import { row } from '@primeuix/themes/aura/datatable'
import { map, forEach, sum } from 'lodash-es'

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
		sortByColSum: boolean = false,
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
		console.log(
			matrix,
			map(matrix, (_, j) => sum(map(matrix, (row) => row[j]))),
		)
		if (sortByColSum) {
			const colSums = matrix.map((col) => sum(col))
			const indices = colSums.map((val, idx) => ({ val, idx })).sort((a, b) => b.val - a.val) // descending

			matrix = indices.map(({ idx }) => matrix[idx])
			col_names = indices.map(({ idx }) => col_names[idx])
		}

		return matrix
	}

	return { useVariantMatrix }
}
