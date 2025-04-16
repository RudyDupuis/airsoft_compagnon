<script setup lang="ts">
import { useLocalePath } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'

usePageMeta('errorPage')
const localePath = useLocalePath()
</script>

<template>
  <HeaderComp />
  <main
    class="flex flex-col items-center justify-center space-y-10 w-screen h-screen bg-cover bg-center bg-left"
    style="background-image: url('/images/player-lying-in-the-grass-background.png')"
  >
    <h1 class="large-title">{{ $t('errorPage.description') }}</h1>

    <NuxtLink :to="localePath('/')" class="button">{{ $t('errorPage.cta') }}</NuxtLink>
  </main>
  <FooterComp />
</template>
