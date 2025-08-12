<template>
	<Menubar
		:model="items"
		:pt="{
			start: '!bg-sky-200',
			itemContent: 'group',
			rootList: '!bg-sky-200',
			root: '!bg-sky-200 shadow !border-0 !justify-between !px-7 !py-4 !sticky top-0 z-50',
		}"
	>
		<template #start>
			<div class="flex items-center hover:scale-105 transition-transform duration-500 ease-in-out">
				<div class="text-2xl font-extrabold cursor-pointer">
					<span class="text-blue-900">db</span>
					<span class="text-rose-800">GEN</span>
					<span class="text-blue-900">VOC</span>
				</div>

				<button
					class="rounded-2xl bg-gray-800/10 py-0.5 px-2 text-xs font-semibold text-blue-950 cursor-pointer"
				>
					v2
				</button>
			</div>
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
