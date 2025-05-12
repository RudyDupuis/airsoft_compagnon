<script setup lang="ts">
import { onMounted, watch, useId } from 'vue'
import 'leaflet/dist/leaflet.css'

//TODO: Changer le comportement quand il y a un seul marker et régler le problème des marqueurs au même endroit
export interface MarkerData {
  latitude: number
  longitude: number
  id: number
}
const props = defineProps<{
  markersData: MarkerData[]
}>()

const emit = defineEmits<{
  (e: 'markerClicked', id: number): void
}>()

const uniqueId = useId()

onMounted(async () => {
  const L = await import('leaflet')

  const map = L.map(uniqueId, {
    minZoom: 3,
    maxZoom: 15,
    // Using maxBounds to prevent scrolling beyond the world's boundaries
    maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
    scrollWheelZoom: false
  }).setView(
    // Default view set to France
    [46.603354, 1.888334],
    6
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    noWrap: true
  }).addTo(map)

  const markerGroup = L.layerGroup().addTo(map)

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      map.setView([latitude, longitude], 6)
    })
  }

  watch(
    () => props.markersData,
    (newMarkers) => {
      markerGroup.clearLayers()

      newMarkers.forEach((markerData) => {
        const customIcon = L.divIcon({
          html: `<div data-cy="marker-map-${markerData.id}" style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%;">
                  <svg viewBox="0 0 384 512">
                      <rect
                        style="fill:#FFF8F8;fill-opacity:1;stroke:none;stroke-width:25.064;stroke-linecap:round;stroke-linejoin:round"
                        width="134.50893"
                        height="131.0152"
                        x="122.28085"
                        y="129.26833"
                      />
                      <path
                        d="M 214.22871,500.9842 C 265.01778,436.86673 380.85243,281.46675 380.85243,194.17911 380.85243,88.315392 295.70901,2.4259479 190.76478,2.4259479 85.820548,2.4259479 0.67711995,88.315392 0.67711995,194.17911 c 0,87.28764 115.83466005,242.68762 166.62372005,306.80509 12.17749,15.28032 34.75039,15.28032 46.92787,0 z M 190.76478,130.26139 a 63.362553,63.917725 0 1 1 0,127.83545 63.362553,63.917725 0 1 1 0,-127.83545 z"
                        style="fill:#f30002;fill-opacity:1;stroke:none;stroke-width:34.7242;stroke-opacity:1"
                      />
                  </svg>
                </div>`,
          // Remove default style
          className: '',
          iconSize: [25, 41],
          iconAnchor: [12.5, 41]
        })

        L.marker([markerData.latitude, markerData.longitude], { icon: customIcon })
          .addTo(markerGroup)
          .on('click', () => emit('markerClicked', markerData.id))
      })

      if (props.markersData.length === 1) {
        const { latitude, longitude } = props.markersData[0]
        map.setView([latitude, longitude], 5)
      }
    },
    { immediate: true, deep: true }
  )
})
</script>

<template>
  <div :id="uniqueId" class="z-0 w-full h-full"></div>
</template>
