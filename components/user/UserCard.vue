<script setup lang="ts">
import type { User } from '~/server/db/entities/User'
import { displayDate } from '~/utils/formatting/date'
import { isNotNull } from '~/utils/types/typeGuards'

defineProps<{
  user: {
    id: User['id']
    pseudo: User['pseudo']
    reputation: User['reputation']
    createdAt: User['createdAt']
    gamesPlayed: User['gamesPlayed']
  }
}>()
</script>

<template>
  <div class="flex flex-col gap-12">
    <div class="flex items-center justify-center gap-8">
      <font-awesome class="text-7xl" :icon="['fas', 'person-rifle']" />
      <div>
        <p class="text-xl" data-cy="user-card-pseudo">{{ user.pseudo }}</p>
        <p>
          <font-awesome class="mr-2" :icon="['fas', 'trophy']" />
          <span v-if="isNotNull(user.reputation)" data-cy="user-card-reputation">
            {{ user.reputation }} / 5
          </span>
          <span v-else data-cy="user-card-reputation">{{ $t('entities.user.no-reputation') }}</span>
        </p>
      </div>
    </div>
    <div>
      <p>
        <span class="inline-block w-8">
          <font-awesome :icon="['fas', 'fingerprint']" />
        </span>
        <span class="text-sm" data-cy="user-card-id"
          >{{ $t('entities.user.id') }}: {{ user.id }}</span
        >
      </p>
      <p>
        <span class="inline-block w-8">
          <font-awesome class="mr-2" :icon="['fas', 'cake-candles']" />
        </span>
        <span class="text-sm" data-cy="user-card-member-since">
          {{ $t('entities.user.member-since') }} {{ displayDate(new Date(user.createdAt)) }}
        </span>
      </p>
      <p>
        <span class="inline-block w-8">
          <font-awesome class="mr-2" :icon="['fas', 'gamepad']" />
        </span>
        <span class="text-sm" data-cy="user-card-games-played"
          >{{ user.gamesPlayed }} {{ $t('entities.user.games-played') }}</span
        >
      </p>
    </div>
  </div>
</template>
