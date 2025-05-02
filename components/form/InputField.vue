<script setup lang="ts">
import { useId, ref, computed } from 'vue'
import { isDefined, isNotBlankString } from '~/utils/types/typeGuards'

const props = withDefaults(
  defineProps<{
    placeholderKey: string
    type?: string
    required?: boolean
    cy?: string
    errorMessageKey?: string
    regex?: RegExp
    customStringValidation?: (value: string) => boolean
    customNumberValidation?: (value: number) => boolean
    min?: number
    max?: number
    step?: number
  }>(),
  {
    type: 'text',
    required: false
  }
)

defineEmits<{
  (e: 'blur'): void
}>()

const modelValue = defineModel<string | number>({ required: true })

const inputValue = computed({
  get: () => {
    // Format the date string to YYYY-MM-DDTHH:MM to work with the input
    if (
      (props.type === 'date' || props.type === 'datetime-local') &&
      typeof modelValue.value === 'string' &&
      isNotBlankString(modelValue.value)
    ) {
      const date = new Date(modelValue.value)
      const year = String(date.getFullYear()).padStart(4, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      if (props.type === 'date') {
        return `${year}-${month}-${day}`
      }
      return `${year}-${month}-${day}T${hours}:${minutes}`
    }
    return modelValue.value
  },
  set: (value) => {
    // Format the date string to ISO format to retrieve the timezone
    if (
      (props.type === 'date' || props.type === 'datetime-local') &&
      typeof value === 'string' &&
      isNotBlankString(value)
    ) {
      modelValue.value = new Date(value).toISOString()
      return
    }
    modelValue.value = value
  }
})

const isInputValid = ref(true)
const uniqueId = useId()

function validateInput() {
  isInputValid.value = true

  if (
    props.regex &&
    typeof modelValue.value !== 'number' &&
    isNotBlankString(modelValue.value) &&
    !props.regex.test(modelValue.value)
  ) {
    isInputValid.value = false
  }

  if (
    props.customStringValidation &&
    typeof modelValue.value !== 'number' &&
    isNotBlankString(modelValue.value) &&
    !props.customStringValidation(modelValue.value)
  ) {
    isInputValid.value = false
  }

  if (
    props.customNumberValidation &&
    typeof modelValue.value !== 'string' &&
    !props.customNumberValidation(modelValue.value)
  ) {
    isInputValid.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="uniqueId">{{ $t(placeholderKey) }} {{ required ? '*' : '' }}</label>
    <textarea
      v-if="type === 'textarea'"
      :id="uniqueId"
      v-model="inputValue"
      :placeholder="$t(placeholderKey)"
      :required="required"
      class="text-input resize-none h-32"
      :data-cy="`text-input-${cy}`"
      @blur="
        () => {
          validateInput()
          $emit('blur')
        }
      "
    ></textarea>
    <input
      v-else
      :id="uniqueId"
      v-model="inputValue"
      :type="type"
      :placeholder="$t(placeholderKey)"
      :required="required"
      :min="min"
      :max="max"
      :step="step"
      class="text-input"
      :data-cy="`text-input-${cy}`"
      @blur="
        () => {
          validateInput()
          $emit('blur')
        }
      "
    />
    <p
      v-if="isDefined(errorMessageKey) && !isInputValid"
      class="text-error"
      :data-cy="`text-input-${cy}-error`"
    >
      {{ $t(errorMessageKey) }}
    </p>
  </div>
</template>
