<template>
  <div class="flex flex-col w-full space-y-6 px-6">
    <UTabs
      v-model="activeTab"
      :items="tabs"
      :unmount-on-hide="false"
      class="w-full"
      color="secondary"
      :ui="{ indicator:'rounded-full' , list:'bg-default sticky top-16 z-10'}"
    >
      <template #content="{ item }">
        <div class="flex flex-col h-full">
          <loader :visible="loading" />
          <div class="flex-1 overflow-y-auto space-y-3 py-2">
            <div v-if="jobs[item.key as JobType].length === 0">
              <p class="text-center py-8 text-gray-500">No jobs found</p>
            </div>
            <div v-else class="space-y-3 m-2">
              <booking-card
                v-for="job in jobs[item.key as JobType]"
                :key="job.bookingKey"
                :job="job"
                :mode="item.key"
                @updated="handleJobUpdated "
              />
            </div>
          </div>
          <div class="mt-4" >
            <template v-if="pagination && pagination[activeTab].total > 5">
              <UPagination
                v-if="pagination[activeTab]"
                v-model:page="pagination[activeTab].current_page"
                :items-per-page="pagination[activeTab].per_page"
                :total="pagination[activeTab].total"
                :sibling-count="1"
                active-color="neutral"
                :ui="{ list: 'justify-center' }"
              />
            </template>
          </div>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
const { get } = useApiHandler()
definePageMeta({ layout: 'dashboard' })

const tabKeys = ["assigned", "accepted"] as const
type JobType = typeof tabKeys[number]

const pagination = reactive<Record<JobType, any>>({
  assigned: { current_page: 1 },
  accepted: { current_page: 1 }
})

const activeTab = ref<JobType>("assigned")
const loading = ref(false)

const jobs = reactive<Record<JobType, any[]>>({
  assigned: [],
  accepted: []
})

const tabs = computed(() => [
  { label: `Assigned (${pagination.assigned?.total ?? 0})`, key: "assigned", value: "assigned" },
  { label: `Accepted (${pagination.accepted?.total ?? 0})`, key: "accepted", value: "accepted" },
])

const loadJobsByType = async (type: JobType) => {
  const page = pagination[type]?.current_page ?? 1

  const res = await get(
    `/api/jobs?type=${type}&page=${page}`,
    { loading }
  )

  jobs[type] = Array.isArray(res.data?.jobs) ? res.data.jobs : []

  pagination[type] = {
    ...res.data?.meta,
    current_page: page
  }
}

const loadAllJobs = async () => {
  await Promise.all([
    loadJobsByType("assigned"),
    loadJobsByType("accepted")
  ])
}

const handleJobUpdated = async () => {
  loading.value = true
  await loadAllJobs()
  loading.value = false
}

watch(
  () => pagination[activeTab.value].current_page,
  (page, oldPage) => {
    if (page !== oldPage) {
      loadJobsByType(activeTab.value)
    }
  }
)

watch(activeTab, () => {
  loadJobsByType(activeTab.value)
})

onMounted(() => {
  loadAllJobs()
})
</script>
