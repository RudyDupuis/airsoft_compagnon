<script setup lang="ts">
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed, ref } from 'vue'
import { type Game } from '~/server/db/entities/Game'
import type { MarkerData } from '~/components/MapComp.vue'
import { isDefined, isNull } from '~/utils/types/typeGuards'

usePageMeta('map')

const {
  data: games,
  error,
  isLoading,
  isSuccess,
  execute: fetchGames
} = useFetchWithState<Game[]>('/api/games')
fetchGames()

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
  <FetchDataComp :error="error" :isLoading="isLoading" />
  <section v-if="isSuccess" class="relative fullscreen-without-navbar">
    <MapComp :markersData="markersData" @marker-clicked="(id) => (selectedGameId = id)" />
    <div
      v-if="isDefined(selectedGame)"
      class="modal lg:absolute lg:inset-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-96 lg:m-2 lg:rounded-xl lg:z-0"
    >
      <font-awesome :icon="['fas', 'circle-xmark']" @click="selectedGameId = undefined" />
      <GameInfos :game="selectedGame">
        <button class="button">
          {{ $t('map.join-game') }}
        </button>
      </GameInfos>
    </div>
  </section>
</template>
