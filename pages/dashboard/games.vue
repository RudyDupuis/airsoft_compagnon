<script setup lang="ts">
import { useUserSession } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed, ref, watch } from 'vue'
import { type Game } from '~/server/db/entities/Game'
import type { MarkerData } from '~/components/MapComp.vue'
import { isDefined, isNotNull, isNull, isUndefined } from '~/utils/types/typeGuards'

usePageMeta('dashboard.games')

const { user } = useUserSession()

const {
  data: games,
  error,
  isLoading,
  isSuccess,
  execute: executeFetchGames
} = useFetchWithState<Game[]>('/api/games')
executeFetchGames()

const markersData = computed<MarkerData[]>(() => {
  if (isNotNull(games.value)) {
    return games.value.map((game) => ({
      latitude: game.latitude,
      longitude: game.longitude,
      id: game.id
    }))
  }

  return []
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
    <MapComp :markersData="markersData" @marker-clicked="(id) => (selectedGameId = id)" />
    <DashboardPanel v-if="isDefined(selectedGameId)" @close-panel="selectedGameId = undefined">
      <GameInfos v-if="isDefined(selectedGame)" :game="selectedGame">
        <button
          v-if="(selectedGame.createdById === user.id || user.isAdmin) && user.isVerified"
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
    <DashboardMenu>
      <button
        v-if="user.isVerified"
        class="m-3 self-start flex flex-col items-center hover:text-primary cursor-pointer bg-background p-5 rounded-full pointer-events-auto"
        @click="openAddGamePanel = !openAddGamePanel"
        data-cy="open-add-panel"
      >
        <font-awesome :icon="['fas', 'map-location-dot']" class="text-xl" />
        <span class="text-xs text-center mt-2">{{ $t('common.form.add') }}</span>
      </button>
    </DashboardMenu>
  </section>
  <section v-else class="flex flex-col items-center justify-center fullscreen-without-navbar">
    <FetchDataComp :error="error" :isLoading="isLoading" />
  </section>
</template>
