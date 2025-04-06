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
      <pre class="text-lg md:text-2xl">{{ $t('index.hero-banner.subtitle') }}</pre>
      <a class="button" href="/#find-a-game">{{ $t('index.hero-banner.cta') }}</a>
    </div>
  </section>
  <section id="find-a-game">
    <h2 class="large-title p-10">{{ $t('index.find-a-game.title') }}</h2>
    <p class="text-center p-20">Work in progress</p>
  </section>
  <section
    class="w-screen bg-cover bg-center flex items-center justify-center xl:justify-between"
    style="background-image: url('/images/player-in-forest-background.png')"
  >
    <div></div>
    <div class="px-10 xl:pr-40 py-40 xl:py-60 xl:w-5/12">
      <h3 class="font-bold text-2xl py-8">{{ $t('index.infos.title1') }}</h3>
      <p>{{ $t('index.infos.description1') }}</p>
      <h3 class="font-bold text-2xl py-8">{{ $t('index.infos.title2') }}</h3>
      <p>{{ $t('index.infos.description2') }}</p>
      <h3 class="font-bold text-2xl py-8">{{ $t('index.infos.title3') }}</h3>
      <p>{{ $t('index.infos.description3') }}</p>
    </div>
  </section>
</template>
