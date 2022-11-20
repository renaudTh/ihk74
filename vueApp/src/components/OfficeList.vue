<template>
    <div class="officeList">
        <OfficeItem v-for="office in officesStore.offices" :key="office.id" :office="office" />
    </div>
   
     
</template>

<script setup>
import { onMounted } from '@vue/runtime-core';
import { useOfficesStore } from '../stores/officesStore';
import OfficeItem from './OfficeItem.vue';


const officesStore = useOfficesStore();
const getOffices = async () =>{
    officesStore.getOfficeList();
}

onMounted(() => {
    getOffices();

})
</script>

<style scoped>
.officeList {

    width: 100%;
    height: 80%;
    overflow-y: scroll;
}
</style>