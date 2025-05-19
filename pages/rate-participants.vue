<script setup lang="ts">
import { usePageMeta } from '~/composables/usePageMeta'
import type { Rating } from '~/server/db/entities/Rating'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { isNotNull } from '~/utils/types/typeGuards'
import RatingFormCard from '~/components/rating/RatingFormCard.vue'

usePageMeta('rate-participants')

const {
  data: pendingRatings,
  error,
  isLoading,
  isSuccess,
  execute: executeFetchGames
} = useFetchWithState<Rating[]>('/api/ratings')
executeFetchGames()
</script>

<template>
  <section class="wrapper">
    <h1 class="large-title">{{ $t('pages.rate-participants.h1') }}</h1>
    <p>
      {{ $t('pages.rate-participants.explanation') }}
    </p>
    <div>
      <div class="divider mb-12" />
      <div v-if="isSuccess && isNotNull(pendingRatings)">
        <div v-if="pendingRatings.length > 0" class="space-y-12">
          <div v-for="rating in pendingRatings" :key="rating.id">
            <RatingFormCard :pendingRating="rating" @rating-sent="executeFetchGames" />
            <div class="divider my-8" />
          </div>
        </div>
        <p v-else>
          {{ $t('pages.rate-participants.no-ratings') }}
        </p>
      </div>
      <FetchDataComp :error="error" :isLoading="isLoading" />
    </div>
  </section>
</template>
