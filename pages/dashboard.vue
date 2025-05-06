<script setup lang="ts">
import { useUserSession } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed, ref, watch } from 'vue'
import { type Game } from '~/server/db/entities/Game'
import type { MarkerData } from '~/components/MapComp.vue'
import { isDefined, isNotNull, isNull, isUndefined } from '~/utils/types/typeGuards'

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
  execute: executeFetchGames
} = useFetchWithState<Game[]>('/api/games')
executeFetchGames()

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
const gameToUpdate = ref<Game | undefined>(undefined)

const canJoinSelectedGame = computed(() => {
  if (isUndefined(selectedGame.value)) {
    return false
  }

  const isParticipant = selectedGame.value.participants.some((participant) => {
    return participant.id === user.value?.id
  })

  const gameFull = selectedGame.value.participants.length >= selectedGame.value.maxParticipants

  return !isParticipant && !gameFull
})

const {
  error: joinGameError,
  resetError: resetJoinGameError,
  isSuccess: isJoinGameSuccess,
  isLoading: isJoinGameLoading,
  execute: executeJoinGame
} = useFetchWithState(
  computed(() => `/api/games/${selectedGame.value?.id}/join`),
  {
    method: 'POST'
  }
)

watch(selectedId, () => {
  resetJoinGameError()
})

async function joinGame() {
  await executeJoinGame()

  if (isJoinGameSuccess.value) {
    executeFetchGames()
  }
}
</script>

<template>
  <div
    v-if="!isSuccess"
    class="flex flex-col items-center justify-center fullscreen-without-navbar"
  >
    <FetchDataComp :error="error" :isLoading="isLoading" />
  </div>
  <section v-else class="relative fullscreen-without-navbar">
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
        <button
          v-if="selectedGame.createdById === user.id"
          class="button-secondary"
          @click="
            () => {
              gameToUpdate = selectedGame
              openAddPanel = true
            }
          "
          data-cy="game-infos-panel-edit-button"
        >
          {{ $t('common.form.edit') }}
        </button>
        <button
          v-if="canJoinSelectedGame"
          :disabled="isJoinGameLoading"
          class="button"
          @click="joinGame"
        >
          <FetchDataComp :error="joinGameError" :isLoading="isJoinGameLoading" />
          <span v-if="!isJoinGameLoading && isNull(joinGameError)">
            {{ $t('pages.dashboard.game.join') }}
          </span>
        </button>
      </GameInfos>
    </div>
    <div
      v-if="openAddPanel"
      class="modal lg:absolute lg:inset-auto lg:right-0 lg:top-0 lg:bottom-0 lg:m-2 lg:rounded-xl lg:z-10"
    >
      <font-awesome
        :icon="['fas', 'circle-xmark']"
        @click="
          () => {
            gameToUpdate = undefined
            openAddPanel = false
          }
        "
      />
      <GameForm
        v-if="view === View.Games"
        :gameToUpdate="gameToUpdate"
        @submit="
          () => {
            executeFetchGames()
            gameToUpdate = undefined
            openAddPanel = false
          }
        "
        @remove="
          () => {
            executeFetchGames()
            selectedId = undefined
            gameToUpdate = undefined
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
        <span class="text-xs text-center mt-2">{{ $t('common.form.add') }}</span>
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
          <span class="text-xs text-center mt-2">{{ $t('pages.dashboard.tab-bar.games') }}</span>
        </p>
        <p
          class="flex flex-col items-center text-secondary"
          :class="{ 'text-primary': view === View.Players }"
        >
          <font-awesome :icon="['fas', 'person']" class="text-xl" />
          <span class="text-xs text-center mt-2">{{ $t('pages.dashboard.tab-bar.players') }}</span>
        </p>
        <p
          class="flex flex-col items-center text-secondary"
          :class="{ 'text-primary': view === View.Teams }"
        >
          <font-awesome :icon="['fas', 'people-group']" class="text-xl" />
          <span class="text-xs text-center mt-2">{{ $t('pages.dashboard.tab-bar.teams') }}</span>
        </p>
        <p
          class="flex flex-col items-center text-secondary"
          :class="{ 'text-primary': view === View.Stores }"
        >
          <font-awesome :icon="['fas', 'store']" class="text-xl" />
          <span class="text-xs text-center mt-2">{{ $t('pages.dashboard.tab-bar.stores') }}</span>
        </p>
      </div>
    </div>
  </section>
</template>
