<template>
  <!-- Page background -->
  <div class="min-h-screen bg-gray-50 flex justify-center px-12 py-12 rounded-md shadow-md">
    <!-- Center container -->
    <div v-if="!loading && job" class="w-full max-w-5xl">
      <!-- White Card -->
      <UCard class="rounded-xl shadow-sm p-8">
        <!-- Header -->
        <div class="flex justify-between items-start mb-8">
          <div>
            <h1 class="text-2xl font-semibold">Booking Details</h1>
            <p class="text-sm text-gray-500">
              Booking ID:
              <span class="font-medium text-gray-700">{{ job.orderNumber}}</span>
            </p>
          </div>

          <UBadge color="primary" variant="soft" size="xl" class="rounded-full">
            Assigned
          </UBadge>
        </div>

        <!-- Content -->
        <div class="grid md:grid-cols-2 gap-10">
          <!-- LEFT COLUMN -->
          <div class="space-y-6">
            <!-- <UStepper
              :items="items"
              orientation="vertical"
              size="sm"
              color="neutral"
              :ui="{ indicator: 'bg-default', wrapper:'mt-1.5'}"
            /> -->
            <!-- Pickup -->
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <span class="w-3 h-3 rounded-full bg-green-500"></span>
                <span class="flex-1 w-px bg-gray-300"></span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Pickup</p>
                <p class="font-medium text-gray-800">{{ job.address.pickUp.pickUpPlace }}</p>
                <p class="text-xs text-gray-400">{{ formatFullDateTime(job.pickupDateTime) }}</p>
              </div>
            </div>

            <!-- Drop -->
            <div class="flex gap-4">
              <div class="flex flex-col items-center">
                <span class="w-3 h-3 rounded-full bg-red-500"></span>
              </div>
              <div>
                <p class="text-sm text-gray-500">Drop Off</p>
                <p class="font-medium text-gray-800">{{ job.address.dropOff.dropOffPlace }}</p>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <h3 class="font-semibold mb-1">Driver Notes</h3>
              <p class="text-sm text-gray-600">
                {{ job.driverNotes || 'No notes provided.' }}
              </p>
            </div>
          </div>

          <!-- RIGHT COLUMN -->
          <div class="space-y-6">
            <!-- Passenger -->
            <div>
              <h3 class="font-semibold mb-2">Passenger</h3>
              <p class="text-gray-800">{{ job.passengerName }}</p>
              <p class="text-sm text-gray-500">{{ job.passengerContact }}</p>
              <p class="text-sm text-gray-600">
                {{ job.passengerNotes || '' }}
              </p>
            </div>

            <!-- Vehicle -->
            <div>
              <h3 class="font-semibold mb-2">Vehicle</h3>
              <p class="text-gray-800">{{ job.vehicleName }}</p>
              <p class="text-sm text-gray-500">1 Passenger</p>
            </div>

            <!-- Earnings -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-5">
              <p class="text-sm text-green-700">Your Earnings</p>
              <div class="flex items-center justify-between mt-2">
                <p class="text-3xl font-bold text-green-800">
                  {{ job.driverEarnings }}
                </p>
                <UBadge color="success">
                  Cash
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
    <div v-else class="text-center text-gray-500">
      Loading job details...
    </div>
  </div>
</template>
<script setup lang="ts">
const { get } = useApiHandler()

const route = useRoute()
const job = ref<any>(null)
const loading = ref(false)

const loadJob = async () => {
  const res = await get(`/api/job-view/${route.params.id}`, { loading })
  job.value = res.data?.[0] || null
}

// const items = ref([
//   {
//     icon: 'i-lucide-circle-small',
//     title: job.value?.dropOffLocation,
//     description: job.value?.address.pickUp.pickUpPlace,
//     ui: { icon: 'text-primary size-6', description: 'text-highlighted font-semibold text-sm' }
//   },
//   {
//     icon: 'i-lucide-map-pin',
//     title: job.value?.pickupLocation,
//     description: job.value?.address.dropOff.dropOffPlace,
//     ui: { icon: 'text-secondary', description: 'text-highlighted font-semibold text-sm' }
//   }
// ])

const formatFullDateTime = (dateString: string) => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }
  const datePart = date.toLocaleDateString("en-US", options)
  const timePart = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  return `${datePart} - ${timePart}`
}

onMounted(async () => {
  await loadJob()
})
</script>