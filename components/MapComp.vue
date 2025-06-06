<script setup lang="ts">
import { onMounted, watch, useId } from 'vue'
import 'leaflet/dist/leaflet.css'

export interface MarkerData {
  latitude: number
  longitude: number
  id: number
}
const props = withDefaults(
  defineProps<{
    markersData: MarkerData[]
    focusOnUniqueMarker?: boolean
  }>(),
  {
    focusOnUniqueMarker: false
  }
)

const emit = defineEmits<{
  (e: 'markerClicked', id: number): void
}>()

const uniqueId = useId()

onMounted(async () => {
  // Dynamically import Leaflet and MarkerCluster to avoid SSR issues
  // Explicitly extract the default export from the dynamic import
  const L = await import('leaflet').then((module) => module.default)
  await import('leaflet.markercluster')

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

  const markerGroup = L.markerClusterGroup({
    showCoverageOnHover: false,
    iconCreateFunction: function (cluster) {
      return L.divIcon({
        html: `<div data-cy="marker-cluster-map" style="display: flex; justify-content: center; align-items: center; height: 100%; width: 100%; position: relative;">
                  <svg viewBox="0 0 384 512">
                    <rect
                      style="fill:#FFF8F8;fill-opacity:1;stroke:none;stroke-width:25.064;stroke-linecap:round;stroke-linejoin:round"
                      width="134.50893"
                      height="131.0152"
                      x="122.28085"
                      y="129.26833"
                      />
                    <rect
                      style="fill:#FFF8F8;fill-opacity:1;stroke:none;stroke-width:25.064;stroke-linecap:round;stroke-linejoin:round"
                      width="134.50893"
                      height="131.0152"
                      x="122.28085"
                      y="129.26833"
                      />
                    <path
                      d="M 243.67245,419.87691 C 286.44612,365.8783 384,235.00322 384,161.49113 384,72.33457 312.29372,0 223.91157,0 135.52939,0 63.823109,72.33457 63.823109,161.49113 c 0,73.51209 97.553891,204.38717 140.327541,258.38578 10.25566,12.8688 29.26615,12.8688 39.5218,0 z M 223.91157,107.66074 a 53.362827,53.830382 0 1 1 0,107.66076 53.362827,53.830382 0 1 1 0,-107.66076 z"
                      style="fill:#900001;fill-opacity:1;stroke:none;stroke-width:12.9072;stroke-opacity:1"
                      />
                    <path
                      d="m 211.76089,461.11266 c 42.77367,-53.99861 140.32755,-184.8737 140.32755,-258.38579 0,-89.15656 -71.70628,-161.491125 -160.08843,-161.491125 -88.38218,0 -160.088453,72.334565 -160.088453,161.491125 0,73.51209 97.553883,204.38718 140.327533,258.38579 10.25566,12.86879 29.26615,12.86879 39.5218,0 z M 192.00001,148.89648 a 53.362827,53.830382 0 1 1 0,107.66076 53.362827,53.830382 0 1 1 0,-107.66076 z"
                      style="fill:#c20002;fill-opacity:1;stroke:none;stroke-width:1.17695;stroke-opacity:1"
                      />
                    <path
                      d="M 179.84934,502.3484 C 222.62301,448.34979 320.17689,317.47471 320.17689,243.96262 320.17689,154.80606 248.47061,82.471498 160.08846,82.471498 71.706276,82.471498 0,154.80606 0,243.96262 c 0,73.51209 97.553888,204.38717 140.32754,258.38578 10.25566,12.8688 29.26615,12.8688 39.5218,0 z M 160.08846,190.13223 a 53.362827,53.830382 0 1 1 0,107.66076 53.362827,53.830382 0 1 1 0,-107.66076 z"
                      style="fill:#f30002;fill-opacity:1;stroke:none;stroke-width:0.79;stroke-opacity:1;stroke-dasharray:none"
                      />
                  </svg>
                  <p style="position: absolute; bottom: 0; right:0; color: #1C0000; font-size: 15px; font-family: Aldrich-Regular; font-weight: bold; z-index: 200; background-color: #FFF8F8; padding: 0 5px; border-radius: 10px;">
                    ${cluster.getChildCount()}
                  </p>
                </div>`,
        // Remove default style
        className: '',
        iconSize: [32.5, 53.3],
        iconAnchor: [25, 40]
      })
    }
  }).addTo(map)

  // TODO Voir la violation
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

      if (props.focusOnUniqueMarker) {
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
