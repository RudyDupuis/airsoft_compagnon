<script setup lang="ts">
import { useLocalePath } from '#imports'
const localePath = useLocalePath()
</script>

<template>
  <footer class="flex flex-col lg:flex-row gap-10 items-center justify-between px-10 py-5">
    <div class="flex items-center gap-2">
      <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
        <font-awesome class="text-2xl hover:text-primary" :icon="['fab', 'facebook']" />
      </a>
      <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
        <font-awesome class="text-2xl hover:text-primary" :icon="['fab', 'instagram']" />
      </a>
    </div>

    <div class="flex items-center gap-2">
      <NuxtLink :to="localePath('/contact')" class="underline hover:text-primary">
        {{ $t('components.footer.contact') }}
      </NuxtLink>
      <NuxtLink :to="localePath('/terms-and-conditions')" class="underline hover:text-primary">
        {{ $t('components.footer.terms-and-conditions') }}
      </NuxtLink>
      <NuxtLink :to="localePath('/terms-of-use')" class="underline hover:text-primary">
        {{ $t('components.footer.terms-of-use') }}
      </NuxtLink>
      <NuxtLink :to="localePath('/cookies-policy')" class="underline hover:text-primary">
        {{ $t('components.footer.cookies-policy') }}
      </NuxtLink>
    </div>
    <div class="flex flex-col items-center lg:items-start">
      <p class="text-center">Copyright © {{ new Date().getFullYear() }} Airsoft Compagnon</p>
      <p class="text-xs">
        {{ $t('components.footer.developped-by') }} | {{ $t('components.footer.version') }} 0.0.0
      </p>
    </div>
  </footer>
</template>
