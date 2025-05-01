<script setup lang="ts">
import { GameType, PrivacyType, type Game } from '~/server/db/entities/Game'
import { displayDateTime } from '~/utils/formatting/date'
import { isNotBlankString } from '~/utils/types/typeGuards'

defineProps<{
  game: Game
}>()
</script>

<template>
  <div data-cy="game-infos-panel">
    <h3 data-cy="game-infos-panel-name" class="text-xl text-center font-bold mb-10">
      {{ game.name }}
    </h3>
    <div class="flex flex-col space-y-10">
      <p data-cy="game-infos-panel-type" class="text-center">
        {{ game.gameType === GameType.OP ? $t('game-infos-panel.op') : '' }}
        {{ game.gameType === GameType.DOMINICAL ? $t('game-infos-panel.dominical') : '' }}
        -
        {{ game.privacyType === PrivacyType.PRIVATE ? $t('game-infos-panel.private') : '' }}
        {{ game.privacyType === PrivacyType.PUBLIC ? $t('game-infos-panel.public') : '' }}
      </p>
      <p data-cy="game-infos-panel-price" class="text-center">
        <font-awesome :icon="['fas', 'coins']" /> {{ game.price }} €
      </p>
      <p data-cy="game-infos-panel-dates" class="text-center text-nowrap">
        <font-awesome :icon="['fas', 'calendar-days']" />
        {{ displayDateTime(new Date(game.startDateTime)) }}
        <br />
        <font-awesome :icon="['fas', 'calendar']" />
        {{ displayDateTime(new Date(game.endDateTime)) }}
      </p>
      <p data-cy="game-infos-panel-max-players" class="text-center">
        <font-awesome :icon="['fas', 'people-group']" />
        {{ game.participants.length }} /
        {{ game.maxPlayers }}
      </p>
      <a
        :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(game.address)}`"
        target="_blank"
        data-cy="game-infos-panel-address"
        class="text-center hover:text-primary"
      >
        <font-awesome :icon="['fas', 'map-location-dot']" /> {{ game.address }}
      </a>

      <div class="flex justify-center align-center space-x-5 pt-5">
        <p v-if="game.hasAmenities" data-cy="game-infos-panel-has-amenities" class="icon-with-text">
          <font-awesome :icon="['fas', 'toilet']" />
          <span>{{ $t('game-infos-panel.has-amenities') }}</span>
        </p>
        <p v-if="game.hasParking" data-cy="game-infos-panel-has-parking" class="icon-with-text">
          <font-awesome :icon="['fas', 'car']" />
          <span>{{ $t('game-infos-panel.has-parking') }}</span>
        </p>
        <p
          v-if="game.hasEquipmentRental"
          data-cy="game-infos-panel-has-equipement-rental"
          class="icon-with-text"
        >
          <font-awesome :icon="['fas', 'store']" />
          <span>{{ $t('game-infos-panel.has-equipement-rental') }}</span>
        </p>
      </div>
      <p v-if="isNotBlankString(game.description)" data-cy="game-infos-panel-description">
        {{ game.description }}
      </p>
      <p
        v-if="isNotBlankString(game.allowedConsumables)"
        data-cy="game-infos-panel-allowed-consumables"
        class="my-5"
      >
        <span class="underline">{{ $t('game-infos-panel.allowed-consumables') }}</span>
        {{ game.allowedConsumables }}
      </p>
      <slot></slot>
    </div>
  </div>
</template>
