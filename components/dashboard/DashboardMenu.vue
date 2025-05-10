<script setup lang="ts">
import { useRoute, useLocalePath } from '#imports'

const route = useRoute()
const localePath = useLocalePath()
</script>

<template>
  <div class="w-full flex flex-col items-center absolute bottom-0 pointer-events-none">
    <slot></slot>
    <div
      class="w-full lg:w-fit lg:rounded-xl lg:mb-5 flex items-center justify-center gap-5 p-5 bg-background pointer-events-auto"
    >
      <NuxtLink
        class="flex flex-col items-center hover:text-primary"
        :class="{
          'cursor-default text-primary': route.path === localePath('/dashboard/games')
        }"
        :to="localePath('/dashboard/games')"
      >
        <font-awesome :icon="['fas', 'gamepad']" class="text-xl" />
        <span class="text-xs text-center mt-2">{{ $t('pages.dashboard.tab-bar.games') }}</span>
      </NuxtLink>
      <NuxtLink
        class="flex flex-col items-center hover:text-primary"
        :class="{
          'cursor-default text-primary': route.path === localePath('/dashboard/players')
        }"
        :to="localePath('/dashboard/players')"
      >
        <font-awesome :icon="['fas', 'person']" class="text-xl" />
        <span class="text-xs text-center mt-2">{{ $t('pages.dashboard.tab-bar.players') }}</span>
      </NuxtLink>
      <NuxtLink class="flex flex-col items-center text-secondary">
        <font-awesome :icon="['fas', 'people-group']" class="text-xl" />
        <span class="text-xs text-center mt-2">{{ $t('pages.dashboard.tab-bar.teams') }}</span>
      </NuxtLink>
      <NuxtLink class="flex flex-col items-center text-secondary">
        <font-awesome :icon="['fas', 'store']" class="text-xl" />
        <span class="text-xs text-center mt-2">{{ $t('pages.dashboard.tab-bar.stores') }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
