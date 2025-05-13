<script setup lang="ts">
import { useId } from 'vue'
import { isNotNull } from '~/utils/types/typeGuards'

type OptionType = {
  label: string
  value: string | number | null
}

const selectedValue = defineModel<string | number | null>({ required: true })

defineProps<{
  options: OptionType[]
  orientation: 'horizontal' | 'vertical'
  cy?: string
}>()

const uniqueId = useId()
</script>

<template>
  <div
    :class="{
      'flex flex-wrap items-center justify-center space-x-5': orientation === 'horizontal',
      'space-y-5': orientation === 'vertical'
    }"
  >
    <div
      v-for="option in options"
      :key="isNotNull(option.value) ? option.value : 'null'"
      class="flex items-center space-x-2"
    >
      <input
        type="radio"
        :id="`radio-button-${option.value}-${uniqueId}`"
        :value="option.value"
        v-model="selectedValue"
        :data-cy="`radio-button-${option.value}-${cy}`"
        class="relative appearance-none w-5 h-5 bg-on-background border-2 border-primary rounded-full cursor-pointer checked:bg-primary focus:outline-none"
      />
      <label :for="`radio-button-${option.value}-${uniqueId}`" class="cursor-pointer">
        {{ option.label }}
      </label>
    </div>
  </div>
</template>
