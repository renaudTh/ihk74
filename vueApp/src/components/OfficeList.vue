<template>
    <div>
        
    </div>
</template>

<script setup>
import { onMounted } from '@vue/runtime-core';
import { useOfficesStore } from '../stores/officesStore';


const officesStore = useOfficesStore();
const getOffices = async () =>{
    officesStore.getOfficeList();
}

onMounted(() => {
    getOffices();

})
</script>

<style scoped>
div {

    width: 100%;
    height: 80%;
    overflow-y: scroll;
}
</style>