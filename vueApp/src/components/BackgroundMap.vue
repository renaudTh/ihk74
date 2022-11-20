<template>
    <div id="map"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useOfficesStore } from '../stores/officesStore';
import { useResultsStore } from '../stores/resultsStore';

const officesStore = useOfficesStore();
const resultsStore = useResultsStore();

resultsStore.$subscribe((mutation, state) => {

    if(state.status == "done"){
        console.log("hello");
    }
})


onMounted(() => {
    let map = tt.map({
        key: import.meta.env.VITE_TOMTOM_API_KEY,
        container: 'map',
        center: new tt.LngLat(6.31198400559317, 46.06698005363598),
        zoom: 11
    });
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