<template>
	<div class="bg-gradient-to-br from-blue-500/10 to-green-500/10 min-h-[calc(100vh-56px)]">
		<section class="relative overflow-hidden">
			<!-- Header Section -->
			<div class="text-center px-8 py-12 bg-gradient-to-br from-blue-500/10 to-green-500/10">
				<h1 class="text-3xl font-bold text-blue-800">dbGENVOC Help Center</h1>
				<p class="text-gray-500">
					Your comprehensive guide to using the Genomic Variants of Oral Cancer Database
				</p>
			</div>

			<!-- Navigation Tabs -->
			<div>
				<Tabs v-model:value="selectedTab">
					<TabList
						:pt="{ tablist: 'justify-center text-center px-8', activeBar: 'border-blue-800 border-2' }"
					>
						<Tab
							:key="index"
							:value="tab.value"
							v-for="(tab, index) in tabs"
							class="flex items-center gap-2"
							:class="{
								'!text-blue-800': tab.value === selectedTab,
								'!text-gray-500': tab.value !== selectedTab,
							}"
						>
							<Icon :name="tab.icon" class="!w-5 !h-5" />
							<span>
								{{ tab.title }}
							</span>
						</Tab>
					</TabList>

					<TabPanels
						class="text-center !bg-gradient-to-br from-blue-500/10 to-green-500/10 !pt-12 min-h-full"
					>
						<TabPanel value="0">
							<div>
								<p class="p-4" align="justify">
									dbGENVOC is a comprehensive and flexible database framework developed to enable
									users to access, query, browse, and download somatic variation data from Indian
									oral cancer patients. It stores variant calls generated through massively
									parallel sequencing across multiple studies. The first release of dbGENVOC
									includes around 24 million somatic variants from whole exome sequences of 100
									Indian oral cancer patients and whole genome sequences of 5 patients from
									India, along with somatic variation data from 220 patient samples analyzed by
									the TCGA-HNSCC project in the USA, and manually curated variation data from 118
									patients reported in recently published peer-reviewed studies.
								</p>

								<div class="grid grid-cols-3 my-8 items-center">
									<!-- Laptop Mockup -->
									<div>
										<div
											class="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]"
										>
											<div
												class="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800"
											>
												<img
													src="https://flowbite.s3.amazonaws.com/docs/device-mockups/laptop-screen-dark.png"
													class="hidden dark:block h-[156px] md:h-[278px] w-full rounded-lg"
													alt=""
												/>
											</div>
										</div>
										<div
											class="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[597px]"
										>
											<div
												class="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"
											></div>
										</div>
									</div>

									<!-- Tab Mockup -->
									<div>
										<div
											class="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] max-w-[341px]"
										>
											<div
												class="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"
											></div>
											<div
												class="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"
											></div>
											<div
												class="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"
											></div>
											<div
												class="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"
											></div>
											<div
												class="rounded-[2rem] overflow-hidden h-[426px] bg-white dark:bg-gray-800"
											>
												<img
													src="https://flowbite.s3.amazonaws.com/docs/device-mockups/tablet-mockup-image.png"
													class="dark:hidden h-[426px]"
													alt=""
												/>
												<img
													src="https://flowbite.s3.amazonaws.com/docs/device-mockups/tablet-mockup-image-dark.png"
													class="hidden dark:block h-[426px]"
													alt=""
												/>
											</div>
										</div>
									</div>

									<!-- Mobile Mockup -->
									<div>
										<div
											class="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] w-[300px] shadow-xl"
										>
											<div
												class="w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute"
											></div>
											<div
												class="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"
											></div>
											<div
												class="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"
											></div>
											<div
												class="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"
											></div>
											<div
												class="rounded-[2rem] overflow-hidden w-[272px] bg-white dark:bg-gray-800"
											>
												<img
													src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/mockup-2-light.png"
													class="dark:hidden w-[272px]"
													alt=""
												/>
												<img
													src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/mockup-2-dark.png"
													class="hidden dark:block w-[272px]"
													alt=""
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabPanel>

						<TabPanel value="1">
							<div class="px-4 py-8">
								<div
									id="alert"
									class="flex items-center p-4 mb-4 text-blue-800 rounded-lg bg-blue-100"
								>
									<Icon name="solar:danger-circle-bold-duotone" class="!w-5 !h-5" />
									<span class="sr-only">Info</span>
									<div class="ms-3 text-sm font-medium">
										Use the live search box on the home page to quickly find variants by
										entering gene names, genomic regions, or patient IDs. Auto-complete and
										spell-checking are enabled!
									</div>
								</div>

								<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
									<div
										:key="index"
										v-for="(guide, index) in searchGuide"
										class="bg-white p-4 rounded-2xl shadow-sm relative overflow-hidden"
									>
										<Icon
											name="solar:bacteria-line-duotone"
											class="absolute !w-36 !h-36 opacity-30 -top-14 -right-8 rotate-45"
										/>
										<h3 class="text-lg font-semibold mb-2">{{ guide.title }}</h3>
										<p>{{ guide.description }}</p>
										<p class="text-sm text-gray-500">
											<strong>Example: </strong>{{ guide.example }}
										</p>
									</div>
								</div>
							</div>
						</TabPanel>

						<TabPanel value="2">
							<div class="px-4 py-4">
								<Divider
									align="center"
									:pt="{ root: '!border-red-500', content: '!bg-transparent' }"
								>
									<span class="font-semibold text-2xl">Result Page Overview</span>
								</Divider>

								<p class="mb-8">
									The results page is organized into three main panels for easy data exploration:
								</p>

								<div class="grid grid-cols-3 gap-6 mb-12">
									<div
										:key="index"
										v-for="(panel, index) in resultsOverview"
										class="relative overflow-hidden bg-gray-100 rounded-2xl shadow"
									>
										<Icon
											name="solar:chart-bold-duotone"
											class="absolute !w-36 !h-36 opacity-30 -bottom-8 -left-8 rotate-45"
										/>
										<div class="px-4 py-5 sm:p-6">
											<dl>
												<dd class="mt-1 text-3xl font-semibold leading-9 text-gray-900">
													{{ panel.title }}
												</dd>
												<dd class="font-semibold text-gray-500">
													<span> {{ panel.description }} </span>
												</dd>
											</dl>
										</div>
									</div>
								</div>

								<Divider
									align="center"
									:pt="{ root: '!border-red-500', content: '!bg-transparent' }"
								>
									<span class="font-semibold text-2xl">Filtering & Tools</span>
								</Divider>

								<div class="grid grid-cols-4 gap-6 mb-12">
									<div
										:key="index"
										v-for="(panel, index) in filteringTools"
										class="relative p-4 bg-slate-100 shadow-lg rounded-2xl"
									>
										<div class="w-full h-full text-center">
											<Icon :name="panel.icon" class="!w-20 !h-20" />
											<p class="mt-4 text-lg text-gray-800">{{ panel.title }}</p>
											<p class="px-6 py-2 text-xs text-gray-500">
												{{ panel.description }}
											</p>
										</div>
									</div>
								</div>

								<Divider
									align="center"
									:pt="{ root: '!border-red-500', content: '!bg-transparent' }"
								>
									<span class="font-semibold text-2xl">Pro Tips</span>
								</Divider>

								<div class="grid grid-cols-3 gap-4">
									<div
										id="alert"
										class="flex items-center p-4 mb-4 text-rose-800 rounded-lg bg-rose-100"
									>
										<Icon name="solar:danger-circle-bold-duotone" class="!w-5 !h-5" />
										<span class="sr-only">Info</span>
										<div class="ms-3 text-sm font-medium">
											Use the button to switch between Exome and Whole Genome data views
										</div>
									</div>

									<div
										id="alert"
										class="flex items-center p-4 mb-4 text-rose-800 rounded-lg bg-rose-100"
									>
										<Icon name="solar:danger-circle-bold-duotone" class="!w-5 !h-5" />
										<span class="sr-only">Info</span>
										<div class="ms-3 text-sm font-medium">
											Combine multiple filters to narrow down results to exactly what you
											need
										</div>
									</div>

									<div
										id="alert"
										class="flex items-center p-4 mb-4 text-rose-800 rounded-lg bg-rose-100"
									>
										<Icon name="solar:danger-circle-bold-duotone" class="!w-5 !h-5" />
										<span class="sr-only">Info</span>
										<div class="ms-3 text-sm font-medium">
											Always download your results for offline analysis and record keeping
										</div>
									</div>
								</div>
							</div>
						</TabPanel>
					</TabPanels>
				</Tabs>
			</div>
		</section>
	</div>
</template>

<script setup>
const selectedTab = ref('0')

const tabs = ref([
	{ title: 'About', icon: 'solar:chat-square-bold-duotone', value: '0' },
	{
		title: 'Search Guide',
		icon: 'solar:minimalistic-magnifer-bold-duotone',
		value: '1',
	},
	{ title: 'Results & Filtering', icon: 'solar:filter-bold-duotone', value: '2' },
])

const searchGuide = ref([
	{
		title: 'Gene Search',
		description: 'Search by gene symbol, alias, or name',
		example: 'BRCA2, TP53',
	},
	{
		title: 'Genomic Region',
		description: 'Search specific chromosomal regions',
		example: 'chr1:915188-1015188',
	},
	{
		title: 'Multi-Gene',
		description: 'Search multiple genes simultaneously',
		example: 'TP53, BRCA2, NOTCH1',
	},
	{
		title: 'Multi-Sites',
		description: 'Search multiple specific genomic positions',
		example: 'chr11:534289, chr17:7578406',
	},
	{
		title: 'Patient ID',
		description: 'Search by specific patient identifier',
		example: 'NIBMG-F316-GB, OT54',
	},
	{
		title: 'Pathway Search',
		description: 'Search by biological pathways',
		example: 'Glycolysis Gluceoneogenesis Pathway, Wnt Signaling Pathway',
	},
])

const filteringTools = ref([
	{
		icon: 'solar:eye-bold-duotone',
		title: 'View Options',
		description: 'Adjust the number of rows displayed using the dropdown menu',
	},
	{
		icon: 'solar:rounded-magnifer-bold-duotone',
		title: 'Search Within Results',
		description: 'Use the search box above data tables to filter current results',
	},
	{
		icon: 'solar:sort-bold-duotone',
		title: 'Sorting',
		description: 'Click on any column header to sort data ascending or descending',
	},
	{
		icon: 'solar:bill-list-bold-duotone',
		title: 'Show/Hide Columns',
		description: 'Customize your view by showing or hiding specific data columns',
	},
	{
		icon: 'solar:file-download-bold-duotone',
		title: 'Download Results',
		description: 'Export your search results in Excel format for further analysis',
	},
])

const resultsOverview = ref([
	{ title: 'dbGENVOC Data', description: 'Detailed variant information from our database' },
	{ title: 'TCGA Data', description: 'Corresponding variants from TCGA oral cancer data' },
	{ title: 'Literature Data', description: 'Curated variations from peer-reviewed publications' },
])
</script>

<style scoped></style>
