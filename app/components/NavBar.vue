<template>
	<Menubar
		:model="items"
		:pt="{
			start: '!bg-sky-200',
			rootList: '!bg-sky-200',
			itemContent: 'group',
			root: '!bg-sky-200 shadow !border-0 !justify-between !px-7',
		}"
	>
		<template #start class="bg-transparent">
			<div class="text-2xl font-extrabold">
				<span class="text-blue-900">db</span>
				<span class="text-rose-800">GEN</span>
				<span class="text-blue-900">VOC</span>
			</div>

			<button class="rounded-2xl bg-gray-800/10 py-0.5 px-2 text-xs font-medium text-gray-950 tabular-nums">
				v2
			</button>
		</template>

		<template #item="{ item, props, hasSubmenu, root }">
			<a v-ripple class="flex items-center" v-bind="props.action">
				<div class="flex items-center" :class="{ 'gap-2': item.label }">
					<Icon :name="item.icon" class="!w-5 !h-5 group-hover:text-blue-800" />
					<span class="text-gray-800"> {{ item.label }} </span>
				</div>
			</a>
		</template>
	</Menubar>
</template>

<script setup>
import { ref } from 'vue'

const items = ref([
	{ label: 'Home', icon: 'solar:home-2-bold-duotone' },
	{ label: 'Help', icon: 'solar:question-square-bold-duotone' },
	{ label: 'Contact us', icon: 'solar:user-speak-bold-duotone' },
	{ label: '', icon: 'solar:sun-2-bold-duotone' },
])
</script>
