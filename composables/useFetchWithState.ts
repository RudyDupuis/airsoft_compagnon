import { ref } from 'vue'
import { useFetch } from '#imports'
import { useI18n } from 'vue-i18n'
import { isDefined, isNotNullOrUndefined } from '~/utils/types/typeGuards'
import type { UseFetchOptions } from '#app'

export function useFetchWithState<T>(url: string, options: UseFetchOptions<T> = {}) {
  const { t } = useI18n()

  const {
    data,
    error: fetchError,
    status,
    execute: executeUseFetch
  } = useFetch(url, {
    ...options,
    immediate: false,
    watch: false
  })

  const error = ref<string | null>(null)

  const execute = async () => {
    error.value = null

    await executeUseFetch()

    if (isNotNullOrUndefined(fetchError.value)) {
      error.value = t('common.server-error')

      if (isDefined(fetchError.value.data.data.errorKey)) {
        error.value = t(fetchError.value.data.data.errorKey)
      }
    }
  }

  return {
    data,
    error,
    isLoading: computed(() => status.value === 'pending'),
    isSuccess: computed(() => status.value === 'success'),
    execute
  }
}
