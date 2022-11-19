<template>
<div id="map">

</div>
</template>

<script setup>
import { onMounted } from 'vue';

const initMap = async () => {

    await  tt.map({
        key: "duwkcB2BBx5fW3HIr6p8gGqubEvjNmp6",
        container: 'map',
        center: new tt.LngLat(6.31198400559317, 46.06698005363598),
        zoom: 11
    });

}
onMounted(() => {
   initMap();

});

</script>

<style scoped>
#map {
    width: 100%;
    height: 100%;
    margin-top: 5px;
    border: 1px solid black;
    border-radius: 10px;
}
</style>