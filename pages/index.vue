<script setup lang="ts">
import { useLocalePath, useUserSession, navigateTo } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed, ref } from 'vue'
import { type Game } from '~/server/db/entities/Game'
import type { MarkerData } from '~/components/MapComp.vue'
import { isDefined, isNull } from '~/utils/types/typeGuards'

usePageMeta('index')
const localePath = useLocalePath()
const { loggedIn } = useUserSession()

if (loggedIn.value) {
  navigateTo(localePath('/dashboard'))
}

const {
  data: games,
  error,
  isLoading,
  isSuccess,
  execute: executeFetchGames
} = useFetchWithState<Game[]>('/api/games')
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
  <section class="fullscreen-player-lying-in-the-grass-background">
    <div class="lg:w-5/12"></div>
    <div class="flex flex-col items-center justify-center gap-14 md:gap-20">
      <BigLogoSvg class="w-10/12 md:w-fit" />
      <pre class="text-lg md:text-2xl" data-cy="hero-banner-subtitle">{{
        $t('index.hero-banner.subtitle')
      }}</pre>
      <a class="button" href="/#find-a-game" data-cy="hero-banner-cta">{{
        $t('index.hero-banner.cta')
      }}</a>
    </div>
  </section>
  <section
    id="find-a-game"
    class="relative fullscreen-without-navbar p-5 flex flex-col items-center justify-center"
  >
    <h2 class="large-title mb-10">{{ $t('index.find-a-game.title') }}</h2>
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
            {{ $t('index.find-a-game.join-game') }}
          </NuxtLink>
        </GameInfos>
      </div>
    </template>
  </section>
  <section
    class="w-screen bg-cover bg-center flex items-center justify-center xl:justify-between"
    style="background-image: url('/images/player-in-forest-background.png')"
  >
    <div></div>
    <div class="px-10 xl:pr-40 py-40 xl:py-60 xl:w-5/12">
      <h3 class="font-bold text-2xl py-8">{{ $t('index.infos.title1') }}</h3>
      <p>{{ $t('index.infos.description1') }}</p>
      <h3 class="font-bold text-2xl py-8">{{ $t('index.infos.title2') }}</h3>
      <p>{{ $t('index.infos.description2') }}</p>
      <h3 class="font-bold text-2xl py-8">{{ $t('index.infos.title3') }}</h3>
      <p>{{ $t('index.infos.description3') }}</p>
    </div>
  </section>
</template>
