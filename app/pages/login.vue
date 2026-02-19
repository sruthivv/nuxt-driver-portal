<template>
    <UPageCard class="w-full max-w-md px-2">
      <UAuthForm
        :schema="schema"
        :fields="fields"
        description="Log in to continue to your portal."
        @submit="handleLogin"
        :submit="{
          label: 'Log In', 
          loading: loading,
          icon: loading ? 'i-lucide-loader' : undefined
        }"
      >
        <template #title>
          <h1 class="text-2xl font-bold text-highlighted">
            Welcome Back, Driver!
          </h1>
        </template>
        <template v-if="errorMessage" #providers>
          <UAlert  color="warning" :description="errorMessage" />
        </template>
        <template #password-hint>
          <ULink to="/forgot-password" class="text-primary font-medium" tabindex="-1">Forgot password?</ULink>
        </template>
        <template #footer>
          Don't have an account? <ULink to="/register" class="text-primary font-medium">Sign up</ULink>.
        </template>
      </UAuthForm>
    </UPageCard>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
const { post } = useApiHandler()

definePageMeta({
  layout: 'auth'
})

const router = useRouter()
const loading = ref(false)
const errorMessage = ref('')

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email address',
    required: true
  },
  {
    name: 'password',
    type: 'password',
    label: 'Password',
    placeholder: 'Enter your password',
    required: true
  }
]

// schema
const schema = z.object({
  email: z.email('Email is required'),
  password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

// submit handler
async function handleLogin(payload: FormSubmitEvent<Schema>) {

  try {
    const res = await post("/api/login", {
      email: payload.data.email,
      password: payload.data.password
    }, {
      loading,
      successMessage: "You are now logged in.",
      successTitle: "Login Successful"
    })

    // Store token
    const token = useCookie("auth_token", {
      path: "/",
      maxAge: 60 * 60 * 24 // 24 hours
    })
    token.value = res.data?.token

    router.push("/")

  } catch (err: any) {
    errorMessage.value = err.message
  }
} 
</script>


