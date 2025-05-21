<script setup lang="ts">
import { useRoute, useLocalePath, useUserSession } from '#imports'
import { useFetchWithState } from '~/composables/useFetchWithState'
import type Notification from '~/utils/interface/Notification'
import { isNotNull } from '~/utils/types/typeGuards'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const route = useRoute()
const localePath = useLocalePath()
const { loggedIn, user } = useUserSession()

const showNotifModal = ref(false)

const {
  data: notifications,
  isSuccess: isFetchNotificationsSuccess,
  isLoading: isFetchGetNotificationsLoading,
  error: fetchNotificationsError,
  execute: executeFetchNotifications
} = useFetchWithState<Notification[]>('/api/notifications')

//TODO: use a better way to refresh notifications
let notificationInterval: ReturnType<typeof setInterval> | null = null

const refreshNotifications = () => {
  if (loggedIn) {
    executeFetchNotifications()
  }
}

onMounted(() => {
  refreshNotifications()
  notificationInterval = setInterval(refreshNotifications, 300000) // 5 minutes
})

onBeforeUnmount(() => {
  if (isNotNull(notificationInterval)) {
    clearInterval(notificationInterval)
    notificationInterval = null
  }
})
</script>

<template>
  <header
    class="flex items-center justify-between px-10 md:px-20 h-20 fixed top-0 left-0 w-screen z-50 bg-background bg-opacity-80"
  >
    <NuxtLink :to="localePath('/')" data-cy="header-logo">
      <div>
        <SmallLogoSvg class="size-12 fill-on-background hover:fill-primary" />
      </div>
    </NuxtLink>

    <nav class="flex gap-5 md:gap-10">
      <NuxtLink
        v-if="!loggedIn"
        class="underline hover:text-primary"
        :class="{
          'cursor-default text-primary hover:text-on-background':
            route.path === localePath('/login')
        }"
        :to="localePath('/login')"
        data-cy="header-login-link"
      >
        {{ $t('components.header.login') }}
      </NuxtLink>
      <template v-else>
        <NuxtLink
          class="hover:text-primary"
          :class="{
            'cursor-default text-primary hover:text-on-background': route.path === localePath('/me')
          }"
          :to="localePath('/me')"
          data-cy="header-me-link"
        >
          <font-awesome class="text-xl mr-1" :icon="['fas', 'person-rifle']" />
          <span data-cy="header-user-pseudo">{{ user?.pseudo }}</span>
        </NuxtLink>
        <button
          class="hover:text-primary"
          @click="showNotifModal = true"
          data-cy="header-notification-button"
        >
          <font-awesome class="text-xl mr-1" :icon="['fas', 'bell']" />
          <span
            v-if="isFetchNotificationsSuccess && isNotNull(notifications)"
            data-cy="header-notification-count"
          >
            {{ notifications?.length }}
          </span>
          <font-awesome
            v-if="isFetchGetNotificationsLoading"
            class="animate-spin"
            :icon="['fas', 'spinner']"
          />
        </button>
      </template>
    </nav>

    <div
      v-if="showNotifModal"
      class="modal flex flex-col items-center justify-center"
      data-cy="header-notification-modal"
    >
      <font-awesome :icon="['fas', 'circle-xmark']" @click="showNotifModal = false" />
      <h3 class="large-title">{{ $t('components.header.notification.title') }}</h3>
      <FetchDataComp
        :error="fetchNotificationsError"
        :is-loading="isFetchGetNotificationsLoading"
      />
      <div v-if="isFetchNotificationsSuccess && isNotNull(notifications)">
        <div
          v-for="(notification, index) in notifications"
          :key="index"
          class="border-b-2 border-on-background py-5"
        >
          <p :data-cy="`header-notification-modal-message-${index + 1}`">
            {{
              notification.message.values
                ? $t(notification.message.key, notification.message.values)
                : $t(notification.message.key)
            }}
          </p>
          <NuxtLink
            v-if="notification.link"
            :to="localePath(notification.link.url)"
            class="text-secondary hover:text-primary"
            @click="showNotifModal = false"
            :data-cy="`header-notification-modal-link-${index + 1}`"
          >
            <font-awesome :icon="['fas', 'right-to-bracket']" />
            {{ $t(notification.link.linkTextKey) }}
          </NuxtLink>
        </div>
        <div v-if="notifications.length === 0">
          <p>{{ $t('components.header.notification.empty') }}</p>
        </div>
      </div>
    </div>
  </header>
</template>
