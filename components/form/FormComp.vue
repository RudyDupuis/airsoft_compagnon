<script setup lang="ts">
import { isNotNull } from '~/utils/types/typeGuards'

defineProps<{
  submitButtonKey: string
  error: string | null
  isLoading: boolean
}>()

defineEmits<{
  (e: 'submit'): void
}>()
</script>

<template>
  <form @submit.prevent="$emit('submit')" class="flex flex-col gap-8 w-full md:w-96" data-cy="form">
    <slot></slot>

    <div
      v-if="isNotNull(error)"
      class="border border-2 px-4 py-3 rounded text-center"
      data-cy="form-error"
    >
      {{ error }}
    </div>

    <button v-if="!isLoading" class="button my-5" data-cy="form-submit-button">
      {{ $t(submitButtonKey) }}
    </button>
    <button v-else class="button my-5" disabled>
      <font-awesome class="text-2xl animate-spin" :icon="['fas', 'spinner']" />
    </button>
  </form>
</template>
