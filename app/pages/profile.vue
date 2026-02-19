<template>
<UDashboardPanel>
    <div>
      <h1 class="text-xl font-bold mb-2">Profile</h1>
      <p class="text-gray-600 mb-8">
        Here you can check your driver profile details and modify some if they are outdated.
      </p>
      <UForm disabled class="grid lg:grid-cols-2 grid-cols-1 gap-4">
        <UFormField label="First name" name="firstname" help="To update, please contact our support team via the app">
          <UInput icon="i-lucide-lock" class="w-full" :value="typedUser?.firstName" />
        </UFormField>
        <UFormField label="Last name" name="lastname" help="To update, please contact our support team via the app">
          <UInput icon="i-lucide-lock" class="w-full" :value="typedUser?.lastName"  />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput type="email" class="w-full" :value="typedUser?.email"  />
        </UFormField>
        <UFormField label="Phone" name="phone" help="phone number will be cleared, spaces, brackets and dashes will be removed">
          <UInput
            class="w-full"
            :value="typedUser?.contact" 
          />
        </UFormField>
        <UFormField label="Display name" name="fullname" help="To update, please contact our support team via the app">
          <UInput icon="i-lucide-lock" class="w-full" :value="`${typedUser?.firstName ?? ''} ${typedUser?.lastName ?? ''}`.trim()"  />
        </UFormField>
      </UForm>
      <h1 class="text-xl font-bold mb-2 mt-8">Driver documents</h1>
      <p class="text-gray-600 mb-8">
        Driver and taxi licence details, Keep an eye on expiration dates.
      </p>
    </div>
</UDashboardPanel>
</template>
<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

type User = {
  firstName: string
  lastName: string
  email: string
  contact: number
}

const { user } = useAuth()

const typedUser = computed(() => user.value as User | null)

</script>

