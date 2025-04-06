<script setup lang="ts">
import { useLocalePath } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'

usePageMeta('login')
const localePath = useLocalePath()
</script>

<template>
  <section
    class="w-screen pt-40 pb-20 bg-cover bg-center bg-left flex items-center justify-center"
    style="background-image: url('/images/player-lying-in-the-grass-background.png')"
  >
    <div
      class="bg-background rounded-lg border-primary border-2 border px-40 py-10 flex flex-col items-center justify-center gap-10"
    >
      <BigLogoSvg class="w-80" />

      <form class="flex flex-col gap-8 w-full">
        <div class="flex flex-col gap-2">
          <label for="email">{{ $t('login.email') }}</label>
          <input id="email" type="email" :placeholder="$t('login.email')" class="text-input" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="password">{{ $t('login.password') }}</label>
          <input
            id="password"
            type="password"
            :placeholder="$t('login.password')"
            class="text-input"
          />
        </div>

        <button class="button mt-5">{{ $t('login.submit') }}</button>
      </form>

      <NuxtLink :to="localePath('/register')" class="button-secondary">
        {{ $t('login.register') }}
      </NuxtLink>

      <NuxtLink :to="localePath('/forgot-password')" class="underline hover:text-primary">{{
        $t('login.forgot-password')
      }}</NuxtLink>
    </div>
  </section>
</template>
