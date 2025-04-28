<script setup lang="ts">
import { useRoute, useLocalePath, useUserSession } from '#imports'

const route = useRoute()
const localePath = useLocalePath()
const { loggedIn, user } = useUserSession()
</script>

<template>
  <header
    class="flex items-center justify-between px-10 md:px-20 h-20 fixed top-0 left-0 w-screen z-50 bg-background bg-opacity-80"
  >
    <NuxtLink :to="localePath('/')">
      <div>
        <SmallLogoSvg class="size-12 fill-on-background hover:fill-primary" />
      </div>
    </NuxtLink>

    <nav class="flex flex-col gap-2 md:flex-row md:gap-10">
      <NuxtLink
        v-if="!loggedIn"
        class="underline hover:text-primary"
        :class="{
          'cursor-default text-primary hover:text-on-background':
            route.path === localePath('/login')
        }"
        :to="localePath('/login')"
      >
        {{ $t('header.login-link') }}
      </NuxtLink>
      <NuxtLink
        v-else
        class="hover:text-primary"
        :class="{
          'cursor-default text-primary hover:text-on-background': route.path === localePath('/me')
        }"
        :to="localePath('/me')"
      >
        <font-awesome class="mr-1" :icon="['fas', 'person-rifle']" />
        <span class="underline" data-cy="header-user-pseudo">{{ user?.pseudo }}</span>
      </NuxtLink>
    </nav>
  </header>
</template>
