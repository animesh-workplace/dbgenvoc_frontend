<template>
	<div class="min-h-[calc(100vh-56px)] my-12">
		<div class="px-8 pt-8">
			<!-- <Search class="mt-8" /> -->
			<div class="grid grid-cols-2 gap-6 my-8">
				<GraphOncoplot name="TCGA exome oncoplot" />
				<GraphOncoplot name="NIBMG exome somatic oncoplot" />
			</div>
			<!-- <div class="grid grid-cols-2 gap-6 my-8">
				<GraphMatrix />
			</div>
			<div class="grid grid-cols-2 gap-6 my-8">
				<GraphSomaticInteraction name="TCGA exome oncoplot" />
				<GraphSomaticInteraction name="NIBMG exome somatic oncoplot" />
			</div> -->
		</div>
	</div>
</template>

<script setup></script>

<style scoped></style>
