import { ref } from 'vue'
import { useFetch } from '#imports'
import { useI18n } from 'vue-i18n'
import { isDefined, isNotNullOrUndefined } from '~/utils/types/typeGuards'
import type { UseFetchOptions } from '#app'

export function useFetchWithState<T>(url: string, options: Omit<UseFetchOptions<T>, 'body'> = {}) {
  const { t } = useI18n()

  const data = ref<T | null>(null)
  const error = ref('')
  const isLoading = ref(false)

  const fetch = async (body?: UseFetchOptions<T>['body']) => {
    isLoading.value = true
    error.value = ''

    try {
      const { data: responseData, error: fetchError } = await useFetch(url, {
        ...options,
        body
      })

      if (isNotNullOrUndefined(fetchError.value)) {
        error.value = t('common.server-error')

        if (isDefined(fetchError.value.data.data.errorKey)) {
          error.value = t(fetchError.value.data.data.errorKey)
        }
      }

      data.value = responseData.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    error,
    isLoading,
    fetch
  }
}
