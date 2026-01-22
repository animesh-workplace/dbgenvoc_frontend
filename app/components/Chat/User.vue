<template>
	<div class="flex gap-4 justify-end md:pl-12">
		<div class="bg-white border-2 border-stone-200 px-4 py-2 rounded-2xl rounded-tr-sm shadow-xs max-w-xl">
			<p class="text-stone-700 font-medium text-[15px] leading-relaxed !m-0">
				{{ props.message.content }}
			</p>
		</div>
		<div
			class="hidden w-10 h-10 rounded-full bg-stone-300 md:flex items-center justify-center shrink-0 border-2 border-white shadow-sm"
		>
			<Icon name="tabler:user-filled" class="!w-5 !h-5 !text-stone-600" />
		</div>
	</div>
</template>

<script setup>
const props = defineProps({
	message: { type: Object, required: true, default: { title: '', content: '', isWidget: false } },
})
</script>

<style scoped></style>
