<template>
  <loader :visible="loading" />
  <UHeader title="Cabmatics" to="/" :toggle="false">
    <template #left>
      <USlideover class="md:hidden" title="Cabmatics" side="left" 
      :ui="{ title:'shrink-0 font-bold text-xl text-highlighted flex items-end gap-1.5' }"
      >
        <UButton icon="i-lucide-menu" color="neutral" variant="ghost" />
        <template #body>
          <UNavigationMenu 
            :items="navigationItems" 
            orientation="vertical" 
            color="neutral"
            variant="pill" />
        </template>
      </USlideover>
      <NuxtLink to="/">
        <h1 class="shrink-0 font-bold text-xl text-highlighted flex items-end gap-1.5">Cabmatics</h1>
      </NuxtLink>
    </template>
    <template #right>
      <UColorModeButton />
      <UDropdownMenu
        :items="items"
        :ui="{
          content: 'w-48'
        }"
      >
        <UAvatar :alt="username" size="lg" />
      </UDropdownMenu>
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'
const { user } = useAuth()
const { post } = useApiHandler()
const emit = defineEmits(["toggleSidebar"])

type User = {
  firstName: string
  lastName: string
}
const typedUser = computed<User | null>(() => user.value as User | null)

const username = computed(() => {
  const first = typedUser.value?.firstName ?? ''
  const last = typedUser.value?.lastName ?? ''
  return `${first} ${last}`.trim()
})
const loading = ref(false)
const router = useRouter()

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
      to:"/profile"
    },
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      onSelect: () => logout()
    }
  ]
])
const navigationItems = ref<NavigationMenuItem[][]>([
  [
    {
      label: 'Home',
      icon: 'i-lucide-home',
      to: '/',
    },
    {
      label: 'Profile',
      icon: 'i-lucide-users',
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
      label: 'LogOut',
      icon: 'i-lucide-user',
      to: '/login',
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




