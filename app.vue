<script setup lang="ts">
import { useRoute, useLocalePath } from '#imports'

const route = useRoute()
const localePath = useLocalePath()
</script>

<template>
  <HeaderComp />
  <main class="flex flex-col items-center justify-center min-h-screen">
    <NuxtPage />
  </main>
  <FooterComp v-if="route.path !== localePath('/dashboard')" />
</template>
