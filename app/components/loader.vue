<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
  >
    <div class="flex flex-col items-center gap-3">
      <UButton color="neutral" size="xl" loading loading-icon="i-lucide-loader" variant="ghost"/>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
}>()
</script>
