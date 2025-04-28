<script setup lang="ts">
import { onMounted } from 'vue'
import 'leaflet/dist/leaflet.css'

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

onMounted(async () => {
  const L = await import('leaflet')

  const map = L.map('map', {
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

  props.markersData.forEach((markerData) => {
    const marker = L.marker([markerData.latitude, markerData.longitude]).addTo(map)

    marker.on('click', () => {
      emit('markerClicked', markerData.id)
    })
  })

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      map.setView([latitude, longitude], 6)
    })
  }
})
</script>

<template>
  <div id="map" class="z-0 w-full h-full"></div>
</template>
