<script setup lang="ts">
import { useUserSession, definePageMeta } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed, ref } from 'vue'
import { isBlankString, isDefined, isNull } from '~/utils/types/typeGuards'
import type { User } from '~/server/db/entities/User'

definePageMeta({
  middleware: ['authenticated']
})
usePageMeta('dashboard.players')

const { user } = useUserSession()

const {
  data: players,
  error,
  isLoading,
  isSuccess,
  execute: executeFetchPlayers
} = useFetchWithState<User[]>('/api/users')
executeFetchPlayers()

const searchTerm = ref('')
const filteredPlayers = computed(() => {
  if (isNull(players.value)) {
    return []
  }

  if (isBlankString(searchTerm.value)) {
    return players.value
  }

  if (!isNaN(Number(searchTerm.value))) {
    return players.value.filter((player) => player.id.toString().includes(searchTerm.value))
  }

  return players.value.filter((player) =>
    player.pseudo.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

const selectedPlayerId = ref<number | undefined>()
const selectedPlayer = computed(() => {
  if (isNull(players.value)) {
    return undefined
  }

  return players.value.find((player) => player.id === selectedPlayerId.value)
})
</script>

<template>
  <section v-if="isSuccess" class="relative fullscreen-without-navbar">
    <div class="p-10 border-b-4">
      <input
        v-model="searchTerm"
        type="text"
        class="text-input max-w-xl"
        :placeholder="$t('pages.dashboard.players.search-placeholder')"
        data-cy="player-search-input"
      />
    </div>
    <ul class="w-full">
      <li
        v-for="player in filteredPlayers"
        :key="player.id"
        class="px-10 py-5 border-b-2 hover:bg-muted cursor-pointer"
        @click="selectedPlayerId = player.id"
        :data-cy="`player-list-item-${player.id}`"
      >
        <UserListElement
          :user="{
            id: player.id,
            pseudo: player.pseudo,
            computedReputation: player.computedReputation
          }"
          :cy="`player-${player.id}`"
        />
      </li>
    </ul>
    <DashboardPanel
      v-if="isDefined(selectedPlayerId) && isDefined(selectedPlayer)"
      @close-panel="selectedPlayerId = undefined"
    >
      <div class="flex flex-col gap-20">
        <UserCard
          :user="{
            id: selectedPlayer.id,
            pseudo: selectedPlayer.pseudo,
            computedReputation: selectedPlayer.computedReputation,
            createdAt: selectedPlayer.createdAt,
            gamesPlayedCount: selectedPlayer.gamesPlayedCount
          }"
        />
        <UserAdmin v-if="user.isAdmin" :user="selectedPlayer" @user-updated="executeFetchPlayers" />
      </div>
    </DashboardPanel>
    <DashboardMenu />
  </section>
  <section v-else class="flex flex-col items-center justify-center fullscreen-without-navbar">
    <FetchDataComp :error="error" :isLoading="isLoading" />
  </section>
</template>
