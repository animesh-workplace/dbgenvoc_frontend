<template>
	<header class="w-full flex flex-col gap-1 mb-4 group" :class="props.center ? 'text-center' : ''">
		<div class="flex items-center gap-2" :class="props.center ? 'justify-center' : ''">
			<Icon
				name="mingcute:ai-fill"
				class="!w-7 !h-7 text-gray-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 group-hover:text-gray-500"
			/>

			<h1
				@mouseenter="startAnimation"
				@mouseleave="resetAnimation"
				class="text-3xl font-bold text-stone-700 tracking-tight cursor-pointer overflow-hidden h-[1.2em]"
			>
				<!-- Acronym Display -->
				<span
					class="inline-block transition-all duration-800 ease-in-out"
					:class="{
						'w-0 opacity-0': showFullName,
						'w-auto opacity-100': !showFullName,
					}"
				>
					O.S.C.A.R.
				</span>

				<!-- Full Name Display -->
				<span
					class="inline-block transition-all duration-800 ease-in-out whitespace-nowrap"
					:class="{
						'w-full opacity-100': showFullName,
						'w-0 opacity-0': !showFullName,
					}"
				>
					Oral Squamous Cancer Analytics Research
				</span>
			</h1>
		</div>

		<p class="text-stone-500 text-sm italic transition-opacity duration-500">
			AI-assisted interpretation for dbGENVOC variants
		</p>
	</header>
</template>

<script setup>
let animationTimer = null
const isAnimating = ref(false)
const showFullName = ref(false)
const hasInteracted = ref(false)

const props = defineProps({
	center: { type: Boolean, default: false },
})

const startAnimation = () => {
	if (isAnimating.value) return // Prevent multiple triggers

	hasInteracted.value = true
	showFullName.value = true
	isAnimating.value = true // Clear any existing timer

	if (animationTimer) {
		clearTimeout(animationTimer)
	}
	animationTimer = setTimeout(() => {
		toggleAnimation()
	}, 5000)
}

const resetAnimation = () => {
	// Only reset if not in the middle of the 5-second animation and user hasn't clicked to toggle
	if (!isAnimating.value && (!hasInteracted.value || (hasInteracted.value && !showFullName.value))) {
		showFullName.value = false
	}
}

const toggleAnimation = () => {
	// Clear any existing timer
	if (animationTimer) {
		clearTimeout(animationTimer)
		animationTimer = null
	}
	hasInteracted.value = true
	showFullName.value = !showFullName.value
	isAnimating.value = false
}
</script>

<style scoped>
/* Smooth transitions for the text */
h1 span {
	overflow: hidden;
	display: inline-block;
	vertical-align: bottom;
} /* Optional: Add a gradient fade effect */
h1 {
	position: relative;
}
h1::after {
	left: 0;
	right: 0;
	bottom: 0;
	content: '';
	height: 2px;
	opacity: 0.3;
	position: absolute;
	transition: opacity 0.8s;
	background: linear-gradient(90deg, transparent, #a50036, transparent);
}
h1:hover::after {
	opacity: 0.6;
}
</style>
