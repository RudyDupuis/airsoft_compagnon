<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalePath, useUserSession } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/models/User'

usePageMeta('login')
const localePath = useLocalePath()
const router = useRouter()

const email = ref('')
const password = ref('')

const {
  error,
  isLoading,
  isSuccess,
  execute: loginUser
} = useFetchWithState<User>('/api/auth/login', {
  method: 'POST',
  body: computed(() => ({
    email: email.value,
    password: password.value
  }))
})

async function login() {
  await loginUser()

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
      <h1>{{ $t('login.h1') }}</h1>

      <FormComp
        v-if="!isSuccess"
        submitButtonKey="login.submit"
        :error="error"
        :isLoading="isLoading"
        :isSuccess="isSuccess"
        @submit="login"
      >
        <InputField v-model="email" placeholderKey="login.email" type="email" required />
        <InputField v-model="password" placeholderKey="login.password" type="password" required />
      </FormComp>

      <NuxtLink :to="localePath('/register')" class="button-secondary">
        {{ $t('login.register') }}
      </NuxtLink>

      <!-- TODO <NuxtLink :to="localePath('/forgot-password')" class="underline hover:text-primary">
        {{ $t('login.forgot-password') }}
      </NuxtLink> -->
    </div>
  </section>
</template>
