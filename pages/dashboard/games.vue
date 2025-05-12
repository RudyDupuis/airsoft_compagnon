<script setup lang="ts">
import { useUserSession, definePageMeta } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed, ref, watch } from 'vue'
import { type Game } from '~/server/db/entities/Game'
import type { MarkerData } from '~/components/MapComp.vue'
import { isDefined, isNull, isUndefined } from '~/utils/types/typeGuards'

definePageMeta({
  middleware: ['authenticated']
})
usePageMeta('dashboard.games')

const { user } = useUserSession()

const {
  data: games,
  error,
  isLoading,
  isSuccess,
  execute: executeFetchGames
} = useFetchWithState<Game[]>('/api/games', {
  query: {
    filteredForUser: 'true'
  }
})
executeFetchGames()

const openFilterPanel = ref(false)
const filteredGames = ref<Game[]>([])
const gamesFilterCategoryKey = ref<string | undefined>(undefined)

const markersData = computed<MarkerData[]>(() => {
  return filteredGames.value.map((game) => ({
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

const openAddGamePanel = ref(false)
const gameToUpdate = ref<Game | undefined>(undefined)

const canJoinSelectedGame = computed(() => {
  if (isUndefined(selectedGame.value) || isUndefined(user.value)) {
    return false
  }

  if (new Date(selectedGame.value.startDateTime) < new Date()) {
    return false
  }

  const isParticipant = selectedGame.value.participants.some((participant) => {
    return participant.id === user.value.id
  })

  const gameFull = selectedGame.value.participants.length >= selectedGame.value.maxParticipants

  return !isParticipant && !gameFull
})

const canEditSelectedGame = computed(() => {
  if (isUndefined(selectedGame.value) || isUndefined(user.value)) {
    return false
  }

  if (user.value.isAdmin) {
    return true
  }

  if (new Date(selectedGame.value.startDateTime) < new Date()) {
    return false
  }

  if (selectedGame.value.participants.length > 0) {
    return false
  }

  if (!user.value.isVerified) {
    return false
  }

  if (selectedGame.value.createdById !== user.value.id) {
    return false
  }

  return true
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

watch(selectedGameId, () => {
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
  <section v-if="isSuccess" class="relative fullscreen-without-navbar">
    <p
      v-if="isDefined(gamesFilterCategoryKey)"
      class="absolute z-10 top-0 right-0 bg-background m-2 px-4 py-2 rounded-lg"
      data-cy="games-filter-category-display"
    >
      {{ filteredGames.length }} {{ $t(gamesFilterCategoryKey) }}
    </p>
    <MapComp :markersData="markersData" @marker-clicked="(id) => (selectedGameId = id)" />
    <DashboardPanel v-if="isDefined(selectedGameId)" @close-panel="selectedGameId = undefined">
      <GameInfos v-if="isDefined(selectedGame)" :game="selectedGame">
        <button
          v-if="canEditSelectedGame"
          class="button-secondary"
          @click="
            () => {
              gameToUpdate = selectedGame
              openAddGamePanel = true
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
          data-cy="game-infos-panel-join-button"
        >
          <FetchDataComp :error="joinGameError" :isLoading="isJoinGameLoading" />
          <span v-if="!isJoinGameLoading && isNull(joinGameError)">
            {{ $t('pages.dashboard.games.join') }}
          </span>
        </button>
      </GameInfos>
    </DashboardPanel>
    <DashboardPanel
      v-if="openAddGamePanel"
      @close-panel="
        () => {
          gameToUpdate = undefined
          openAddGamePanel = false
        }
      "
    >
      <GameForm
        :gameToUpdate="gameToUpdate"
        @submit="
          () => {
            executeFetchGames()
            gameToUpdate = undefined
            openAddGamePanel = false
          }
        "
        @remove="
          () => {
            executeFetchGames()
            selectedGameId = undefined
            gameToUpdate = undefined
            openAddGamePanel = false
          }
        "
      />
    </DashboardPanel>
    <DashboardPanel v-show="openFilterPanel" @close-panel="openFilterPanel = false">
      <GameFilters
        v-model:filtered-games="filteredGames"
        v-model:games-filter-category-key="gamesFilterCategoryKey"
        :games="games"
        :user="user"
      />
    </DashboardPanel>
    <DashboardMenu>
      <button
        v-if="user.isVerified"
        class="icon-button"
        @click="openAddGamePanel = !openAddGamePanel"
        data-cy="open-add-panel"
      >
        <font-awesome :icon="['fas', 'plus']" />
      </button>
      <button
        class="icon-button"
        @click="openFilterPanel = !openFilterPanel"
        data-cy="open-filter-panel"
      >
        <font-awesome :icon="['fas', 'filter']" />
      </button>
    </DashboardMenu>
  </section>
  <section v-else class="flex flex-col items-center justify-center fullscreen-without-navbar">
    <FetchDataComp :error="error" :isLoading="isLoading" />
  </section>
</template>
