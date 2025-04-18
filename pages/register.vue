<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalePath, useUserSession } from '#imports'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/models/User.model'
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
  error,
  isLoading,
  isSuccess,
  execute: registerUser
} = useFetchWithState<User>('/api/auth/register', {
  method: 'POST',
  body: computed(() => ({
    email: email.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
    dateOfBirth: dateOfBirth.value,
    pseudo: pseudo.value
  }))
})

async function register() {
  if (password.value !== confirmPassword.value) {
    error.value = t('register.password-mismatch')
    return
  }

  await registerUser()

  if (isSuccess.value) {
    const { fetch: refreshSession } = useUserSession()
    await refreshSession()
    router.push(localePath('/'))
  }
}
</script>

<template>
  <section class="fullscreen-player-lying-in-the-grass-background">
    <div class="container">
      <h1>{{ $t('register.h1') }}</h1>

      <FormComp
        v-if="!isSuccess"
        submitButtonKey="register.submit"
        :error="error"
        :isLoading="isLoading"
        :isSuccess="isSuccess"
        @submit="register"
      >
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
      </FormComp>

      <NuxtLink :to="localePath('/login')" class="button-secondary">
        {{ $t('register.login') }}
      </NuxtLink>
    </div>
  </section>
</template>
