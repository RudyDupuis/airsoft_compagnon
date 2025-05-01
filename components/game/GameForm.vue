<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useGeocoding } from '~/composables/useGeocoding'
import { GameType, PrivacyType, ValidationType } from '~/server/db/entities/Game'
import { isNotNull } from '~/utils/types/typeGuards'
import { isInFuture, isPositiveNumber } from '~/utils/validations/methods'
import { nameRegex } from '~/utils/validations/regex'
import type { MarkerData } from '../MapComp.vue'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'submit'): void
}>()

const name = ref('')
const description = ref('')
const startDateTime = ref('')
const endDateTime = ref('')
const gameType = ref<GameType>(GameType.DOMINICAL)
const latitude = ref(46.603354)
const longitude = ref(1.888334)
const address = ref('')
const allowedConsumables = ref('')
const price = ref(1)
const validationType = ref<ValidationType>(ValidationType.AUTO)
const hasAmenities = ref(false)
const hasParking = ref(false)
const hasEquipmentRental = ref(false)
const privacyType = ref<PrivacyType>(PrivacyType.PUBLIC)
const maxPlayers = ref(1)

enum CoordinateEntryMode {
  Auto = 'auto',
  Manual = 'manual'
}
const coordinateEntryMode = ref<CoordinateEntryMode>(CoordinateEntryMode.Auto)

const {
  getCoordinates,
  isLoading: isLoadingGeocoding,
  error: geocodingError
} = useGeocoding(address)

async function generateCoordinates() {
  if (coordinateEntryMode.value === CoordinateEntryMode.Manual) {
    return
  }

  const coordinates = await getCoordinates()

  if (isNotNull(coordinates)) {
    latitude.value = coordinates.latitute
    longitude.value = coordinates.longitude
  }
}

const markersData = computed<MarkerData[]>(() => {
  return [
    {
      latitude: latitude.value,
      longitude: longitude.value,
      id: 0
    }
  ]
})

const {
  error,
  isLoading,
  isSuccess,
  execute: createGame
} = useFetchWithState('/api/games/create', {
  method: 'POST',
  body: computed(() => ({
    name: name.value,
    description: description.value,
    startDateTime: startDateTime.value,
    endDateTime: endDateTime.value,
    gameType: gameType.value,
    latitude: latitude.value,
    longitude: longitude.value,
    address: address.value,
    allowedConsumables: allowedConsumables.value,
    price: price.value,
    validationType: validationType.value,
    hasAmenities: hasAmenities.value,
    hasParking: hasParking.value,
    hasEquipmentRental: hasEquipmentRental.value,
    privacyType: privacyType.value,
    maxPlayers: maxPlayers.value
  }))
})

async function create() {
  if (new Date(startDateTime.value) > new Date(endDateTime.value)) {
    error.value = t('dashboard.create-game.start-date-after-end-date')
    return
  }
  await createGame()

  if (isSuccess.value) {
    emit('submit')
  }
}
</script>

<template>
  <div class="w-full">
    <h3 class="text-xl text-center font-bold mb-10">{{ $t('dashboard.create-game.title') }}</h3>
    <FormComp
      v-if="!isSuccess"
      submitButtonKey="dashboard.create-game.submit"
      :error="error"
      :isLoading="isLoading"
      :isSuccess="isSuccess"
      class="mx-auto"
      @submit="create"
    >
      <InputField
        v-model="name"
        placeholderKey="dashboard.create-game.name"
        :regex="nameRegex"
        error-message-key="dashboard.create-game.invalid-name"
        required
        cy="game-name"
      />
      <InputField
        v-model="description"
        placeholderKey="dashboard.create-game.description"
        type="textarea"
        cy="game-description"
      />
      <InputField
        v-model="startDateTime"
        placeholderKey="dashboard.create-game.start-date-time"
        :custom-string-validation="isInFuture"
        error-message-key="dashboard.create-game.invalid-date-time"
        type="datetime-local"
        required
        cy="game-start-date"
      />
      <InputField
        v-model="endDateTime"
        placeholderKey="dashboard.create-game.end-date-time"
        :custom-string-validation="isInFuture"
        error-message-key="dashboard.create-game.invalid-date-time"
        type="datetime-local"
        required
        cy="game-end-date"
      />
      <SelectField
        v-model="gameType"
        placeholderKey="dashboard.create-game.game-type"
        :options="[
          { value: GameType.DOMINICAL, label: $t('dashboard.create-game.dominical') },
          { value: GameType.OP, label: $t('dashboard.create-game.op') }
        ]"
        required
        cy="game-type"
      />
      <InputField
        v-model="address"
        placeholderKey="dashboard.create-game.address"
        required
        cy="game-address"
        @blur="generateCoordinates()"
      />
      <button
        @click.prevent="
          coordinateEntryMode =
            coordinateEntryMode === CoordinateEntryMode.Auto
              ? CoordinateEntryMode.Manual
              : CoordinateEntryMode.Auto
        "
        class="hover:text-primary cursor-pointer underline"
      >
        {{
          coordinateEntryMode === CoordinateEntryMode.Auto
            ? $t('dashboard.create-game.coordinate-entry-mode-auto-button')
            : $t('dashboard.create-game.coordinate-entry-mode-manual-button')
        }}
      </button>
      <div v-if="coordinateEntryMode === CoordinateEntryMode.Auto" class="w-full h-40 relative">
        <div
          v-if="isLoadingGeocoding || isNotNull(geocodingError)"
          class="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-opacity-70 bg-background p-10"
        >
          <FetchDataComp :isLoading="isLoadingGeocoding" :error="geocodingError" />
        </div>
        <MapComp :markersData="markersData" />
      </div>
      <template v-if="coordinateEntryMode === CoordinateEntryMode.Manual">
        <InputField
          v-model="latitude"
          placeholderKey="dashboard.create-game.latitude"
          :step="0.0000001"
          type="number"
          required
          cy="latitude"
        />
        <InputField
          v-model="longitude"
          placeholderKey="dashboard.create-game.longitude"
          :step="0.0000001"
          type="number"
          required
          cy="longitude"
        />
      </template>
      <InputField
        v-model="allowedConsumables"
        placeholderKey="dashboard.create-game.allowed-consumables"
        type="textarea"
        cy="allowed-consumables"
      />
      <InputField
        v-model="price"
        placeholderKey="dashboard.create-game.price"
        :custom-number-validation="isPositiveNumber"
        error-message-key="dashboard.create-game.invalid-price"
        type="number"
        :min="1"
        :step="0.01"
        :max="500"
        required
        cy="game-price"
      />
      <SelectField
        v-model="validationType"
        placeholderKey="dashboard.create-game.validation-type"
        :options="[
          { value: ValidationType.AUTO, label: $t('dashboard.create-game.auto') },
          { value: ValidationType.MANUAL, label: $t('dashboard.create-game.manual') }
        ]"
        required
        cy="validation-type"
      />
      <CheckboxField
        v-model="hasAmenities"
        labelKey="dashboard.create-game.has-amenities"
        cy="has-amenities"
      />
      <CheckboxField
        v-model="hasParking"
        labelKey="dashboard.create-game.has-parking"
        cy="has-parking"
      />
      <CheckboxField
        v-model="hasEquipmentRental"
        labelKey="dashboard.create-game.has-equipement-rental"
        cy="has-equipment-rental"
      />
      <SelectField
        v-model="privacyType"
        placeholderKey="dashboard.create-game.privacy-type"
        :options="[
          { value: PrivacyType.PUBLIC, label: $t('dashboard.create-game.public') },
          { value: PrivacyType.PRIVATE, label: $t('dashboard.create-game.private') }
        ]"
        required
        cy="privacy-type"
      />
      <InputField
        v-model="maxPlayers"
        placeholderKey="dashboard.create-game.max-players"
        :custom-number-validation="isPositiveNumber"
        error-message-key="dashboard.create-game.invalid-max-players"
        type="number"
        :min="1"
        required
        cy="max-players"
      />
    </FormComp>
  </div>
</template>
