<script setup lang="ts">
import { useId, ref } from 'vue'
import { isDefined, isNotBlankString } from '~/utils/types/typeGuards'

const inputValue = defineModel<string | number>({ required: true })
const isInputValid = ref(true)

defineEmits<{
  (e: 'blur'): void
}>()

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

const uniqueId = useId()

function validateInput() {
  isInputValid.value = true

  if (
    props.regex &&
    typeof inputValue.value !== 'number' &&
    isNotBlankString(inputValue.value) &&
    !props.regex.test(inputValue.value)
  ) {
    isInputValid.value = false
  }

  if (
    props.customStringValidation &&
    typeof inputValue.value !== 'number' &&
    isNotBlankString(inputValue.value) &&
    !props.customStringValidation(inputValue.value)
  ) {
    isInputValid.value = false
  }

  if (
    props.customNumberValidation &&
    typeof inputValue.value !== 'string' &&
    !props.customNumberValidation(inputValue.value)
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
