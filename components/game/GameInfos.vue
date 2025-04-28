<script setup lang="ts">
import { GameType, PrivacyType, type Game } from '~/server/db/entities/Game'
import { displayDateTime } from '~/utils/formatting/date'

defineProps<{
  game: Game
}>()
</script>

<template>
  <div>
    <h3 class="text-xl text-center font-bold mb-10">{{ game.name }}</h3>
    <div class="flex flex-col space-y-10">
      <p class="text-center">
        {{ game.gameType === GameType.OP ? $t('game-infos-panel.op') : '' }}
        {{ game.gameType === GameType.DOMINICAL ? $t('game-infos-panel.dominical') : '' }}
        -
        {{ game.privacyType === PrivacyType.PRIVATE ? $t('game-infos-panel.private') : '' }}
        {{ game.privacyType === PrivacyType.PUBLIC ? $t('game-infos-panel.public') : '' }}
      </p>
      <p class="text-center"><font-awesome :icon="['fas', 'coins']" /> {{ game.price }} €</p>
      <p class="text-center text-nowrap">
        <font-awesome :icon="['fas', 'calendar-days']" />
        {{ displayDateTime(new Date(game.startDateTime)) }}
        <br />
        <font-awesome :icon="['fas', 'calendar']" />
        {{ displayDateTime(new Date(game.endDateTime)) }}
      </p>
      <p class="text-center">
        <font-awesome :icon="['fas', 'people-group']" />
        {{ game.participants.length }} /
        {{ game.maxPlayers }}
      </p>
      <div class="flex justify-center align-center space-x-5 pt-5">
        <p v-if="game.hasAmenities" class="icon-with-text">
          <font-awesome :icon="['fas', 'toilet']" />
          <span>{{ $t('game-infos-panel.has-amenities') }}</span>
        </p>
        <p v-if="game.hasParking" class="icon-with-text">
          <font-awesome :icon="['fas', 'car']" />
          <span>{{ $t('game-infos-panel.has-parking') }}</span>
        </p>
        <p v-if="game.hasEquipmentRental" class="icon-with-text">
          <font-awesome :icon="['fas', 'store']" />
          <span>{{ $t('game-infos-panel.has-equipement-rental') }}</span>
        </p>
      </div>
      <p>{{ game.description }}</p>
      <p class="my-5">
        <span class="underline">{{ $t('game-infos-panel.allowed-consumables') }}</span>
        {{ game.allowedConsumables }}
      </p>
      <slot></slot>
    </div>
  </div>
</template>
