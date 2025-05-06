<script setup lang="ts">
import { useRoute, useLocalePath } from '#imports'

const route = useRoute()
const localePath = useLocalePath()
</script>

<template>
  <HeaderComp />
  <main class="min-h-screen pt-20">
    <NuxtPage />
  </main>
  <FooterComp v-if="route.path !== localePath('/dashboard')" />
</template>
