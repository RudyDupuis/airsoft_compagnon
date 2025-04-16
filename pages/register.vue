<script setup lang="ts">
import { ref } from 'vue'
import { useLocalePath, useUserSession } from '#imports'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/models/User.model'
import { isNotBlankString, isNotNull } from '~/utils/types/typeGuards'
import { emailRegex, nameRegex, passwordRegex, pseudoRegex } from '~/utils/validations/regex'
import { isOfLegalAge } from '~/utils/validations/methods'

usePageMeta('register')
const localePath = useLocalePath()
const router = useRouter()
const { t } = useI18n()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
const dateOfBirth = ref('')
const pseudo = ref('')

const {
  data,
  error,
  isLoading,
  fetch: registerUser
} = useFetchWithState<User>('/api/auth/register', {
  method: 'POST'
})

async function register() {
  if (password.value !== confirmPassword.value) {
    error.value = t('register.password-mismatch')
    return
  }

  await registerUser({
    email: email.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
    dateOfBirth: dateOfBirth.value,
    pseudo: pseudo.value
  })

  if (isNotNull(data.value)) {
    const { fetch: refreshSession } = useUserSession()
    await refreshSession()
    router.push(localePath('/'))
  }
}
</script>

<template>
  <section
    class="w-screen pt-40 pb-20 bg-cover bg-center bg-left flex items-center justify-center"
    style="background-image: url('/images/player-lying-in-the-grass-background.png')"
  >
    <div
      class="bg-background rounded-lg border-primary border-2 border px-10 mx-5 sm:px-40 py-10 flex flex-col items-center justify-center gap-10"
    >
      <BigLogoSvg class="w-60 md:w-80" />

      <form @submit.prevent="register" class="flex flex-col gap-8 w-full">
        <div v-if="isNotBlankString(error)" class="border border-2 px-4 py-3 rounded text-center">
          {{ error }}
        </div>

        <InputField
          v-model="firstName"
          placeholderKey="register.first-name"
          :regex="nameRegex"
          errorMessageKey="register.invalid-first-name"
          required
        />
        <InputField
          v-model="lastName"
          placeholderKey="register.last-name"
          :regex="nameRegex"
          errorMessageKey="register.invalid-last-name"
          required
        />
        <InputField
          v-model="pseudo"
          placeholderKey="register.pseudo"
          :regex="pseudoRegex"
          errorMessageKey="register.invalid-pseudo"
          required
        />
        <InputField
          v-model="dateOfBirth"
          placeholderKey="register.date-of-birth"
          :custom-validation="isOfLegalAge"
          error-message-key="register.invalid-date-of-birth"
          type="date"
          required
        />
        <InputField
          v-model="email"
          placeholderKey="register.email"
          :regex="emailRegex"
          errorMessageKey="register.invalid-email"
          type="email"
          required
        />
        <InputField
          v-model="password"
          placeholderKey="register.password"
          :regex="passwordRegex"
          errorMessageKey="register.invalid-password"
          type="password"
          required
        />
        <InputField
          v-model="confirmPassword"
          placeholderKey="register.confirm-password"
          :regex="passwordRegex"
          errorMessageKey="register.invalid-password"
          type="password"
          required
        />

        <button v-if="!isLoading" class="button mt-5">{{ $t('register.submit') }}</button>
        <button v-else class="button mt-5" disabled>
          <font-awesome class="text-2xl animate-spin" :icon="['fas', 'spinner']" />
        </button>
      </form>

      <NuxtLink :to="localePath('/login')" class="button-secondary">
        {{ $t('register.login') }}
      </NuxtLink>
    </div>
  </section>
</template>
