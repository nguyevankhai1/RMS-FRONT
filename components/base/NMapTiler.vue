<template>
  <div class="container-xxl mt-5">
    <div class="card">
      <div class="map-wrap">
        <div id="map"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Map, MapStyle, Marker, config, Popup } from "@maptiler/sdk";
import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "@maptiler/geocoding-control/style.css";

interface Coords {
  lat: number;
  lng: number;
}

// api key by Map Tiler account: 52nZbGI0DnHRBNr4JcEJ
const apiKey = "52nZbGI0DnHRBNr4JcEJ";
config.apiKey = apiKey;

const map = shallowRef<any>(null);

const marker = new Marker({ color: "#FF0000", draggable: true });

const popup = new Popup({ closeButton: false, offset: 35 });

const showMarker = ({ lng, lat }: Coords) => {
  marker.setLngLat([lng, lat]).addTo(map.value!);
};

const showPopup = ({ target: { _lngLat } }: any) => {
  popup
    .setLngLat([_lngLat.lng, _lngLat.lat])
    .setHTML(
      `<p style="margin-top: 10px">Longtitude: ${_lngLat.lng}<br/>Latitude: ${_lngLat.lat}</p>`
    )
    .addTo(map.value);
};

const geocoding = () => {
  return new GeocodingControl({
    country: "vn",
    language: "vi",
    debounceSearch: 350,
    placeholder: "Search",
    minLength: 4,
  });
};

const createMap = ({ lng, lat }: Coords) => {
  return new Map({
    container: "map",
    style: MapStyle.STREETS,
    center: [lng, lat],
    zoom: 14,
  }).addControl(geocoding(), "top-left");
};

const showCurrentLocation = (data = { lng: 105.8526, lat: 21.0292 }) => {
  map.value = markRaw(createMap(data));
  showMarker(data);
  // @ts-ignore
  map.value.on("click", ({ lngLat }) => showMarker(lngLat));
  marker.on("drag", showPopup);
  marker.on("dragend", popup.remove);
};

const renderMap = () => {
  const permissionGranted = ({ coords }: GeolocationPosition) => {
    showCurrentLocation({ lat: coords.latitude, lng: coords.longitude });
  };

  const failToGetPermission = () => showCurrentLocation();

  navigator.geolocation.getCurrentPosition(permissionGranted, failToGetPermission, {
    enableHighAccuracy: true,
  });
};

onMounted(() => {
  renderMap();
});

onUnmounted(() => {
  map.value!.remove();
});
</script>

<style lang="sass" scoped>
.card
    height: 500px

.map-wrap
  position: relative
  width: 100%
  height: calc(100vh - 77px)

#map
    position: absolute
    top: 0
    bottom: 0
    width: 100%

.maplibregl-ctrl
    display: none

.searchLocation
    position: absolute
    z-index: 1
    background-color: rgba(200 , 200 ,200 ,0.7 )
    width: 250px

    &:focus,
    &:hover
        border-color: #00A3FF
        transition: .25s
</style>
