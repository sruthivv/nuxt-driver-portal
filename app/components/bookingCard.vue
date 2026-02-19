<template>
  <UCard
    class="w-full rounded-xl flex flex-col gap-2 shadow-lg"
  >
    <loader :visible="accepting || rejecting" />
    <div class="flex justify-between items-start">
      <div class="flex flex-row gap-4">
        <p class="text-sm font-semibold">{{ job.orderNumber }}</p>

        <div class="flex items-center gap-2 text-xs text-gray-500">
          <UIcon name="i-lucide-calendar" class="size-4" />
          <span>{{ formatFullDateTime(job.pickupDateTime) }}</span>
        </div>
      </div>

      <div class="text-right">
        <p class="font-bold text-lg">{{ job.driverEarnings }}</p>
      </div>
    </div>
    <div class="flex justify-between">
      <div>
        <UStepper :items="items" orientation="vertical" size="sm" color="neutral" :ui="{ indicator: 'bg-default', wrapper:'mt-1.5', separator: 'bg-default'}" />
      </div>
      <div class="flex gap-3 items-end">
         <UButton
            color="secondary"
            class="h-8"
            @click="goToDetails"
          >
            View
          </UButton>
        <template v-if="mode === 'assigned'">
          <UButton
            color="primary"
            class="h-8"
            :loading="accepting"
            @click="handleAction('accept')"
          >
            Accept
          </UButton>
          <UButton
            class="h-8 bg-gray-200 text-gray-700 hover:bg-default"
            :loading="rejecting"
            color="neutral"
            variant="soft"
            @click="handleAction('reject')"
          >
            Reject
          </UButton>
        </template>
        <template v-else-if="mode === 'accepted'">
          <UButton
            class="h-8 bg-gray-200 text-gray-700 hover:bg-default"
            :loading="rejecting"
            color="neutral"
            variant="soft"
            @click="handleAction('reject')"
          >
            Reject
          </UButton>
        </template>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { post } = useApiHandler()
const props = defineProps({
  job: {
    type: Object,
    required: true
  },
  mode: { 
    type: String, 
    default: "assigned" 
  } 
})
const emit = defineEmits(["updated"])
const router = useRouter();

const items = ref([
  {
    icon: 'i-lucide-circle-small',
    description: props.job.pickupLocation ,
    ui:{ icon :'text-primary size-6' , description:'text-highlighted font-semibold text-sm', title:'font-light text-gray-400'}
  },
  {
    icon: 'i-lucide-map-pin',
    description: props.job.dropOffLocation ,
    ui:{ icon :'text-secondary', description:'text-highlighted font-semibold text-sm', title:'font-light text-gray-400'} ,
  }
])

const formatFullDateTime = (dateString: string) => {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }

  const datePart = date.toLocaleDateString("en-US", options)
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  })

  return `${datePart} - ${timePart}`
} 

const accepting = ref(false)
const rejecting = ref(false)

const handleAction = async (action: "accept" | "reject") => {
  const loader = action === "accept" ? accepting : rejecting

  try {
    await post(
      "/api/job-update",
      { bookingKey: props.job.bookingKey, action },
      {
        loading: loader,
        successMessage: action === "accept" ? `${props.job.orderNumber} Job is accepted successfully` : `${props.job.orderNumber} Job is rejected successfully`,
        successTitle: action === "accept" ? "Accepted" : "Rejected"
      }
    )
    emit("updated")

  } catch (err) {}
}

const goToDetails = () => {
  router.push(`/jobs/${props.job.bookingKey}`)
}
</script>
