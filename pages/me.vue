<script setup lang="ts">
import { useLocalePath, useUserSession } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { isNotNull } from '~/utils/types/typeGuards'
import type { User } from '~/server/db/entities/User'
import { useRouter } from 'vue-router'

usePageMeta('me')
const localePath = useLocalePath()
const router = useRouter()
const { clear } = useUserSession()

const {
  data: user,
  error,
  isLoading,
  isSuccess,
  execute: executeFetchMe
} = useFetchWithState<User>('/api/auth/me')
executeFetchMe()

function logout() {
  clear()
  router.push(localePath('/'))
}
</script>

<template>
  <section class="fullscreen-player-lying-in-the-grass-background">
    <div class="container">
      <h1>{{ $t('pages.me.h1') }}</h1>

      <FetchDataComp :error="error" :isLoading="isLoading" />

      <div v-if="isSuccess && isNotNull(user)" class="flex flex-col gap-8">
        <div class="flex flex-col gap-4">
          <p>{{ $t('entities.user.pseudo') }}: {{ user.pseudo }}</p>
          <p>{{ $t('entities.user.first-name') }}: {{ user.firstName }}</p>
          <p>{{ $t('entities.user.last-name') }}: {{ user.lastName }}</p>
          <p>{{ $t('entities.user.email') }}: {{ user.email }}</p>
          <p>
            {{ $t('entities.user.date-of-birth') }}:
            {{ new Date(user.dateOfBirth).toLocaleDateString() }}
          </p>
        </div>

        <NuxtLink :to="localePath('/me/edit')" class="button">
          {{ $t('common.form.edit') }}
        </NuxtLink>
      </div>
      <button class="button-secondary" @click="logout">
        {{ $t('pages.me.logout') }}
      </button>
    </div>
  </section>
</template>
