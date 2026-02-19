<template>
  <aside
    class="sticky hidden md:block left-0 top-16 w-64 border-r border-gray-50 dark:border-gray-800 p-4 z-50 h-[calc(100vh-64px)]"
  >
    <UNavigationMenu
      orientation="vertical"
      :items="items"
      color="neutral"
      variant="pill"
    />
  </aside>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
const { post } = useApiHandler()

const router = useRouter()
const loading = ref(false)

const emit = defineEmits(["close"])

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Home',
      icon: 'i-lucide-home',
      to: '/',
    },
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to: '/Profile',
    },
    {
      label: 'Vehicle',
      icon: 'i-lucide-car',
      to: '/Vehicle',
    },
    {
      label: 'Rides History',
      icon: 'i-lucide-history',
      to: '/ridesHistory',
    },
    {
      label: 'Statements',
      icon: 'i-lucide-clipboard-list',
      to: '/Statements',
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: () => logout()
    }
  ]
])

// Logout function
const logout = async () => {
  await post('/api/logout', {}, {
    loading,
    successTitle: "Logout",
    successMessage: "You have been logged out successfully.",
    errorTitle: "Logout Failed"
  })

  const token = useCookie("auth_token")
  token.value = null

  router.push('/login')
}
</script>


