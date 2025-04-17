<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalePath } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/models/User.model'
import { isNotNull } from '~/utils/types/typeGuards'
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
  <section
    class="w-screen pt-40 pb-20 bg-cover bg-center bg-left flex items-center justify-center"
    style="background-image: url('/images/player-lying-in-the-grass-background.png')"
  >
    <div
      class="bg-background rounded-lg border-primary border-2 border px-10 mx-5 sm:px-40 py-10 flex flex-col items-center justify-center gap-10"
    >
      <BigLogoSvg class="w-60 md:w-80" />

      <form v-if="!isSuccess" @submit.prevent="send" class="flex flex-col gap-8 w-full">
        <div v-if="isNotNull(error)" class="border border-2 px-4 py-3 rounded text-center">
          {{ error }}
        </div>

        <InputField
          v-model="email"
          placeholderKey="contact.email"
          :regex="emailRegex"
          errorMessageKey="contact.invalid-email"
          type="email"
          required
        />
        <!-- TODO : Use TextArea -->
        <InputField v-model="message" placeholderKey="contact.message" required />

        <button v-if="!isLoading" class="button my-5">{{ $t('contact.submit') }}</button>
        <button v-else class="button my-5" disabled>
          <font-awesome class="text-2xl animate-spin" :icon="['fas', 'spinner']" />
        </button>
      </form>

      <div v-else class="text-center mb-20">
        <h1 class="text-2xl">{{ $t('contact.thank-you') }}</h1>
        <p class="text-xl mt-5">
          {{ $t('contact.message-sent') }}
          <br />
          {{ $t('contact.redirecting') }}
        </p>
      </div>
    </div>
  </section>
</template>
