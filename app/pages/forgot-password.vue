<template>
  <UPageCard class="w-full max-w-md">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold text-center text-highlighted">
        Forgot Your Password?
      </h1>
      <p class="text-center text-gray-500 -mt-2">
        No worries, we'll send you reset instructions.
      </p>
      <UForm :schema="emailSchema" :state="{ email }" @submit="sendOtp" class="grid grid-cols-3 w-full gap-4">
        <UFormField label="Enter Your Email" :error="emailValidate || false" name="email" class="w-full col-span-2">
          <UInput v-model="email" type="email" class="w-full" placeholder="you@example.com" />
        </UFormField>
        <UButton color="primary" :loading="loadingOtp" type="submit" loading-auto size="md" class="mt-5 text-sm lg:text-xs w-full h-9 justify-center text-center mb-0">
          Request OTP
        </UButton>
      </UForm>
      <UForm :schema="otpSchema" :state="{ otp }">
        <UFormField label="Enter OTP" name="otp" :error="otpValidate || false" class="col-span-1">
          <UInput v-model="otp" maxlength="6" class="w-full" placeholder="Enter the 6-digit code" />
        </UFormField>
      </UForm>
      <USeparator class="col-span-1 my-4" />
      <UForm :schema="passwordSchema" :state="passwordForm" @submit="resetPassword" class="grid grid-cols-1 w-full gap-4">
        <UFormField label="New Password" name="password" class="col-span-1">
        <UInput
            v-model="passwordForm.password"
            class="w-full"
            placeholder="Enter new password"
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
      <UFormField label="Confirm New Password" name="confirmPassword" class="col-span-1">
        <UInput
          v-model="passwordForm.confirmPassword"
          class="w-full"
          placeholder="Re-enter your new password"
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
      <div class="text-center text-sm mt-2">
        <UButton block color="primary" type="submit" :loading="loading" loading-auto class="mt-2" :disabled="otp.length !== 6">
            Update Password
        </UButton>
      </div>
      </UForm>
      <div class="text-center text-sm">
        <p class="mt-2">
          <ULink to="/login" class="text-primary font-medium mt-2">Back to Log In</ULink>
        </p>
      </div>
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
import * as z from 'zod'
const { post } = useApiHandler()

definePageMeta({
  layout: 'auth'
})

const toast = useToast()
const router = useRouter()

// Fields
const loading = ref(false)
const loadingOtp = ref(false)
const email = ref('')
const otp = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const emailValidate = ref('')
const otpValidate = ref('')

// Email Form
const emailSchema = z.object({
  email: z.string().email("Enter a valid email")
})
type EmailSchema = z.infer<typeof emailSchema>

// OTP Form
const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers")
})
type OtpSchema = z.infer<typeof otpSchema>

// Reset Password Form
const passwordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters")
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  })
type PasswordSchema = z.infer<typeof passwordSchema>

// send otp
const sendOtp = async (e: Event) => {
  e.preventDefault()
  emailValidate.value = ''
   try {
    const res = await post("/api/send-otp", {
      email: email.value,
    }, {
      loading: loadingOtp,
      successMessage: "A reset code has been sent to your email",
      successTitle: "OTP sent"
    })

  } catch (err: any) {
    emailValidate.value = err.message
  }
}

// variablles
const passwordForm = reactive({
  password: '',
  confirmPassword: ''
})
//reset password
const resetPassword = async (e: Event) => {
  e.preventDefault()
  otpValidate.value = ''
  try {
    const res = await post("/api/reset-password", {
      email: email.value,
      otp: otp.value,
      password: passwordForm.password,
      passwordConfirmation: passwordForm.confirmPassword
    }, {
      loading,
      successMessage: "Password Updated",
      successTitle: "Your password has been changed successfully"
    })
    router.push("/login")

  } catch (err: any) {
    otpValidate.value = err.message
  }
}

</script>


