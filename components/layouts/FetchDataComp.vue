<script setup lang="ts">
import { isNotNull } from '~/utils/types/typeGuards'

defineProps<{
  error: string | null
  isLoading: boolean
}>()
</script>

<template>
  <div v-if="isNotNull(error)" class="border border-2 px-4 py-3 rounded text-center">
    {{ error }}
  </div>

  <font-awesome v-if="isLoading" class="text-2xl animate-spin" :icon="['fas', 'spinner']" />
</template>
