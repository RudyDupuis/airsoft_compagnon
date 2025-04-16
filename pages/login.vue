<script setup lang="ts">
import { ref } from 'vue'
import { useLocalePath, useUserSession } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/models/User.model'
import { isNotBlankString, isNotNull } from '~/utils/types/typeGuards'

usePageMeta('login')
const localePath = useLocalePath()
const router = useRouter()

const email = ref('')
const password = ref('')

const {
  data,
  error,
  isLoading,
  fetch: loginUser
} = useFetchWithState<User>('/api/auth/login', {
  method: 'POST'
})

async function login() {
  await loginUser({
    email: email.value,
    password: password.value
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
      class="bg-background rounded-lg border-primary border-2 border px-40 py-10 flex flex-col items-center justify-center gap-10"
    >
      <BigLogoSvg class="w-60 md:w-80" />

      <form @submit.prevent="login" class="flex flex-col gap-8 w-full">
        <div v-if="isNotBlankString(error)" class="border border-2 px-4 py-3 rounded text-center">
          {{ error }}
        </div>

        <InputField v-model="email" placeholderKey="login.email" type="email" required />
        <InputField v-model="password" placeholderKey="login.password" type="password" required />

        <button v-if="!isLoading" class="button mt-5">{{ $t('login.submit') }}</button>
        <button v-else class="button mt-5" disabled>
          <font-awesome class="text-2xl animate-spin" :icon="['fas', 'spinner']" />
        </button>
      </form>

      <NuxtLink :to="localePath('/register')" class="button-secondary">
        {{ $t('login.register') }}
      </NuxtLink>

      <!-- TODO <NuxtLink :to="localePath('/forgot-password')" class="underline hover:text-primary">
        {{ $t('login.forgot-password') }}
      </NuxtLink> -->
    </div>
  </section>
</template>
