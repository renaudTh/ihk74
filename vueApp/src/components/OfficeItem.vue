<template>
    <div class="office" :id="office.id" @click="onClick(office.id)" v-bind:class="{ active: office.id == officesStore.selected}">
        <h3>{{office.name}}</h3>
        <p>{{office.address.street}}<br>{{office.address.postalCode}} {{office.address.city}}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { useOfficesStore } from '../stores/officesStore';
const props = defineProps([
    'office'
])

const officesStore = useOfficesStore();
const onClick = (id) => {

    officesStore.selectOne(id);

}

</script>

<style scoped>
.office {
    padding: 2px;
}
.office:hover{
    cursor: pointer;
}
.active{
    background-color:lightblue;
}
</style>