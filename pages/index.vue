<script setup lang="ts">
import { useLocalePath, useUserSession, navigateTo } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed, ref, watch } from 'vue'
import { type Game } from '~/server/db/entities/Game'
import type { MarkerData } from '~/components/MapComp.vue'
import { isDefined, isNull } from '~/utils/types/typeGuards'

usePageMeta('index')
const localePath = useLocalePath()
const { loggedIn } = useUserSession()

watch(
  loggedIn,
  (newValue) => {
    if (newValue) {
      navigateTo(localePath('/dashboard/games'))
    }
  },
  { immediate: true }
)

const {
  data: games,
  error,
  isLoading,
  isSuccess,
  execute: executeFetchGames
} = useFetchWithState<Game[]>('/api/games', {
  query: {
    notInProgressOrFinished: true
  }
})
executeFetchGames()

const markersData = computed<MarkerData[]>(() => {
  if (isNull(games.value)) {
    return []
  }

  return games.value.map((game) => ({
    latitude: game.latitude,
    longitude: game.longitude,
    id: game.id
  }))
})

const selectedGameId = ref<number | undefined>()

const selectedGame = computed(() => {
  if (isNull(games.value)) {
    return undefined
  }

  return games.value.find((game) => game.id === selectedGameId.value)
})
</script>

<template>
  <section
    class="min-fullscreen-whithout-navbar flex flex-col items-center justify-center space-y-12 py-10"
  >
    <img class="w-60" src="/images/player-who-use-the-app.png" alt="Player who rates" />
    <h1 class="large-title" data-cy="hero-banner-subtitle">
      {{ $t('pages.index.hero-banner.subtitle') }}
    </h1>
    <a class="button" href="/#find-a-game" data-cy="hero-banner-cta">
      {{ $t('pages.index.hero-banner.cta') }}
    </a>
    <div class="flex flex-col xl:flex-row px-10 space-y-10 xl:space-y-0 xl:space-x-10">
      <div class="lg:w-96">
        <div class="flex items-center">
          <font-awesome class="text-3xl mr-4" :icon="['fas', 'magnifying-glass-location']" />
          <h3 class="small-title my-4">
            {{ $t('pages.index.hero-banner.infos.title1') }}
          </h3>
        </div>
        <p>{{ $t('pages.index.hero-banner.infos.description1') }}</p>
      </div>
      <div class="lg:w-96">
        <div class="flex items-center">
          <font-awesome class="text-3xl mr-4" :icon="['fas', 'people-group']" />
          <h3 class="small-title my-4">
            {{ $t('pages.index.hero-banner.infos.title2') }}
          </h3>
        </div>
        <p>{{ $t('pages.index.hero-banner.infos.description2') }}</p>
      </div>
      <div class="lg:w-96">
        <div class="flex items-center">
          <font-awesome class="text-3xl mr-4" :icon="['fas', 'trophy']" />
          <h3 class="small-title my-4">
            {{ $t('pages.index.hero-banner.infos.title3') }}
          </h3>
        </div>
        <p>{{ $t('pages.index.hero-banner.infos.description3') }}</p>
      </div>
    </div>
  </section>
  <section
    id="find-a-game"
    class="relative fullscreen-without-navbar p-5 flex flex-col items-center justify-center"
  >
    <h2 class="medium-title my-10">{{ $t('pages.index.find-a-game.title') }}</h2>
    <FetchDataComp :error="error" :isLoading="isLoading" />
    <template v-if="isSuccess">
      <MapComp :markersData="markersData" @marker-clicked="(id) => (selectedGameId = id)" />
      <div
        v-if="isDefined(selectedGame)"
        class="modal lg:absolute lg:inset-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-96 lg:mt-24 lg:mr-6 lg:mb-6 lg:rounded-xl lg:z-0"
      >
        <font-awesome :icon="['fas', 'circle-xmark']" @click="selectedGameId = undefined" />
        <GameInfos :game="selectedGame">
          <NuxtLink class="button" :to="localePath(`/login`)">
            {{ $t('pages.index.find-a-game.join-game') }}
          </NuxtLink>
        </GameInfos>
      </div>
    </template>
  </section>
</template>
