<script setup lang="ts">
import { useUserSession } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed, ref } from 'vue'
import { type Game } from '~/server/db/entities/Game'
import type { MarkerData } from '~/components/MapComp.vue'
import { isDefined, isNotNull, isNull } from '~/utils/types/typeGuards'

usePageMeta('dashboard')

const { user } = useUserSession()

enum View {
  Games = 'games',
  Players = 'players',
  Teams = 'teams',
  Stores = 'stores'
}
const view = ref<View>(View.Games)
const selectedId = ref<number | undefined>()
const openAddPanel = ref(false)

const {
  data: games,
  error,
  isLoading,
  isSuccess,
  execute: fetchGames
} = useFetchWithState<Game[]>('/api/games')
fetchGames()

const markersData = computed<MarkerData[]>(() => {
  if (view.value === View.Games && isNotNull(games.value)) {
    return games.value.map((game) => ({
      latitude: game.latitude,
      longitude: game.longitude,
      id: game.id
    }))
  }

  return []
})

const selectedGame = computed(() => {
  if (isNull(games.value)) {
    return undefined
  }

  return games.value.find((game) => game.id === selectedId.value)
})
</script>

<template>
  <FetchDataComp :error="error" :isLoading="isLoading" />
  <section v-if="isSuccess" class="relative fullscreen-without-navbar">
    <MapComp
      v-if="view === View.Games || view === View.Stores"
      :markersData="markersData"
      @marker-clicked="(id) => (selectedId = id)"
    />
    <div
      v-if="isDefined(selectedId)"
      class="modal lg:absolute lg:inset-auto lg:right-0 lg:top-0 lg:bottom-0 lg:w-96 lg:m-2 lg:rounded-xl lg:z-10"
    >
      <font-awesome :icon="['fas', 'circle-xmark']" @click="selectedId = undefined" />
      <GameInfos v-if="isDefined(selectedGame) && view === View.Games" :game="selectedGame">
        <button class="button">
          {{ $t('dashboard.join-game') }}
        </button>
      </GameInfos>
    </div>
    <div
      v-if="openAddPanel"
      class="modal lg:absolute lg:inset-auto lg:right-0 lg:top-0 lg:bottom-0 lg:m-2 lg:rounded-xl lg:z-10"
    >
      <font-awesome :icon="['fas', 'circle-xmark']" @click="openAddPanel = false" />
      <GameForm
        v-if="view === View.Games"
        @submit="
          () => {
            fetchGames()
            openAddPanel = false
          }
        "
      />
    </div>
    <div class="w-full flex flex-col items-center absolute bottom-0 pointer-events-none">
      <button
        v-if="user.isVerified"
        class="m-3 self-start flex flex-col items-center hover:text-primary cursor-pointer bg-background p-5 rounded-full pointer-events-auto"
        @click="openAddPanel = !openAddPanel"
        data-cy="open-add-panel"
      >
        <font-awesome :icon="['fas', 'map-location-dot']" class="text-xl" />
        <span class="text-xs text-center mt-2">{{ $t('dashboard.add') }}</span>
      </button>
      <div
        class="w-full lg:w-fit lg:rounded-xl lg:mb-5 flex items-center justify-center gap-5 p-5 bg-background pointer-events-auto"
      >
        <p
          class="flex flex-col items-center hover:text-primary cursor-pointer"
          :class="{ 'text-primary': view === View.Games }"
          @click="view = View.Games"
        >
          <font-awesome :icon="['fas', 'gamepad']" class="text-xl" />
          <span class="text-xs text-center mt-2">{{ $t('dashboard.games') }}</span>
        </p>
        <p
          class="flex flex-col items-center text-secondary"
          :class="{ 'text-primary': view === View.Players }"
        >
          <font-awesome :icon="['fas', 'person']" class="text-xl" />
          <span class="text-xs text-center mt-2">{{ $t('dashboard.players') }}</span>
        </p>
        <p
          class="flex flex-col items-center text-secondary"
          :class="{ 'text-primary': view === View.Teams }"
        >
          <font-awesome :icon="['fas', 'people-group']" class="text-xl" />
          <span class="text-xs text-center mt-2">{{ $t('dashboard.teams') }}</span>
        </p>
        <p
          class="flex flex-col items-center text-secondary"
          :class="{ 'text-primary': view === View.Stores }"
        >
          <font-awesome :icon="['fas', 'store']" class="text-xl" />
          <span class="text-xs text-center mt-2">{{ $t('dashboard.stores') }}</span>
        </p>
      </div>
    </div>
  </section>
</template>
