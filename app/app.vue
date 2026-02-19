<template>
  <UApp :toaster="toaster">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
<script setup lang="ts">
import type { ToasterProps } from '@nuxt/ui'
const { fetchUser } = useAuth()
const token = useCookie("auth_token")
const colorMode = useColorMode()

const toaster: ToasterProps = {
  position: 'top-right',
  duration: 3000
}

watch(
  () => token.value,
  (val) => {
    if (val) {
      fetchUser()
    }
  },
  { immediate: true }
)
onMounted(() => {
  colorMode.preference = 'light'
})
</script>
