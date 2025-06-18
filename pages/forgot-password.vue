<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalePath } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/entities/User'

usePageMeta('forgot-password')
const localePath = useLocalePath()
const router = useRouter()

const email = ref('')

const {
  error,
  isLoading,
  isSuccess,
  execute: executeSendEmailUser
} = useFetchWithState<User>('/api/auth/forgot-password', {
  method: 'POST',
  body: computed(() => ({
    email: email.value
  }))
})

async function sendEmail() {
  await executeSendEmailUser()

  if (isSuccess.value) {
    setTimeout(() => router.push(localePath('/')), 5000)
  }
}
</script>

<template>
  <section class="wrapper">
    <h1 class="large-title">{{ $t('pages.forgot-password.h1') }}</h1>
    <FormComp
      v-if="!isSuccess"
      submitButtonKey="pages.forgot-password.send-reset-link"
      :error="error"
      :isLoading="isLoading"
      @submit="sendEmail"
    >
      <InputField
        v-model="email"
        placeholderKey="entities.user.email"
        type="email"
        required
        cy="email"
      />
    </FormComp>

    <div v-else class="mb-20 space-y-10">
      <p class="text-xl">
        <font-awesome :icon="['fas', 'check']" class="text-2xl" />
        {{ $t('pages.forgot-password.success-message') }}
      </p>
      <p>
        <font-awesome :icon="['fas', 'stopwatch']" class="text-xl" />
        {{ $t('common.form.redirecting') }}
      </p>
    </div>
  </section>
</template>
