import { isBlankString, isNotNull } from '~/utils/types/typeGuards'

export function useGeocoding(address: Ref<string>) {
  const { t } = useI18n()

  const url = computed(() => {
    return `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address.value)}&format=json&limit=1`
  })
  const {
    data,
    error,
    isLoading,
    isSuccess,
    execute: fetchCoordinates
  } = useFetchWithState<{ lat: string; lon: string }[]>(url, {
    headers: {
      'Content-Type': 'application/json'
    }
  })

  async function getCoordinates(): Promise<{ latitute: number; longitude: number } | null> {
    if (isBlankString(address.value)) {
      return null
    }

    await fetchCoordinates()

    if (isSuccess.value && isNotNull(data.value) && data.value.length > 0) {
      return {
        latitute: parseFloat(data.value[0].lat),
        longitude: parseFloat(data.value[0].lon)
      }
    }

    error.value = t('geocoding.coordinates-not-found')

    return null
  }

  return {
    error,
    isLoading,
    getCoordinates
  }
}
