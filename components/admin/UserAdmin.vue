<script setup lang="ts">
import type { User } from '~/server/db/entities/User'
import { displayDate } from '~/utils/formatting/date'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { computed } from 'vue'
import { isNull } from '~/utils/types/typeGuards'

const props = defineProps<{
  user: User
}>()

const emit = defineEmits(['user-updated'])

const {
  error: verifyUserError,
  isSuccess: isVerifyUserSuccess,
  isLoading: isVerifyUserLoading,
  execute: executeVerifyUser
} = useFetchWithState(
  computed(() => `/api/users/${props.user.id}/verify`),
  {
    method: 'POST'
  }
)

async function verifyUser() {
  await executeVerifyUser()

  if (isVerifyUserSuccess) {
    emit('user-updated')
  }
}

const {
  error: banUserError,
  isSuccess: isBanUserSuccess,
  isLoading: isBanUserLoading,
  execute: executeBanUser
} = useFetchWithState(
  computed(() => `/api/users/${props.user.id}/ban`),
  {
    method: 'POST'
  }
)

async function banUser() {
  await executeBanUser()

  if (isBanUserSuccess) {
    emit('user-updated')
  }
}
</script>

<template>
  <div class="flex flex-col gap-10">
    <div>
      <p>
        <span class="underline mr-2">{{ $t('entities.user.email') }}:</span>
        {{ user.email }}
      </p>
      <p>
        <span class="underline mr-2">{{ $t('entities.user.date-of-birth') }}:</span>
        {{ displayDate(new Date(user.dateOfBirth)) }}
      </p>
      <p>
        <span class="underline mr-2">{{ $t('entities.user.first-name') }}:</span>
        {{ user.firstName }}
      </p>
      <p>
        <span class="underline mr-2">{{ $t('entities.user.last-name') }}:</span>
        {{ user.lastName }}
      </p>
    </div>
    <div>
      <p>
        <span class="underline mr-2">{{ $t('entities.user.is-admin') }}:</span>
        <font-awesome v-if="user.isAdmin" :icon="['fas', 'check']" />
        <font-awesome v-else :icon="['fas', 'xmark']" />
      </p>
      <p>
        <span class="underline mr-2">{{ $t('entities.user.is-verified') }}:</span>
        <font-awesome v-if="user.isVerified" :icon="['fas', 'check']" />
        <font-awesome v-else :icon="['fas', 'xmark']" />
      </p>
      <p>
        <span class="underline mr-2">{{ $t('entities.user.is-banned') }}:</span>
        <font-awesome v-if="user.isBanned" :icon="['fas', 'check']" />
        <font-awesome v-else :icon="['fas', 'xmark']" />
      </p>
    </div>
    <div class="flex flex-col gap-5">
      <button :disabled="isVerifyUserLoading" class="button" @click="verifyUser">
        <FetchDataComp :error="verifyUserError" :isLoading="isVerifyUserLoading" />
        <span v-if="!isVerifyUserLoading && isNull(verifyUserError)">
          {{ user.isVerified ? 'Devérifier' : 'Vérifier' }}
        </span>
      </button>
      <button :disabled="isBanUserLoading" class="button" @click="banUser">
        <FetchDataComp :error="banUserError" :isLoading="isBanUserLoading" />
        <span v-if="!isBanUserLoading && isNull(banUserError)">
          {{ user.isBanned ? 'Debannir' : 'Bannir' }}
        </span>
      </button>
    </div>
  </div>
</template>
