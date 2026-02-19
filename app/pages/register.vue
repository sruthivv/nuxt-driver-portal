<template>
  <div class="min-h-screen">
    <UPageCard class="w-full max-w-2xl px-2">
      <h1 class="text-2xl font-bold text-center text-highlighted">Create Your Driver Account</h1>
      <p class="text-center"> Get on the road in minutes.</p>
      <UForm :schema="schema" :state="form"  @submit="handleSubmit" class="grid grid-cols-1 w-full gap-4">
        <UFormField label="First Name" name="firstname">
          <UInput v-model="form.firstname" class="w-full" placeholder="Enter your first name" />
        </UFormField>
        <UFormField label="Last Name" name="lastname">
          <UInput v-model="form.lastname" class="w-full" placeholder="Enter your last name" />
        </UFormField>
        <UFormField label="Email" :error="error || false" class="col-span-1 sm:col-span-2" name="email">
          <UInput v-model="form.email" type="email" class="w-full" placeholder="Enter your email address" />
        </UFormField>
        <UFormField label="Contact Number" class="col-span-1 sm:col-span-2" name="phone">
          <UInput
            v-model="form.phone"
            class="w-full"
            placeholder="Enter your contact number"
            type="text"
            @input="validatePhone"
          />
        </UFormField>
        <UFormField label="Password" class="col-span-1 sm:col-span-2" name="password">
          <UInput
            v-model="form.password"
            class="w-full"
            placeholder="Create a strong password"
            :type="showPassword ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                @click="showPassword = !showPassword"
              />
            </template>
          </UInput>
        </UFormField>
        <UFormField label="Confirm Password" class="col-span-1 sm:col-span-2" name="confirmPassword">
          <UInput
            v-model="form.confirmPassword"
            class="w-full"
            placeholder="Re-enter your password"
            :type="showConfirmPassword ? 'text' : 'password'"
            :ui="{ trailing: 'pe-1' }"
          >
            <template #trailing>
              <UButton
                color="neutral"
                variant="link"
                size="sm"
                :icon="showConfirmPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                @click="showConfirmPassword = !showConfirmPassword"
              />
            </template>
          </UInput>
        </UFormField>
        <div class="col-span-1 w-full justify-center text-center sm:col-span-2 gap-4 mt-4">
          <UButton :loading="loading" loading-auto color="primary" type="submit" class="w-full justify-center col-span-1">Create Account</UButton>
          <p class="p-4 text-sm">
            Already have an account? <ULink to="/login" class="text-primary font-medium">Log In</ULink>
          </p>
        </div>
      </UForm>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from "@nuxt/ui"
const { post } = useApiHandler()

definePageMeta({
  layout: 'auth'
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const router = useRouter()
const loading = ref(false)
const error = ref('')
// form fields
const form = reactive({
  firstname: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})
// schema
const schema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Contact number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password")
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
})

type Schema = z.output<typeof schema>

// Ensure only numbers in phone field
const validatePhone = (e: Event) => {
  const target = e.target as HTMLInputElement
  target.value = target.value.replace(/[^0-9]/g, '')
  form.phone = target.value
}

// Clear form
const clearForm = () => {
  form.firstname = ''
  form.lastname = ''
  form.email = ''
  form.phone = ''
  form.password = ''
  form.confirmPassword = ''
}

// handle submit
const handleSubmit = async (payload: FormSubmitEvent<Schema>) => {
  
  try {
    await post("/api/register",
      {
        firstName: payload.data.firstname,
        lastName: payload.data.lastname,
        email: payload.data.email,
        contact: payload.data.phone,
        password: payload.data.password,
        passwordConfirmation: payload.data.confirmPassword
      },
      {
        loading,
        successMessage: "Your account has been created successfully.",
        successTitle: "Registration Completed",
        errorTitle: "Registration Failed"
      }
    )

    router.push("/login")
    clearForm()

  } catch (err: any) {
    error.value = err.message
  } 
}
</script>

<style scoped>
::-ms-reveal {
  display: none;
}
</style>
