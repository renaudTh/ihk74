<template>
    <div id="map"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useOfficesStore } from '../stores/officesStore';
import { useResultsStore } from '../stores/resultsStore';

const officesStore = useOfficesStore();
const resultsStore = useResultsStore();

let markers = [];
let routeIds = [];


const plotOffice = (id) => {
    let officeLocation = officesStore.offices[id].location;
    let markerElement = document.createElement('div');
    markerElement.className = 'officeMarker';
    let m = new tt.Marker({ element: markerElement }).setLngLat(Object.values(officeLocation.position)).addTo(window.map);
    markers.push(m)
}

const plotLocation = (location) => {
    let marker = document.createElement('div');
    marker.className = 'houseMarker';
    let m = new tt.Marker({element: marker}).setLngLat(Object.values(location.position)).addTo(window.map);
    markers.push(m);
}

const plotRoute = (id, data, color) => {
    window.map.addLayer({
        id: id,
        type: 'line',
        source: {
            type: 'geojson',
            data: data
        },
        paint: {
            'line-color': color,
            'line-width': 4,
            'line-opacity': 0.8
        }
    });
    routeIds.push(id);
}

const computeBounds = () => {
    let bounds = new tt.LngLatBounds();
    markers.forEach((marker) => {
        bounds.extend(marker.getLngLat());
    });
    return bounds;
}

const resetMap = () => {
    if (markers.length > 0) {
            markers.forEach(elt => elt.remove());
            markers = [];
        }
    if(routeIds.length > 0){
        routeIds.forEach((id) => {window.map.removeLayer(id); window.map.removeSource(id)})
        routeIds = [];
    }
}
resultsStore.$subscribe((mutation, state) => {

    if(state.status == "loading"){
        resetMap();
    }
    if (state.status == "done") {
        let idMin = resultsStore.getNearestOfficeIndex();
        let idSelected = resultsStore.getSelectedOfficeIndex();
        plotOffice(idMin);
        plotOffice(idSelected);
        plotLocation(resultsStore.patientLocation);
        plotRoute('selected', resultsStore.selectedRoute.data, '#1E7ABC');
        plotRoute( 'minimal', resultsStore.minimalRoute.data,'#79C691');
       let bounds = computeBounds();
        window.map.fitBounds(bounds,{padding: 80});
    }
})


onMounted(() => {
    let map = tt.map({
        key: import.meta.env.VITE_TOMTOM_API_KEY,
        container: 'map',
        center: new tt.LngLat(6.31198400559317, 46.06698005363598),
        zoom: 11
    });
    window.map = map;
});

</script>

<style scoped>
#map {
    width: 100%;
    height: 100%;
    margin-top: 5px;
    border-radius: 10px;
}
</style>