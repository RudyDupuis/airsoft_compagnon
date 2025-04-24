<script setup>
import { onMounted } from 'vue'
import 'leaflet/dist/leaflet.css'

onMounted(async () => {
  const L = await import('leaflet')

  const map = L.map('map', {
    minZoom: 3,
    maxZoom: 10,
    maxBounds: L.latLngBounds(L.latLng(-90, -180), L.latLng(90, 180)),
    scrollWheelZoom: false
  }).setView([46.603354, 1.888334], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    noWrap: true
  }).addTo(map)

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      map.setView([latitude, longitude], 6)
    })
  }
})
</script>

<template>
  <div id="map" class="z-0 w-full" :style="{ height: '80vh' }"></div>
</template>
