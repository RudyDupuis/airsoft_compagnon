<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalePath } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/models/User.model'
import { emailRegex } from '~/utils/validations/regex'

usePageMeta('contact')
const localePath = useLocalePath()
const router = useRouter()

const email = ref('')
const message = ref('')

const {
  error,
  isLoading,
  isSuccess,
  execute: sendMessage
} = useFetchWithState<User>('/api/contact', {
  method: 'POST',
  body: computed(() => ({
    email: email.value,
    message: message.value
  }))
})

async function send() {
  await sendMessage()

  if (isSuccess.value) {
    setTimeout(() => router.push(localePath('/')), 5000)
  }
}
</script>

<template>
  <section class="fullscreen-player-lying-in-the-grass-background">
    <div class="container">
      <h1>{{ $t('contact.h1') }}</h1>

      <FormComp
        v-if="!isSuccess"
        submitButtonKey="contact.submit"
        :error="error"
        :isLoading="isLoading"
        :isSuccess="isSuccess"
        @submit="send"
      >
        <InputField
          v-model="email"
          placeholderKey="contact.email"
          :regex="emailRegex"
          errorMessageKey="contact.invalid-email"
          type="email"
          required
        />
        <InputField v-model="message" type="textarea" placeholderKey="contact.message" required />
      </FormComp>

      <div v-else class="text-center mb-20">
        <h2 class="text-2xl">{{ $t('contact.thank-you') }}</h2>
        <p class="text-xl mt-5">
          {{ $t('contact.message-sent') }}
          <br />
          {{ $t('contact.redirecting') }}
        </p>
      </div>
    </div>
  </section>
</template>
