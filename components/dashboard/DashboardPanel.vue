<script setup lang="ts">
defineEmits<{
  (e: 'closePanel'): void
}>()
</script>

<template>
  <div
    class="modal lg:absolute lg:inset-auto lg:right-0 lg:top-0 lg:w-lg lg:bottom-0 lg:m-2 lg:rounded-xl lg:z-10"
  >
    <font-awesome
      :icon="['fas', 'circle-xmark']"
      @click="$emit('closePanel')"
      data-cy="close-dashboard-panel"
    />
    <slot></slot>
  </div>
</template>
