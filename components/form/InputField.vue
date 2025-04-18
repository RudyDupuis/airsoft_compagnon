<script setup lang="ts">
import { useId, ref } from 'vue'
import { isDefined, isNotBlankString } from '~/utils/types/typeGuards'

const inputValue = defineModel<string>({ required: true })
const isInputValid = ref(true)

const props = withDefaults(
  defineProps<{
    placeholderKey: string
    type?: string
    required?: boolean
    errorMessageKey?: string
    regex?: RegExp
    customValidation?: (value: string) => boolean
  }>(),
  {
    type: 'text',
    required: false
  }
)

const uniqueId = useId()

function validateInput() {
  isInputValid.value = true

  if (props.regex && isNotBlankString(inputValue.value) && !props.regex.test(inputValue.value)) {
    isInputValid.value = false
  }

  if (
    props.customValidation &&
    isNotBlankString(inputValue.value) &&
    !props.customValidation(inputValue.value)
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
      @blur="validateInput"
    ></textarea>
    <input
      v-else
      :id="uniqueId"
      v-model="inputValue"
      :type="type"
      :placeholder="$t(placeholderKey)"
      :required="required"
      class="text-input"
      @blur="validateInput"
    />
    <p v-if="isDefined(errorMessageKey) && !isInputValid" class="text-error">
      {{ $t(errorMessageKey) }}
    </p>
  </div>
</template>
