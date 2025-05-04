<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalePath, useUserSession } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/entities/User'

usePageMeta('login')
const localePath = useLocalePath()
const router = useRouter()

const email = ref('')
const password = ref('')

const {
  error,
  isLoading,
  isSuccess,
  execute: executeLoginUser
} = useFetchWithState<User>('/api/auth/login', {
  method: 'POST',
  body: computed(() => ({
    email: email.value,
    password: password.value
  }))
})

async function loginUser() {
  await executeLoginUser()

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
      <h1>{{ $t('pages.login.h1') }}</h1>

      <FormComp
        v-if="!isSuccess"
        submitButtonKey="pages.login.h1"
        :error="error"
        :isLoading="isLoading"
        :isSuccess="isSuccess"
        @submit="loginUser"
      >
        <InputField
          v-model="email"
          placeholderKey="entities.user.email"
          type="email"
          required
          cy="email"
        />
        <InputField
          v-model="password"
          placeholderKey="entities.user.password"
          type="password"
          required
          cy="password"
        />
      </FormComp>

      <NuxtLink :to="localePath('/register')" class="button-secondary" data-cy="register-link">
        {{ $t('pages.login.register') }}
      </NuxtLink>

      <!-- TODO <NuxtLink :to="localePath('/forgot-password')" class="underline hover:text-primary">
        {{ $t('login.forgot-password') }}
      </NuxtLink> -->
    </div>
  </section>
</template>
