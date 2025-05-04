import { ref } from 'vue'
import { useFetch } from '#imports'
import { useI18n } from 'vue-i18n'
import { isDefined, isNotNullOrUndefined } from '~/utils/types/typeGuards'
import type { UseFetchOptions } from '#app'

export function useFetchWithState<T>(url: string | Ref<string>, options: UseFetchOptions<T> = {}) {
  const { t } = useI18n()

  const resolvedUrl = computed(() => unref(url))

  const {
    data,
    error: fetchError,
    status,
    execute: executeUseFetch
  } = useFetch(resolvedUrl, {
    ...options,
    immediate: false,
    watch: false
  })

  const error = ref<string | null>(null)

  async function execute() {
    error.value = null

    await executeUseFetch()

    if (isNotNullOrUndefined(fetchError.value)) {
      error.value = t('common.errors.server-error')

      if (isDefined(fetchError.value.data.data.errorKey)) {
        error.value = t(fetchError.value.data.data.errorKey)
      }
    }
  }

  function resetError() {
    error.value = null
  }

  return {
    data,
    error,
    resetError,
    isLoading: computed(() => status.value === 'pending'),
    isSuccess: computed(() => status.value === 'success'),
    execute
  }
}
