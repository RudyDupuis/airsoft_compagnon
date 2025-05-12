<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { useGeocoding } from '~/composables/useGeocoding'
import { Game, GameType, PrivacyType, ValidationType } from '~/server/db/entities/Game'
import { isDefined, isNotNull, isNull } from '~/utils/types/typeGuards'
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
const maxParticipants = ref(props.gameToUpdate?.maxParticipants ?? 1)

enum CoordinateEntryMode {
  AUTO = 'auto',
  MANUAL = 'manual'
}
const coordinateEntryMode = ref<CoordinateEntryMode>(CoordinateEntryMode.AUTO)

const {
  getCoordinates,
  isLoading: isLoadingGeocoding,
  error: geocodingError
} = useGeocoding(address)

async function generateCoordinates() {
  if (coordinateEntryMode.value === CoordinateEntryMode.MANUAL) {
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
} = useFetchWithState<Game>(
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
      maxParticipants: maxParticipants.value
    }))
  }
)

async function submit() {
  if (new Date(startDateTime.value) > new Date(endDateTime.value)) {
    error.value = t('entities.game.errors.start-date-after-end-date')
    return
  }

  await createOrUpdateGame()

  if (isSuccess.value) {
    emit('submit')
  }
}

const {
  error: removeError,
  isSuccess: isRemoveSuccess,
  isLoading: isRemoveLoading,
  execute: removeGame
} = useFetchWithState(`/api/games/${props.gameToUpdate?.id}`, {
  method: 'DELETE'
})

const openRemoveDialog = ref(false)
async function remove() {
  await removeGame()

  if (isRemoveSuccess.value) {
    emit('remove')
  }
}
</script>

<template>
  <div class="w-full">
    <h3 class="text-xl text-center font-bold mb-10">
      {{
        isDefined(gameToUpdate) ? $t('pages.dashboard.games.edit') : $t('pages.dashboard.games.add')
      }}
    </h3>
    <FormComp
      v-if="!isSuccess"
      :submitButtonKey="isDefined(gameToUpdate) ? 'common.form.edit' : 'common.form.add'"
      :error="error"
      :isLoading="isLoading"
      class="mx-auto"
      @submit="submit"
    >
      <InputField
        v-model="name"
        placeholderKey="entities.game.name"
        :regex="nameRegex"
        error-message-key="entities.game.errors.invalid-name"
        required
        cy="game-name"
      />
      <InputField
        v-model="description"
        placeholderKey="entities.game.description"
        type="textarea"
        cy="game-description"
      />
      <InputField
        v-model="startDateTime"
        placeholderKey="entities.game.start-date"
        :custom-string-validation="isInFuture"
        error-message-key="entities.game.errors.invalid-date-time"
        type="datetime-local"
        required
        cy="game-start-date"
      />
      <InputField
        v-model="endDateTime"
        placeholderKey="entities.game.end-date"
        :custom-string-validation="isInFuture"
        error-message-key="entities.game.errors.invalid-date-time"
        type="datetime-local"
        required
        cy="game-end-date"
      />
      <SelectField
        v-model="gameType"
        placeholderKey="entities.game.game-type.title"
        :options="[
          { value: GameType.DOMINICAL, label: $t('entities.game.game-type.dominical') },
          { value: GameType.OP, label: $t('entities.game.game-type.op') }
        ]"
        required
        cy="game-type"
      />
      <InputField
        v-model="address"
        placeholderKey="entities.game.address"
        required
        cy="game-address"
        @blur="generateCoordinates()"
      />
      <button
        @click.prevent="
          coordinateEntryMode =
            coordinateEntryMode === CoordinateEntryMode.AUTO
              ? CoordinateEntryMode.MANUAL
              : CoordinateEntryMode.AUTO
        "
        class="hover:text-primary cursor-pointer underline"
      >
        {{
          coordinateEntryMode === CoordinateEntryMode.AUTO
            ? $t('pages.dashboard.games.coordinate-entry-mode.auto-button')
            : $t('pages.dashboard.games.coordinate-entry-mode.manual-button')
        }}
      </button>
      <div v-if="coordinateEntryMode === CoordinateEntryMode.AUTO" class="w-full h-40 relative">
        <div
          v-if="isLoadingGeocoding || isNotNull(geocodingError)"
          class="absolute inset-0 z-10 w-full h-full flex items-center justify-center bg-opacity-70 bg-background p-10"
        >
          <FetchDataComp :isLoading="isLoadingGeocoding" :error="geocodingError" />
        </div>
        <MapComp :markersData="markersData" />
      </div>
      <template v-if="coordinateEntryMode === CoordinateEntryMode.MANUAL">
        <InputField
          v-model="latitude"
          placeholderKey="entities.game.latitude"
          :step="0.0000001"
          type="number"
          required
          cy="latitude"
        />
        <InputField
          v-model="longitude"
          placeholderKey="entities.game.longitude"
          :step="0.0000001"
          type="number"
          required
          cy="longitude"
        />
      </template>
      <InputField
        v-model="allowedConsumables"
        placeholderKey="entities.game.allowed-consumables"
        type="textarea"
        cy="game-allowed-consumables"
      />
      <InputField
        v-model="price"
        placeholderKey="entities.game.price"
        :custom-number-validation="isPositiveNumber"
        error-message-key="entities.game.errors.invalid-price"
        type="number"
        :min="1"
        :step="0.01"
        :max="500"
        required
        cy="game-price"
      />
      <SelectField
        v-model="validationType"
        placeholderKey="entities.game.validation-type.title"
        :options="[
          { value: ValidationType.AUTO, label: $t('entities.game.validation-type.auto') },
          { value: ValidationType.MANUAL, label: $t('entities.game.validation-type.manual') }
        ]"
        required
        cy="game-validation-type"
      />
      <CheckboxField
        v-model="hasAmenities"
        labelKey="entities.game.has-amenities"
        cy="game-has-amenities"
      />
      <CheckboxField
        v-model="hasParking"
        labelKey="entities.game.has-parking"
        cy="game-has-parking"
      />
      <CheckboxField
        v-model="hasEquipmentRental"
        labelKey="entities.game.has-equipment-rental"
        cy="game-has-equipment-rental"
      />
      <SelectField
        v-model="privacyType"
        placeholderKey="entities.game.privacy-type.title"
        :options="[
          { value: PrivacyType.PUBLIC, label: $t('entities.game.privacy-type.public') },
          { value: PrivacyType.PRIVATE, label: $t('entities.game.privacy-type.private') }
        ]"
        required
        cy="game-privacy-type"
      />
      <InputField
        v-model="maxParticipants"
        placeholderKey="entities.game.max-participants"
        :custom-number-validation="isPositiveNumber"
        error-message-key="entities.game.errors.invalid-max-participants"
        type="number"
        :min="1"
        required
        cy="game-max-participants"
      />
    </FormComp>
    <div
      v-if="openRemoveDialog"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background bg-opacity-50"
    >
      <div class="container" data-cy="game-form-delete-confirm-modal">
        <pre class="medium-title text-wrap">{{ $t('common.form.confirm-delete') }}</pre>
        <div class="flex flex-col md:flex-row gap-8 mt-4">
          <button
            v-if="isDefined(gameToUpdate)"
            class="button"
            :disabled="isRemoveLoading"
            @click="remove"
            data-cy="game-form-delete-button"
          >
            <FetchDataComp :isLoading="isRemoveLoading" :error="removeError" />
            <template v-if="!isRemoveLoading && isNull(removeError)">{{
              $t('common.form.delete')
            }}</template>
          </button>
          <button
            class="button-secondary"
            :disabled="isRemoveLoading"
            @click="openRemoveDialog = false"
          >
            {{ $t('common.form.cancel') }}
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
      {{ $t('common.form.delete') }}
    </button>
  </div>
</template>
