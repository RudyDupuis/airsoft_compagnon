<script setup lang="ts">
import { useRoute, useLocalePath } from '#imports'

const route = useRoute()
const localePath = useLocalePath()
</script>

<template>
  <header
    class="flex items-center justify-between px-10 md:px-20 py-5 fixed top-0 left-0 w-screen z-50 bg-background bg-opacity-80"
  >
    <NuxtLink :to="localePath('/')">
      <div>
        <SmallLogoSvg class="size-12 fill-on-background hover:fill-primary" />
      </div>
    </NuxtLink>

    <nav class="flex flex-col gap-2 md:flex-row md:gap-10">
      <NuxtLink
        class="underline hover:text-primary"
        :class="{
          'cursor-default text-primary hover:text-on-background':
            route.path === localePath('/contact')
        }"
        :to="localePath('/contact')"
      >
        {{ $t('header.contact-link') }}
      </NuxtLink>
      <NuxtLink
        class="underline hover:text-primary"
        :class="{
          'cursor-default text-primary hover:text-on-background':
            route.path === localePath('/login')
        }"
        :to="localePath('/login')"
      >
        {{ $t('header.login-link') }}
      </NuxtLink>
    </nav>
  </header>
</template>
