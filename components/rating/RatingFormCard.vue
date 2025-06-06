<script setup lang="ts">
import type { Rating } from '~/server/db/entities/Rating'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { ref, computed } from 'vue'
import { isNull } from '~/utils/types/typeGuards'

const props = defineProps<{
  pendingRating: Rating
}>()

const emit = defineEmits<{
  (e: 'rating-sent'): void
}>()

const rating = ref(5)

const {
  error,
  isLoading,
  isSuccess,
  execute: executeSentRating
} = useFetchWithState<Rating>(`/api/ratings/${props.pendingRating.id}`, {
  method: 'PUT',
  body: computed(() => ({
    rating: rating.value
  }))
})

async function putRating() {
  await executeSentRating()

  if (isSuccess) {
    emit('rating-sent')
  }
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <h2 class="medium-title" :data-cy="`rating-form-card-title-${pendingRating.id}`">
      {{ pendingRating.game.name }}
    </h2>
    <UserListElement
      :user="{
        id: pendingRating.toUser.id,
        pseudo: pendingRating.toUser.pseudo,
        computedReputation: pendingRating.toUser.computedReputation
      }"
      :cy="`rating-form-card-${pendingRating.id}`"
    />
    <RadioButtonGroup
      v-model="rating"
      orientation="horizontal"
      :options="[
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' }
      ]"
      :cy="`rating-form-card-${pendingRating.id}`"
    />
    <button
      class="button"
      :disabled="isLoading"
      @click="putRating()"
      :cy="`rating-form-card-submit-${pendingRating.id}`"
    >
      <FetchDataComp :isLoading="isLoading" :error="error" />
      <template v-if="!isLoading && isNull(error)">
        {{ $t('pages.rate-participants.submit') }}
      </template>
    </button>
  </div>
</template>
