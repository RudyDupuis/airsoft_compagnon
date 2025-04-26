<script setup lang="ts">
import { useLocalePath } from '#imports'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed, ref } from 'vue'
import { GameType, PrivacyType, type Game } from '~/server/db/entities/Game'
import type { MarkerData } from '~/components/MapComp.vue'
import { isDefined, isNull } from '~/utils/types/typeGuards'
import { displayDateTime } from '~/utils/formatting/date'

usePageMeta('index')
const localePath = useLocalePath()

const {
  data: games,
  error,
  isLoading,
  isSuccess,
  execute: fetchGames
} = useFetchWithState<Game[]>('/api/games')
fetchGames()

const markersData = computed<MarkerData[]>(() => {
  if (isNull(games.value)) {
    return []
  }

  return games.value.map((game) => ({
    latitude: game.latitude,
    longitude: game.longitude,
    id: game.id
  }))
})

const selectedGameId = ref<number | undefined>()

const selectedGame = computed(() => {
  if (isNull(games.value)) {
    return undefined
  }

  return games.value.find((game) => game.id === selectedGameId.value)
})
</script>

<template>
  <section class="fullscreen-player-lying-in-the-grass-background">
    <div class="lg:w-5/12"></div>
    <div class="flex flex-col items-center justify-center gap-14 md:gap-20">
      <BigLogoSvg class="w-10/12 md:w-fit" />
      <pre class="text-lg md:text-2xl" data-cy="hero-banner-subtitle">{{
        $t('index.hero-banner.subtitle')
      }}</pre>
      <a class="button" href="/#find-a-game" data-cy="hero-banner-cta">{{
        $t('index.hero-banner.cta')
      }}</a>
    </div>
  </section>
  <section
    id="find-a-game"
    class="relative w-screen p-5 md:p-20 flex flex-col items-center justify-center"
  >
    <h2 class="large-title p-10">{{ $t('index.find-a-game.title') }}</h2>
    <FetchDataComp :error="error" :isLoading="isLoading" />
    <div
      class="w-4/5 absolute lg:bottom-0 bg-background border-2 border-on-background rounded-md p-10 lg:mb-24 z-10"
      v-if="isDefined(selectedGame)"
    >
      <font-awesome
        class="text-2xl absolute right-0 top-0 m-5 hover:text-primary cursor-pointer"
        :icon="['fas', 'circle-xmark']"
        @click="selectedGameId = undefined"
      />
      <h3 class="text-xl text-center font-bold mb-10">{{ selectedGame.name }}</h3>
      <div class="flex flex-col-reverse lg:flex-row justify-between lg:space-x-10">
        <div class="flex flex-col justify-between mt-10 lg:mt-0">
          <p>{{ selectedGame.description }}</p>
          <p class="my-5">
            <span class="underline">{{ $t('index.find-a-game.allowed-consumables') }}</span>
            {{ selectedGame.allowedConsumables }}
          </p>
          <div class="flex justify-center">
            <NuxtLink class="button w-fit" :to="localePath('/login')">
              {{ $t('index.find-a-game.join-game') }}
            </NuxtLink>
          </div>
        </div>
        <div class="lg:w-fit flex flex-col space-y-5 text-center lg:text-left">
          <p>
            {{ selectedGame.gameType === GameType.OP ? $t('index.find-a-game.op') : '' }}
            {{
              selectedGame.gameType === GameType.DOMINICAL ? $t('index.find-a-game.dominical') : ''
            }}
            -
            {{
              selectedGame.privacyType === PrivacyType.PRIVATE
                ? $t('index.find-a-game.private')
                : ''
            }}
            {{
              selectedGame.privacyType === PrivacyType.PUBLIC ? $t('index.find-a-game.public') : ''
            }}
          </p>
          <p><font-awesome :icon="['fas', 'coins']" /> {{ selectedGame.price }} €</p>
          <p class="text-nowrap">
            <font-awesome :icon="['fas', 'calendar-days']" />
            {{ displayDateTime(new Date(selectedGame.startDateTime)) }}
            <br />
            <font-awesome :icon="['fas', 'calendar']" />
            {{ displayDateTime(new Date(selectedGame.endDateTime)) }}
          </p>
          <p>
            <font-awesome :icon="['fas', 'people-group']" />
            {{ selectedGame.participants.length }} /
            {{ selectedGame.maxPlayers }}
          </p>
          <div class="flex justify-center align-center space-x-5 pt-5">
            <p v-if="selectedGame.hasAmenities" class="icon-with-text">
              <font-awesome :icon="['fas', 'toilet']" />
              <span>{{ $t('index.find-a-game.has-amenities') }}</span>
            </p>
            <p v-if="selectedGame.hasParking" class="icon-with-text">
              <font-awesome :icon="['fas', 'car']" />
              <span>{{ $t('index.find-a-game.has-parking') }}</span>
            </p>
            <p v-if="selectedGame.hasEquipmentRental" class="icon-with-text">
              <font-awesome :icon="['fas', 'store']" />
              <span>{{ $t('index.find-a-game.has-equipement-rental') }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <MapComp
      v-if="isSuccess"
      :markersData="markersData"
      @marker-clicked="(id) => (selectedGameId = id)"
    />
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
