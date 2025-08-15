<template>
	<div class="">
		<div class="grid grid-cols-2 items-center gap-6 relative p-8 w-full h-full md:h-auto">
			<div class="relative p-4 bg-gray-200 rounded-lg shadow sm:p-5">
				<!-- Header -->
				<div
					class="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600"
				>
					<h3 class="text-2xl font-semibold text-gray-900">Feedback for dbGENVOC</h3>
				</div>

				<!-- Body -->
				<div class="grid gap-4 mb-4 sm:grid-cols-2">
					<div class="flex flex-col gap-2">
						<label for="person_name">Name</label>
						<InputText id="person_name" v-model="feedbackForm.name" />
					</div>

					<div class="flex flex-col gap-2">
						<label for="email">Email</label>
						<InputText id="email" v-model="feedbackForm.name" />
					</div>

					<div class="flex flex-col gap-2 col-span-2">
						<label for="suggestion">Suggestion to improve dbGENVOC</label>
						<Textarea
							rows="5"
							cols="30"
							id="suggestion"
							v-model="feedbackForm.message"
							placeholder="Write a description..."
						/>
					</div>
				</div>

				<div class="flex items-center justify-center space-x-4">Add button here</div>
			</div>

			<div>
				<section class="max-w-6xl mx-auto p-8 bg-white rounded-2xl shadow-md">
					<!-- Header -->
					<h2 class="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Contact Details</h2>

					<div class="grid lg:grid-cols-2 gap-4">
						<!-- Left: Contact Info -->
						<div class="space-y-6">
							<!-- Address -->
							<div class="flex items-start gap-3">
								<div
									class="p-2 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"
								>
									<Icon name="solar:map-point-wave-line-duotone" class="!w-5 !h-5" />
								</div>
								<div>
									<h3 class="font-medium text-gray-700">Address</h3>
									<p class="text-gray-600 text-sm mt-1 leading-relaxed">
										NATIONAL INSTITUTE OF BIOMEDICAL GENOMICS<br />
										P.O.: N.S.S., Kalyani 741251,<br />
										West Bengal, INDIA
									</p>
								</div>
							</div>

							<!-- Maintained By -->
							<div class="flex items-start gap-3">
								<div
									class="p-2 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"
								>
									<Icon name="solar:chat-square-code-line-duotone" class="!w-5 !h-5" />
								</div>
								<div>
									<h3 class="font-medium text-gray-700">Maintained By</h3>
									<a
										href="mailto:aks1@nibmg.ac.in"
										class="text-sm text-blue-600 hover:underline mt-1 block"
									>
										aks1@nibmg.ac.in
									</a>
								</div>
							</div>

							<!-- Correspondence -->
							<div class="flex items-start gap-3">
								<div
									class="p-2 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center"
								>
									<Icon name="solar:user-id-line-duotone" class="!w-5 !h-5" />
								</div>
								<div>
									<h3 class="font-medium text-gray-700">Correspondence</h3>
									<a
										href="mailto:nkb1@nibmg.ac.in"
										class="text-sm text-blue-600 hover:underline mt-1 block"
									>
										nkb1@nibmg.ac.in
									</a>
								</div>
							</div>
						</div>

						<!-- Right: Google Map -->
						<div class="w-full h-72 lg:h-auto rounded-xl overflow-hidden shadow">
							<!-- <iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29453.229865285528!2d88.4224111!3d22.9867626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89ffac5acb2c1%3A0x4ec3a28b25e5cba!2sNational%20Institute%20of%20Biomedical%20Genomics!5e0!3m2!1sen!2sin!4v1703414900000!5m2!1sen!2sin"
								width="100%"
								height="100%"
								style="border: 0"
								allowfullscreen=""
								loading="lazy"
								referrerpolicy="no-referrer-when-downgrade"
							>
							</iframe> -->

							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3673.768054131925!2d88.46695697531192!3d22.958767779218476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f894d7f658c159%3A0x61af6c6f006c3301!2sNational%20Institute%20of%20Biomedical%20Genomics!5e0!3m2!1sen!2sin!4v1755195451110!5m2!1sen!2sin"
								width="100%"
								height="100%"
								style="border: 0"
								allowfullscreen=""
								loading="lazy"
								referrerpolicy="no-referrer-when-downgrade"
							></iframe>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script setup>
const feedbackForm = ref({
	name: '',
	email: '',
	message: '',
})
</script>

<style scoped></style>
