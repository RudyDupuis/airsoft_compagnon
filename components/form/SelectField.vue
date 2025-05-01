<script setup lang="ts">
import { useId } from 'vue'

const selectValue = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    placeholderKey: string
    required?: boolean
    cy?: string
    options: Array<{ value: string; label: string }>
  }>(),
  {
    required: false
  }
)

const uniqueId = useId()
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="uniqueId">{{ $t(placeholderKey) }} {{ required ? '*' : '' }}</label>
    <select
      :id="uniqueId"
      v-model="selectValue"
      :required="required"
      class="text-input"
      :data-cy="`select-input-${cy}`"
    >
      <option value="" disabled>{{ $t(placeholderKey) }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :data-cy="`select-option-${cy}-${option.label}`"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
