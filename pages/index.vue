<script setup lang="ts">
import { usePageMeta } from '~/composables/usePageMeta'

usePageMeta('index')
</script>

<template>
  <section
    class="w-screen h-screen bg-cover bg-center bg-left flex items-center justify-center"
    style="background-image: url('/images/player-lying-in-the-grass-background.png')"
  >
    <div class="lg:w-5/12"></div>
    <div class="flex flex-col items-center justify-center gap-14 md:gap-20">
      <BigLogoSvg class="w-10/12 md:w-fit" />
      <pre class="text-lg md:text-2xl">{{ $t('index.subtitle') }}</pre>
      <a class="button" href="/">{{ $t('index.cta') }}</a>
    </div>
  </section>
</template>
