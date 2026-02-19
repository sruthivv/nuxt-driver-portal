<template>
  <div class="w-full space-y-6 px-6">
    <loader :visible="loading" />
    <div v-if="jobs.length === 0">
      <p class="text-center py-8 text-gray-500">No completed jobs found</p>
    </div>
    <div v-else class="space-y-3">
      <booking-card
        v-for="job in jobs"
        :key="job.bookingKey"
        :job="job"
        mode="completed"
      />
    </div>
    <div class="mt-4" >
      <template v-if="pagination && pagination.total > 5">
        <UPagination
          v-if="pagination.total > pagination.per_page"
          v-model:page="pagination.current_page"
          :items-per-page="pagination.per_page"
          :total="pagination.total"
          :sibling-count="1"
          active-color="neutral"
          :ui="{ list: 'justify-center' }"
        />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
const { get } = useApiHandler()
definePageMeta({ layout: "dashboard" })

const loading = ref(false)
const jobs = ref<any[]>([])
const pagination = reactive({
  current_page: 1,
  per_page: 10,
  total: 0
})

const loadCompletedJobs = async () => {
  try {
    const res = await get(
      `/api/jobs?type=completed&page=${pagination.current_page}`,
      { loading }
    )

    jobs.value = Array.isArray(res.data?.jobs)
      ? res.data.jobs
      : []

    if (res.data?.meta) {
      pagination.total = res.data.meta.total
      pagination.per_page = res.data.meta.per_page
      pagination.current_page = res.data.meta.current_page
    }
  } catch (err) {
    console.error("Error loading completed jobs:", err)
  }
}

watch(
  () => pagination.current_page,
  () => {
    loadCompletedJobs()
  }
)

onMounted(loadCompletedJobs)
</script>
