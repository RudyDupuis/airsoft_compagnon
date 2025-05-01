<script setup lang="ts">
import { useId } from 'vue'

const checkboxValue = defineModel<boolean>({ required: true })

withDefaults(
  defineProps<{
    labelKey: string
    cy?: string
  }>(),
  {}
)

const uniqueId = useId()
</script>

<template>
  <div class="flex items-center gap-2">
    <input
      :id="uniqueId"
      v-model="checkboxValue"
      type="checkbox"
      class="relative appearance-none w-5 h-5 bg-on-background border-2 border-primary rounded cursor-pointer checked:bg-primary focus:outline-none"
      :data-cy="`checkbox-${cy}`"
    />
    <label :for="uniqueId" class="cursor-pointer">{{ $t(labelKey) }}</label>
  </div>
</template>

<style scoped>
input:checked::after {
  content: '✓';
  @apply text-on-background font-bold absolute top-0 left-0 w-full h-full flex items-center justify-center;
}
</style>
