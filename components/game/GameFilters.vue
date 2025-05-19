<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import type { Game } from '~/server/db/entities/Game'
import type { User } from '~/server/db/entities/User'
import { isNull } from '~/utils/types/typeGuards'

enum GameFilterCategory {
  CAN_JOIN = 'canJoin',
  JOINED = 'joined',
  COMPLETED = 'completed',
  CREATED_BY_ME = 'createdByMe',
  ALL = 'all'
}
const gamesFilterCategory = ref<GameFilterCategory>(GameFilterCategory.CAN_JOIN)

const filteredGames = defineModel<Game[]>('filteredGames', { required: true })
const gamesFilterCategoryKey = defineModel<string | undefined>('gamesFilterCategoryKey', {
  required: true
})

const props = defineProps<{
  games: Game[] | null
  user: User
}>()

const availableGameFilterCategories = computed(() => {
  const categories: Record<string, string> = {
    CAN_JOIN: GameFilterCategory.CAN_JOIN,
    JOINED: GameFilterCategory.JOINED,
    COMPLETED: GameFilterCategory.COMPLETED,
    CREATED_BY_ME: GameFilterCategory.CREATED_BY_ME,
    ALL: GameFilterCategory.ALL
  }

  if (!props.user.isVerified) {
    delete categories.CREATED_BY_ME
  }

  if (!props.user.isAdmin) {
    delete categories.ALL
  }

  return Object.values(categories)
})

watch(
  gamesFilterCategory,
  (newValue) => {
    if (isNull(props.games)) {
      filteredGames.value = []
      return
    }

    switch (newValue) {
      case GameFilterCategory.CAN_JOIN:
        filteredGames.value = props.games.filter((game) => {
          if (game.participants.some((participant) => participant.id === props.user.id)) {
            return false
          }

          return new Date(game.startDateTime) > new Date()
        })

        gamesFilterCategoryKey.value = 'pages.dashboard.games.filters.canJoin'
        break
      case GameFilterCategory.JOINED:
        filteredGames.value = props.games.filter((game) => {
          if (new Date(game.endDateTime) < new Date()) {
            return false
          }

          return game.participants.some((participant) => participant.id === props.user.id)
        })

        gamesFilterCategoryKey.value = 'pages.dashboard.games.filters.joined'
        break
      case GameFilterCategory.COMPLETED:
        filteredGames.value = props.games.filter((game) => {
          if (new Date(game.endDateTime) > new Date()) {
            return false
          }

          return game.participants.some((participant) => participant.id === props.user.id)
        })

        gamesFilterCategoryKey.value = 'pages.dashboard.games.filters.completed'
        break
      case GameFilterCategory.CREATED_BY_ME:
        filteredGames.value = props.games.filter((game) => {
          return game.createdBy.id === props.user.id
        })

        gamesFilterCategoryKey.value = 'pages.dashboard.games.filters.createdByMe'
        break
      case GameFilterCategory.ALL:
        filteredGames.value = props.games

        gamesFilterCategoryKey.value = 'pages.dashboard.games.filters.all'
        break
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="w-full">
    <h3 class="text-xl text-center font-bold mb-10">
      {{ $t('pages.dashboard.games.filters.title') }}
    </h3>
    <RadioButtonGroup
      v-model="gamesFilterCategory"
      orientation="vertical"
      :options="
        availableGameFilterCategories.map((category) => ({
          label: $t(`pages.dashboard.games.filters.${category}`),
          value: category
        }))
      "
      cy="game-filter"
    />
  </div>
</template>
