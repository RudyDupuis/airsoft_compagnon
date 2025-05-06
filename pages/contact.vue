<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLocalePath } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useRouter } from 'vue-router'
import type { User } from '~/server/db/entities/User'
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
  execute: executeSendMessage
} = useFetchWithState<User>('/api/contact', {
  method: 'POST',
  body: computed(() => ({
    email: email.value,
    message: message.value
  }))
})

async function sendMessage() {
  await executeSendMessage()

  if (isSuccess.value) {
    setTimeout(() => router.push(localePath('/')), 5000)
  }
}
</script>

<template>
  <section class="wrapper">
    <h1 class="large-title">{{ $t('pages.contact.h1') }}</h1>

    <FormComp
      v-if="!isSuccess"
      submitButtonKey="common.form.submit"
      :error="error"
      :isLoading="isLoading"
      @submit="sendMessage"
    >
      <InputField
        v-model="email"
        placeholderKey="entities.user.email"
        :regex="emailRegex"
        errorMessageKey="entities.user.errors.invalid-email"
        type="email"
        required
      />
      <InputField
        v-model="message"
        type="textarea"
        placeholderKey="pages.contact.message"
        required
      />
    </FormComp>

    <div v-else class="mb-20">
      <h2 class="text-2xl text-center">{{ $t('pages.contact.thank-you') }}</h2>
      <p class="text-xl mt-10">
        {{ $t('pages.contact.message-sent') }}
        <br />
        {{ $t('pages.contact.redirecting') }}
      </p>
    </div>
  </section>
</template>
