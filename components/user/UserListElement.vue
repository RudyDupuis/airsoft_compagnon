<script setup lang="ts">
import type { User } from '~/server/db/entities/User'
import { isNotNull } from '~/utils/types/typeGuards'

defineProps<{
  user: {
    id: User['id']
    pseudo: User['pseudo']
    reputation: User['reputation']
    createdAt: User['createdAt']
    gamesPlayed: User['gamesPlayed']
  }
  cy?: string
}>()
</script>

<template>
  <div class="flex justify-between flex-wrap-reverse max-w-md">
    <p class="flex flex-col gap-2">
      <span class="text-xl" :data-cy="`user-list-pseudo-${cy}`">{{ user.pseudo }}</span>
      <span>
        <font-awesome class="mr-2" :icon="['fas', 'trophy']" />
        <span v-if="isNotNull(user.reputation)"> {{ user.reputation }} / 5 </span>
        <span v-else>{{ $t('entities.user.no-reputation') }}</span>
      </span>
    </p>
    <p class="text-sm">{{ $t('entities.user.id') }}: {{ user.id }}</p>
  </div>
</template>
