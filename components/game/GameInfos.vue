<script setup lang="ts">
import { ref, computed } from 'vue'
import { GameType, PrivacyType, type Game } from '~/server/db/entities/Game'
import { displayDateTime } from '~/utils/formatting/date'
import { isDefined, isNotBlankString } from '~/utils/types/typeGuards'

const props = defineProps<{
  game: Game
}>()

enum View {
  DETAILS = 'details',
  PARTICIPANTS = 'participants'
}
const view = ref<View>(View.DETAILS)
const selectedParticipantId = ref<number | undefined>(undefined)
const selectedParticipant = computed(() => {
  return props.game.participants.find((player) => player.id === selectedParticipantId.value)
})
</script>

<template>
  <div v-if="view === View.DETAILS" class="w-full" data-cy="game-infos-panel">
    <h3 data-cy="game-infos-panel-name" class="text-xl text-center font-bold mb-10">
      {{ game.name }}
    </h3>
    <div class="flex flex-col space-y-10">
      <p class="flex justify-between items-center">
        <span data-cy="game-infos-panel-types">
          {{ game.gameType === GameType.OP ? $t('entities.game.game-type.op') : '' }}
          {{ game.gameType === GameType.DOMINICAL ? $t('entities.game.game-type.dominical') : '' }}
          -
          {{
            game.privacyType === PrivacyType.PRIVATE ? $t('entities.game.privacy-type.private') : ''
          }}
          {{
            game.privacyType === PrivacyType.PUBLIC ? $t('entities.game.privacy-type.public') : ''
          }}
        </span>
        <span data-cy="game-infos-panel-price">
          <font-awesome :icon="['fas', 'coins']" /> {{ game.price }} €
        </span>
      </p>
      <div class="flex justify-center items-center space-x-5">
        <font-awesome :icon="['fas', 'calendar-days']" />
        <p data-cy="game-infos-panel-dates">
          {{ displayDateTime(new Date(game.startDateTime)) }}
          <br />
          {{ displayDateTime(new Date(game.endDateTime)) }}
        </p>
      </div>
      <div class="divider my-2"></div>
      <div class="space-y-5">
        <p class="flex justify-between items-center">
          <span data-cy="game-infos-panel-max-participants">
            <font-awesome :icon="['fas', 'people-group']" />
            {{ game.participants.length }} /
            {{ game.maxParticipants }}
          </span>
          <span data-cy="game-infos-panel-minimal-reputation">
            <font-awesome :icon="['fas', 'trophy']" />
            >
            {{ game.minimalReputation }} / 5
          </span>
        </p>
        <p v-if="game.allowedNotRated" data-cy="game-infos-panel-allowed-not-rated">
          <font-awesome :icon="['fas', 'seedling']" />
          {{ $t('entities.game.allowed-not-rated') }}
        </p>
        <p
          v-if="game.participants.length > 0"
          class="text-right text-secondary hover:text-primary cursor-pointer text-sm"
          @click="view = View.PARTICIPANTS"
          data-cy="game-infos-panel-participants-link"
        >
          <font-awesome :icon="['fas', 'right-to-bracket']" />
          <span class="underline ml-2">
            {{ $t('pages.dashboard.games.view-participants') }}
          </span>
        </p>
      </div>
      <div class="divider my-2"></div>
      <div class="space-y-5">
        <div data-cy="game-infos-panel-address" class="flex justify-center items-center space-x-5">
          <font-awesome :icon="['fas', 'map-location-dot']" />
          <p>{{ game.address }}</p>
        </div>
        <p
          class="text-right text-secondary hover:text-primary text-sm"
          data-cy="game-infos-panel-address-link"
        >
          <a
            :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(game.address)}`"
            target="_blank"
          >
            <font-awesome :icon="['fas', 'up-right-from-square']" />
            <span class="underline ml-2">
              {{ $t('pages.dashboard.games.go-to') }}
            </span>
          </a>
        </p>
      </div>
      <div class="divider my-2"></div>
      <div class="flex justify-center align-center space-x-5 pt-5">
        <p v-if="game.hasAmenities" data-cy="game-infos-panel-has-amenities" class="icon-with-text">
          <font-awesome :icon="['fas', 'toilet']" />
          <span>{{ $t('entities.game.has-amenities') }}</span>
        </p>
        <p v-if="game.hasParking" data-cy="game-infos-panel-has-parking" class="icon-with-text">
          <font-awesome :icon="['fas', 'car']" />
          <span>{{ $t('entities.game.has-parking') }}</span>
        </p>
        <p
          v-if="game.hasEquipmentRental"
          data-cy="game-infos-panel-has-equipment-rental"
          class="icon-with-text"
        >
          <font-awesome :icon="['fas', 'store']" />
          <span>{{ $t('entities.game.has-equipment-rental') }}</span>
        </p>
      </div>
      <div class="divider my-2"></div>
      <p v-if="isNotBlankString(game.description)" data-cy="game-infos-panel-description">
        {{ game.description }}
      </p>
      <p
        v-if="isNotBlankString(game.allowedConsumables)"
        data-cy="game-infos-panel-allowed-consumables"
        class="my-5"
      >
        <span class="underline">{{ $t('entities.game.allowed-consumables') }}:</span>
        <br />
        {{ game.allowedConsumables }}
      </p>
      <div class="divider my-2"></div>
      <div>
        <p class="underline">{{ $t('entities.game.created-by') }}:</p>
        <UserListElement
          :user="{
            id: game.createdBy.id,
            pseudo: game.createdBy.pseudo,
            computedReputation: game.createdBy.computedReputation
          }"
          cy="created-by"
        />
      </div>
      <div class="divider my-2"></div>
      <slot></slot>
    </div>
  </div>
  <div v-if="view === View.PARTICIPANTS" class="w-full">
    <template v-if="isDefined(selectedParticipantId) && isDefined(selectedParticipant)">
      <font-awesome
        :icon="['fas', 'left-long']"
        class="absolute top-0 left-0 m-5 text-2xl hover:text-primary cursor-pointer mb-5"
        @click="selectedParticipantId = undefined"
      />
      <UserCard
        :user="{
          id: selectedParticipant.id,
          pseudo: selectedParticipant.pseudo,
          computedReputation: selectedParticipant.computedReputation,
          createdAt: selectedParticipant.createdAt,
          gamesPlayedCount: selectedParticipant.gamesPlayedCount
        }"
      />
    </template>
    <template v-else>
      <font-awesome
        :icon="['fas', 'left-long']"
        class="absolute top-0 left-0 m-5 text-2xl hover:text-primary cursor-pointer mb-5"
        @click="view = View.DETAILS"
      />
      <h3 class="text-xl text-center font-bold mb-10">
        {{ $t('pages.dashboard.games.view-participants') }}
      </h3>
      <ul>
        <li
          v-for="participant in game.participants"
          :key="participant.id"
          class="px-10 py-5 border-b-2 hover:bg-muted cursor-pointer"
          @click="selectedParticipantId = participant.id"
        >
          <UserListElement
            :user="{
              id: participant.id,
              pseudo: participant.pseudo,
              computedReputation: participant.computedReputation
            }"
            :cy="`participant-${participant.id}`"
          />
        </li>
      </ul>
    </template>
  </div>
</template>
