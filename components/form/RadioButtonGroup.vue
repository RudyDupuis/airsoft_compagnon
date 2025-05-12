<script setup lang="ts">
import { useId } from 'vue'

type EnumType = Record<string, string>

const selectedValue = defineModel<string>({ required: true })

defineProps<{
  enumObject: EnumType
  name: string
  labelKeyStart: string
  cy?: string
}>()

const uniqueId = useId()
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="enumValue in Object.values(enumObject)"
      :key="enumValue"
      class="flex items-center space-x-3"
    >
      <input
        type="radio"
        :id="`radio-button-${enumValue}-${uniqueId}`"
        :name="name"
        :value="enumValue"
        v-model="selectedValue"
        :data-cy="`radio-button-${enumValue}-${cy}`"
        class="relative appearance-none w-5 h-5 bg-on-background border-2 border-primary rounded-full cursor-pointer checked:bg-primary focus:outline-none"
      />
      <label :for="`radio-button-${enumValue}-${uniqueId}`" class="cursor-pointer">
        {{ $t(`${labelKeyStart}.${enumValue}`) }}
      </label>
    </div>
  </div>
</template>
