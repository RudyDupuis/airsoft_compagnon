<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useGeocoding } from '~/composables/useGeocoding'
import { Game, GameType, PrivacyType, ValidationType } from '~/server/db/entities/Game'
import { isDefined, isNotNull } from '~/utils/types/typeGuards'
import { isInFuture, isPositiveNumber } from '~/utils/validations/methods'
import { nameRegex } from '~/utils/validations/regex'
import type { MarkerData } from '../MapComp.vue'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'submit'): void
  (e: 'remove'): void
}>()

const props = defineProps<{
  gameToUpdate?: Game
}>()

const name = ref(props.gameToUpdate?.name ?? '')
const description = ref(props.gameToUpdate?.description ?? '')
const startDateTime = ref(props.gameToUpdate ? String(props.gameToUpdate.startDateTime) : '')
const endDateTime = ref(props.gameToUpdate ? String(props.gameToUpdate.endDateTime) : '')
const gameType = ref<GameType>(props.gameToUpdate?.gameType ?? GameType.DOMINICAL)
const latitude = ref(props.gameToUpdate?.latitude ?? 46.603354)
const longitude = ref(props.gameToUpdate?.longitude ?? 1.888334)
const address = ref(props.gameToUpdate?.address ?? '')
const allowedConsumables = ref(props.gameToUpdate?.allowedConsumables ?? '')
const price = ref(props.gameToUpdate?.price ?? 1)
const validationType = ref<ValidationType>(
  props.gameToUpdate?.validationType ?? ValidationType.AUTO
)
const hasAmenities = ref(props.gameToUpdate?.hasAmenities ?? false)
const hasParking = ref(props.gameToUpdate?.hasParking ?? false)
const hasEquipmentRental = ref(props.gameToUpdate?.hasEquipmentRental ?? false)
const privacyType = ref<PrivacyType>(props.gameToUpdate?.privacyType ?? PrivacyType.PUBLIC)
const maxPlayers = ref(props.gameToUpdate?.maxPlayers ?? 1)

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
  execute: createOrUpdateGame
} = useFetchWithState(
  `/api/games/${isDefined(props.gameToUpdate) ? props.gameToUpdate.id : 'create'}`,
  {
    method: isDefined(props.gameToUpdate) ? 'PUT' : 'POST',
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
  }
)

async function submit() {
  if (new Date(startDateTime.value) > new Date(endDateTime.value)) {
    error.value = t('dashboard.game-form.start-date-after-end-date')
    return
  }

  await createOrUpdateGame()

  if (isSuccess.value) {
    emit('submit')
  }
}

const {
  isSuccess: removeIsSuccess,
  isLoading: removeIsLoading,
  execute: removeGame
} = useFetchWithState(`/api/games/${props.gameToUpdate?.id}`, {
  method: 'DELETE'
})

const openRemoveDialog = ref(false)
async function remove() {
  await removeGame()

  if (removeIsSuccess.value) {
    emit('remove')
  }
}
</script>

<template>
  <div class="w-full">
    <h3 class="text-xl text-center font-bold mb-10">
      {{
        isDefined(gameToUpdate)
          ? $t('dashboard.game-form.update-title')
          : $t('dashboard.game-form.create-title')
      }}
    </h3>
    <FormComp
      v-if="!isSuccess"
      :submitButtonKey="
        isDefined(gameToUpdate)
          ? 'dashboard.game-form.update-submit'
          : 'dashboard.game-form.create-submit'
      "
      :error="error"
      :isLoading="isLoading"
      :isSuccess="isSuccess"
      class="mx-auto"
      @submit="submit"
    >
      <InputField
        v-model="name"
        placeholderKey="dashboard.game-form.name"
        :regex="nameRegex"
        error-message-key="dashboard.game-form.invalid-name"
        required
        cy="game-name"
      />
      <InputField
        v-model="description"
        placeholderKey="dashboard.game-form.description"
        type="textarea"
        cy="game-description"
      />
      <InputField
        v-model="startDateTime"
        placeholderKey="dashboard.game-form.start-date-time"
        :custom-string-validation="isInFuture"
        error-message-key="dashboard.game-form.invalid-date-time"
        type="datetime-local"
        required
        cy="game-start-date"
      />
      <InputField
        v-model="endDateTime"
        placeholderKey="dashboard.game-form.end-date-time"
        :custom-string-validation="isInFuture"
        error-message-key="dashboard.game-form.invalid-date-time"
        type="datetime-local"
        required
        cy="game-end-date"
      />
      <SelectField
        v-model="gameType"
        placeholderKey="dashboard.game-form.game-type"
        :options="[
          { value: GameType.DOMINICAL, label: $t('dashboard.game-form.dominical') },
          { value: GameType.OP, label: $t('dashboard.game-form.op') }
        ]"
        required
        cy="game-type"
      />
      <InputField
        v-model="address"
        placeholderKey="dashboard.game-form.address"
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
            ? $t('dashboard.game-form.coordinate-entry-mode-auto-button')
            : $t('dashboard.game-form.coordinate-entry-mode-manual-button')
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
          placeholderKey="dashboard.game-form.latitude"
          :step="0.0000001"
          type="number"
          required
          cy="latitude"
        />
        <InputField
          v-model="longitude"
          placeholderKey="dashboard.game-form.longitude"
          :step="0.0000001"
          type="number"
          required
          cy="longitude"
        />
      </template>
      <InputField
        v-model="allowedConsumables"
        placeholderKey="dashboard.game-form.allowed-consumables"
        type="textarea"
        cy="game-allowed-consumables"
      />
      <InputField
        v-model="price"
        placeholderKey="dashboard.game-form.price"
        :custom-number-validation="isPositiveNumber"
        error-message-key="dashboard.game-form.invalid-price"
        type="number"
        :min="1"
        :step="0.01"
        :max="500"
        required
        cy="game-price"
      />
      <SelectField
        v-model="validationType"
        placeholderKey="dashboard.game-form.validation-type"
        :options="[
          { value: ValidationType.AUTO, label: $t('dashboard.game-form.auto') },
          { value: ValidationType.MANUAL, label: $t('dashboard.game-form.manual') }
        ]"
        required
        cy="game-validation-type"
      />
      <CheckboxField
        v-model="hasAmenities"
        labelKey="dashboard.game-form.has-amenities"
        cy="game-has-amenities"
      />
      <CheckboxField
        v-model="hasParking"
        labelKey="dashboard.game-form.has-parking"
        cy="game-has-parking"
      />
      <CheckboxField
        v-model="hasEquipmentRental"
        labelKey="dashboard.game-form.has-equipment-rental"
        cy="game-has-equipment-rental"
      />
      <SelectField
        v-model="privacyType"
        placeholderKey="dashboard.game-form.privacy-type"
        :options="[
          { value: PrivacyType.PUBLIC, label: $t('dashboard.game-form.public') },
          { value: PrivacyType.PRIVATE, label: $t('dashboard.game-form.private') }
        ]"
        required
        cy="game-privacy-type"
      />
      <InputField
        v-model="maxPlayers"
        placeholderKey="dashboard.game-form.max-players"
        :custom-number-validation="isPositiveNumber"
        error-message-key="dashboard.game-form.invalid-max-players"
        type="number"
        :min="1"
        required
        cy="game-max-players"
      />
    </FormComp>
    <div
      v-if="openRemoveDialog"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background bg-opacity-50"
    >
      <div class="container" data-cy="game-form-delete-confirm-modal">
        <pre class="medium-title text-wrap">{{ $t('dashboard.game-form.confirm-delete') }}</pre>
        <div class="flex flex-col md:flex-row gap-8 mt-4">
          <button
            v-if="isDefined(gameToUpdate)"
            class="button"
            :disabled="removeIsLoading"
            @click="remove"
            data-cy="game-form-delete-button"
          >
            <FetchDataComp v-if="removeIsLoading" :isLoading="removeIsLoading" :error="error" />
            <template v-else>{{ $t('dashboard.game-form.delete') }}</template>
          </button>
          <button
            class="button-secondary"
            :disabled="removeIsLoading"
            @click="openRemoveDialog = false"
          >
            {{ $t('dashboard.game-form.cancel') }}
          </button>
        </div>
      </div>
    </div>
    <button
      v-if="isDefined(gameToUpdate)"
      class="button-secondary w-full"
      @click="openRemoveDialog = true"
      data-cy="game-form-delete-confirm-modal-button"
    >
      {{ $t('dashboard.game-form.open-delete-dialog') }}
    </button>
  </div>
</template>
