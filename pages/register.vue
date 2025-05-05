<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalePath, useUserSession } from '#imports'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/entities/User'
import { emailRegex, usernameRegex, passwordRegex, pseudoRegex } from '~/utils/validations/regex'
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
  execute: executeRegisterUser
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

async function registerUser() {
  if (password.value !== confirmPassword.value) {
    error.value = t('pages.register.errors.password-mismatch')
    return
  }

  await executeRegisterUser()

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
      <h1>{{ $t('pages.register.h1') }}</h1>

      <FormComp
        v-if="!isSuccess"
        submitButtonKey="pages.register.h1"
        :error="error"
        :isLoading="isLoading"
        :isSuccess="isSuccess"
        @submit="registerUser"
      >
        <InputField
          v-model="firstName"
          placeholderKey="entities.user.first-name"
          :regex="usernameRegex"
          errorMessageKey="entities.user.errors.invalid-first-name"
          required
          cy="first-name"
        />
        <InputField
          v-model="lastName"
          placeholderKey="entities.user.last-name"
          :regex="usernameRegex"
          errorMessageKey="entities.user.errors.invalid-last-name"
          required
          cy="last-name"
        />
        <InputField
          v-model="pseudo"
          placeholderKey="entities.user.pseudo"
          :regex="pseudoRegex"
          errorMessageKey="entities.user.errors.invalid-pseudo"
          required
          cy="pseudo"
        />
        <InputField
          v-model="dateOfBirth"
          placeholderKey="entities.user.date-of-birth"
          :custom-string-validation="isOfLegalAge"
          error-message-key="entities.user.errors.invalid-date-of-birth"
          type="date"
          required
          cy="date-of-birth"
        />
        <InputField
          v-model="email"
          placeholderKey="entities.user.email"
          :regex="emailRegex"
          errorMessageKey="entities.user.errors.invalid-email"
          type="email"
          required
          cy="email"
        />
        <InputField
          v-model="password"
          placeholderKey="entities.user.password"
          :regex="passwordRegex"
          errorMessageKey="entities.user.errors.invalid-password"
          type="password"
          required
          cy="password"
        />
        <InputField
          v-model="confirmPassword"
          placeholderKey="pages.register.confirm-password"
          :regex="passwordRegex"
          errorMessageKey="entities.user.errors.invalid-password"
          type="password"
          required
          cy="confirm-password"
        />
      </FormComp>

      <NuxtLink :to="localePath('/login')" class="button-secondary" data-cy="login-link">
        {{ $t('pages.register.login') }}
      </NuxtLink>
    </div>
  </section>
</template>
