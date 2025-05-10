<script setup lang="ts">
import { useLocalePath, useUserSession } from '#imports'
import { useI18n } from 'vue-i18n'
import { usePageMeta } from '~/composables/usePageMeta'
import { useFetchWithState } from '~/composables/useFetchWithState'
import { isNotNull } from '~/utils/types/typeGuards'
import type { User } from '~/server/db/entities/User'
import { useRouter } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { emailRegex, passwordRegex, pseudoRegex, usernameRegex } from '~/utils/validations/regex'
import { isOfLegalAge } from '~/utils/validations/methods'

usePageMeta('me')
const localePath = useLocalePath()
const router = useRouter()
const { t } = useI18n()
const { clear: resetSession, fetch: refreshUserSession } = useUserSession()

enum Mode {
  ACCOUNT_VIEW = 'account_view',
  EDIT_ACCOUNT = 'edit_account',
  EDIT_PASSWORD = 'edit_password'
}
const mode = ref<Mode>(Mode.ACCOUNT_VIEW)

const {
  data: user,
  error: fetchUserError,
  isLoading: isFetchUserLoading,
  isSuccess: isFetchUserSuccess,
  execute: executeFetchMe
} = useFetchWithState<User>('/api/auth/me')
executeFetchMe()

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const dateOfBirth = ref('')
const pseudo = ref('')

watch(user, (newUser) => {
  if (isNotNull(newUser)) {
    email.value = newUser.email
    firstName.value = newUser.firstName
    lastName.value = newUser.lastName
    dateOfBirth.value = String(newUser.dateOfBirth)
    pseudo.value = newUser.pseudo
  }
})

const {
  error: editUserError,
  isLoading: isEditUserLoading,
  isSuccess: isEditUserSuccess,
  execute: executeEditUser
} = useFetchWithState<User>('/api/auth/me', {
  method: 'PUT',
  body: computed(() => ({
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    dateOfBirth: dateOfBirth.value,
    pseudo: pseudo.value
  }))
})

async function editUser() {
  await executeEditUser()

  if (isEditUserSuccess.value) {
    await refreshUserSession()
    await executeFetchMe()
    mode.value = Mode.ACCOUNT_VIEW
  }
}

const oldPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')

const {
  error: editPasswordError,
  isLoading: isEditPasswordLoading,
  isSuccess: isEditPasswordSuccess,
  execute: executeEditPassword
} = useFetchWithState<User>('/api/auth/me/password', {
  method: 'PUT',
  body: computed(() => ({
    oldPassword: oldPassword.value,
    newPassword: newPassword.value
  }))
})

async function editPassword() {
  if (newPassword.value !== confirmNewPassword.value) {
    editPasswordError.value = t('pages.me.errors.password-mismatch')
    return
  }

  await executeEditPassword()

  if (isEditPasswordSuccess.value) {
    mode.value = Mode.ACCOUNT_VIEW
  }
}

function logout() {
  resetSession()
  router.push(localePath('/login'))
}
</script>

<template>
  <section class="wrapper">
    <h1 class="large-title">{{ $t('pages.me.h1') }}</h1>

    <FetchDataComp :error="fetchUserError" :isLoading="isFetchUserLoading" />

    <div
      v-if="isFetchUserSuccess && isNotNull(user) && mode === Mode.ACCOUNT_VIEW"
      class="flex flex-col w-full gap-20"
    >
      <UserCard
        :user="{
          id: user.id,
          pseudo: user.pseudo,
          reputation: user.reputation,
          createdAt: user.createdAt,
          gamesPlayed: user.gamesPlayed
        }"
      />

      <div class="flex flex-col gap-4">
        <button
          @click="mode = Mode.EDIT_ACCOUNT"
          class="text-left hover:text-primary"
          data-cy="me-edit-account"
        >
          <font-awesome class="mr-2" :icon="['fas', 'address-card']" />
          <span class="underline">{{ $t('pages.me.edit-account') }}</span>
        </button>
        <button
          @click="mode = Mode.EDIT_PASSWORD"
          class="text-left hover:text-primary"
          data-cy="me-edit-password"
        >
          <font-awesome class="mr-2" :icon="['fas', 'key']" />
          <span class="underline">{{ $t('pages.me.edit-password') }}</span>
        </button>
      </div>

      <button class="button-secondary" @click="logout" data-cy="me-logout">
        {{ $t('pages.me.logout') }}
      </button>
    </div>

    <div v-if="isFetchUserSuccess && mode === Mode.EDIT_ACCOUNT" class="w-full">
      <FormComp
        submitButtonKey="common.form.edit"
        :error="editUserError"
        :isLoading="isEditUserLoading"
        @submit="editUser"
      >
        <InputField
          v-model="firstName"
          placeholderKey="entities.user.first-name"
          :regex="usernameRegex"
          errorMessageKey="entities.user.errors.invalid-first-name"
          required
          cy="first-name"
        />
        <InputField
          v-model="lastName"
          placeholderKey="entities.user.last-name"
          :regex="usernameRegex"
          errorMessageKey="entities.user.errors.invalid-last-name"
          required
          cy="last-name"
        />
        <InputField
          v-model="pseudo"
          placeholderKey="entities.user.pseudo"
          :regex="pseudoRegex"
          errorMessageKey="entities.user.errors.invalid-pseudo"
          required
          cy="pseudo"
        />
        <InputField
          v-model="dateOfBirth"
          placeholderKey="entities.user.date-of-birth"
          :custom-string-validation="isOfLegalAge"
          error-message-key="entities.user.errors.invalid-date-of-birth"
          type="date"
          required
          cy="date-of-birth"
        />
        <InputField
          v-model="email"
          placeholderKey="entities.user.email"
          :regex="emailRegex"
          errorMessageKey="entities.user.errors.invalid-email"
          type="email"
          required
          cy="email"
        />
      </FormComp>
      <button class="button-secondary w-full" @click="mode = Mode.ACCOUNT_VIEW">
        {{ $t('common.form.cancel') }}
      </button>
    </div>

    <div v-if="isFetchUserSuccess && mode === Mode.EDIT_PASSWORD" class="w-full">
      <FormComp
        submitButtonKey="common.form.edit"
        :error="editPasswordError"
        :isLoading="isEditPasswordLoading"
        @submit="editPassword"
      >
        <InputField
          v-model="oldPassword"
          placeholderKey="pages.me.old-password"
          type="password"
          required
          cy="old-password"
        />
        <InputField
          v-model="newPassword"
          placeholderKey="pages.me.new-password"
          :regex="passwordRegex"
          errorMessageKey="entities.user.errors.invalid-password"
          type="password"
          required
          cy="new-password"
        />
        <InputField
          v-model="confirmNewPassword"
          placeholderKey="pages.me.confirm-new-password"
          :regex="passwordRegex"
          errorMessageKey="entities.user.errors.invalid-password"
          type="password"
          required
          cy="confirm-new-password"
        />
      </FormComp>
      <button class="button-secondary w-full" @click="mode = Mode.ACCOUNT_VIEW">
        {{ $t('common.form.cancel') }}
      </button>
    </div>
  </section>
</template>
