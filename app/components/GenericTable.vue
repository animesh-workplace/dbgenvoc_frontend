<template>
	<div class="p-8">
		<DataTable
			lazy
			rowHover
			paginator
			scrollable
			class="p-1"
			stripedRows
			size="small"
			showGridlines
			removableSort
			:rows="noOfRows"
			resizableColumns
			@sort="HandleSort"
			@page="HandlePage"
			scrollHeight="20rem"
			columnResizeMode="expand"
			:value="searchData.results"
			:totalRecords="searchData.total_results"
			:rowsPerPageOptions="[10, 50, 100, 200, 500]"
		>
			<Column
				sortable
				:key="col.field"
				:field="col.field"
				:header="col.header"
				v-for="col of columns.filter((c) => c.field !== 'reference_url')"
			>
				<template #body="slotProps">
					<!-- Handling reference URL -->
					<template v-if="col.field === 'reference'">
						<NuxtLink
							target="_blank"
							:to="slotProps.data.reference_url"
							class="text-blue-600 hover:underline"
						>
							{{ slotProps.data.reference }}
						</NuxtLink>
					</template>

					<!-- Handling Entrez Gene ID -->
					<template v-else-if="col.field === 'entrez_gene_id'">
						<NuxtLink
							target="_blank"
							:to="`https://www.ncbi.nlm.nih.gov/gene/${slotProps.data.entrez_gene_id}`"
							class="text-blue-600 hover:underline"
						>
							{{ slotProps.data.entrez_gene_id }}
						</NuxtLink>
					</template>

					<!-- Handling UCSC Browser -->
					<template v-else-if="col.field === 'genome_change_link'">
						<NuxtLink
							target="_blank"
							:to="generateUCSCUrl(slotProps.data.genome_change)"
							class="text-blue-600 hover:underline"
						>
							View in UCSC
						</NuxtLink>
					</template>

					<!-- Default case for other columns -->
					<template v-else>
						{{ slotProps.data[col.field] }}
					</template>
				</template>
			</Column>
		</DataTable>
	</div>
</template>

<script setup>
import { useGeneAPI } from '@/api/geneAPI'
const { SearchAPI } = useGeneAPI()

const props = defineProps({
	tableData: { type: Object, required: true },
	tableParams: { type: Object, required: true },
})

const noOfRows = ref(10)
const searchData = ref({})

const es_journal_columns = [
	{ field: 'variant_id', header: 'DB ID' },
	{ field: 'gene', header: 'Gene' },
	{ field: 'entrez_gene_id', header: 'Entrez ID' },
	{ field: 'disease', header: 'Disease' },
	{ field: 'chrom', header: 'Chromosome' },
	{ field: 'start', header: 'Start' },
	{ field: 'end', header: 'End' },
	{ field: 'genome_change', header: 'Genome Change' },
	{ field: 'genome_change_link', header: 'UCSC Browser' },
	{ field: 'cDNA_change', header: 'cDNA Change' },
	{ field: 'codon_change', header: 'Codon Change' },
	{ field: 'protein_change', header: 'Protein Change' },
	{ field: 'variant_class', header: 'Variant Class' },
	{ field: 'variant_type', header: 'Variant Type' },
	{ field: 'ref_allele', header: 'Ref Allele' },
	{ field: 'tumor_seq_allele2', header: 'Tumor Allele' },
	{ field: 'dbsnp_rs', header: 'dbSNP ID' },
	{ field: 'sample_id', header: 'Sample ID' },
	{ field: 'annotation_transcript', header: 'Annotation Transcript' },
	{ field: 'transcript_strand', header: 'Transcript Strand' },
	{ field: 'transcript_exon', header: 'Transcript Exon' },
	{ field: 'reference', header: 'Reference' },
	{ field: 'reference_url', header: 'Reference URL' },
]

const main_columns = [
	{ field: 'variant_id', header: 'DB ID' },
	{ field: 'gene', header: 'Gene' },
	{ field: 'entrez_gene_id', header: 'Entrez ID' },
	{ field: 'disease', header: 'Disease' },
	{ field: 'chrom', header: 'Chromosome' },
	{ field: 'start', header: 'Start' },
	{ field: 'end', header: 'End' },
	{ field: 'genome_change', header: 'Genome Change' },
	{ field: 'genome_change_link', header: 'UCSC Browser' },
	{ field: 'cDNA_change', header: 'cDNA Change' },
	{ field: 'codon_change', header: 'Codon Change' },
	{ field: 'protein_change', header: 'Protein Change' },
	{ field: 'variant_class', header: 'Variant Class' },
	{ field: 'variant_type', header: 'Variant Type' },
	{ field: 'ref_allele', header: 'Ref Allele' },
	{ field: 'tumor_seq_allele2', header: 'Tumor Allele' },
	{ field: 'dbsnp_rs', header: 'dbSNP ID' },
	{ field: 'sample_id', header: 'Sample ID' },
	{ field: 'annotation_transcript', header: 'Annotation Transcript' },
	{ field: 'transcript_strand', header: 'Transcript Strand' },
	{ field: 'transcript_exon', header: 'Transcript Exon' },
	{ field: 'reference', header: 'Reference' },
	{ field: 'reference_url', header: 'Reference URL' },
]

const es_tcga_columns = [
	{ field: 'variant_id', header: 'DB ID' },
	{ field: 'gene', header: 'Gene' },
	{ field: 'entrez_gene_id', header: 'Entrez ID' },
	{ field: 'disease', header: 'Disease' },
	{ field: 'chrom', header: 'Chromosome' },
	{ field: 'start', header: 'Start' },
	{ field: 'end', header: 'End' },
	{ field: 'genome_change', header: 'Genome Change' },
	{ field: 'genome_change_link', header: 'UCSC Browser' },
	{ field: 'cDNA_change', header: 'cDNA Change' },
	{ field: 'codon_change', header: 'Codon Change' },
	{ field: 'protein_change', header: 'Protein Change' },
	{ field: 'variant_class', header: 'Variant Class' },
	{ field: 'variant_type', header: 'Variant Type' },
	{ field: 'ref_allele', header: 'Ref Allele' },
	{ field: 'tumor_seq_allele2', header: 'Tumor Allele' },
	{ field: 'dbsnp_rs', header: 'dbSNP ID' },
	{ field: 'sample_id', header: 'Sample ID' },
	{ field: 'annotation_transcript', header: 'Annotation Transcript' },
	{ field: 'transcript_strand', header: 'Transcript Strand' },
	{ field: 'transcript_exon', header: 'Transcript Exon' },
	{ field: 'reference', header: 'Reference' },
	{ field: 'reference_url', header: 'Reference URL' },
]

const parseGenomicCoordinates = (genomeChange) => {
	// Patterns for different variant types:
	// 1. SNVs: g.chr13:32910626C>T, chr13:32910626C>T
	// 2. Deletions: g.chr17:7577092delC, chr17:7577092delC
	// 3. Insertions: g.chr1:12345insA, chr1:12345insA
	// 4. Simple coordinates: g.chr13:32910626, chr13:32910626

	const patterns = [
		// SNVs with g. prefix
		/g\.(chr[XY\d]+):(\d+)([ACGT]>[ACGT])/i,
		// Deletions with g. prefix
		/g\.(chr[XY\d]+):(\d+)del([ACGT]+)/i,
		// Insertions with g. prefix
		/g\.(chr[XY\d]+):(\d+)ins([ACGT]+)/i,
		// Simple coordinates with g. prefix
		/g\.(chr[XY\d]+):(\d+)/i,

		// Same patterns without g. prefix
		/(chr[XY\d]+):(\d+)([ACGT]>[ACGT])/i,
		/(chr[XY\d]+):(\d+)del([ACGT]+)/i,
		/(chr[XY\d]+):(\d+)ins([ACGT]+)/i,
		/(chr[XY\d]+):(\d+)/i,
	]

	for (const pattern of patterns) {
		const match = genomeChange.match(pattern)
		if (match) {
			const chromosome = match[1]
			const position = parseInt(match[2])

			// For UCSC Genome Browser, we typically show a small region around the variant
			const start = Math.max(1, position - 50) // 50bp upstream
			const end = position + 50 // 50bp downstream

			return {
				chromosome,
				position,
				start,
				end,
				formattedPosition: `${chromosome}:${start}-${end}`,
			}
		}
	}
	return null
}

// Function to generate UCSC Genome Browser URL
const generateUCSCUrl = (genomeChange) => {
	const coords = parseGenomicCoordinates(genomeChange)
	if (!coords) return '#'

	return `https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg19&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=${coords.formattedPosition}&hgsid=783385835_z0061mD0u0xo6HFQCdLHaeOZp9UA`
}

const HandleSort = async (event) => {
	let sortOrder = 'asc'
	if (event.sortOrder === -1) {
		sortOrder = 'desc'
	}
	await searchByAPI(event.sortField, sortOrder, (event.page ?? 0) + 1)
}

const HandlePage = async (event) => {
	noOfRows.value = event.rows
	let sortOrder = 'asc'
	if (event.sortOrder === -1) {
		sortOrder = 'desc'
	}
	await searchByAPI(event.sortField, sortOrder, (event.page ?? 0) + 1)
}

const searchByAPI = async (sort_by = null, sort_order = 'asc', page = 1) => {
	try {
		const response = await SearchAPI(props.tableParams?.table_name, {
			page,
			sort_by,
			sort_order,
			page_size: noOfRows,
			term: props.tableParams?.request_body?.term,
			exact_match: props.tableParams?.request_body?.exact_match,
			search_columns: props.tableParams?.request_body?.search_columns,
		})
		searchData.value = response
	} catch (error) {
		console.error('Error fetching search data:', error)
	}
}

const columns = computed(() => {
	if (props.tableParams?.table_name === 'es_journal') {
		return es_journal_columns
	} else if (props.tableParams?.table_name === 'es_tcga') {
		return es_tcga_columns
	} else if (
		props.tableParams?.table_name === 'exome_somatic' ||
		props.tableParams?.table_name === 'wg_somatic'
	) {
		return main_columns
	}
})

onBeforeMount(() => {
	nextTick(async () => {
		searchData.value = props.tableData
	})
})
</script>

<style scoped></style>
