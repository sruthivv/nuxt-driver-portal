<template>
  <dashboard-header @toggleSidebar="mobileOpen = true"  />
  <div class="w-full max-w-(--ui-container) mx-auto px-2 flex justify-center">
    <div class="w-full max-w-[1400px] flex min-h-screen bg-default">
      <sidebar />
      <UMain class="flex-1 md:ml-4 p-6 md:p-10 lg:p-4 max-w-5xl mx-auto w-full">
        <slot />
      </UMain>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const mobileOpen = ref(false)
</script>
