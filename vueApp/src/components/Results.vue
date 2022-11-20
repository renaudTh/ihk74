<template>
    <div class="results">
        <div v-if="resultsStore.status === 'no' ">Les résultats de la recherche s'afficheront ici</div>
        <div v-else-if="resultsStore.status === 'loading' " class="loader"></div>
        <p v-else>
            Le cabinet le plus proche est {{ officesStore.offices[resultsStore.getNearestOfficeIndex()].name }}  à {{ resultsStore.getMinimalDistance() }} km. <br>
            Le cabinet sélectionné {{ officesStore.offices[resultsStore.getSelectedOfficeIndex()].name }} est à {{ resultsStore.getSelectedDistance() }} km. <br>
            <strong>Tarif applicable : {{ resultsStore.computePrice() }} € </strong> 
        </p>

    </div>
</template>

<script setup>
import { useOfficesStore } from '../stores/officesStore';
import { useResultsStore } from '../stores/resultsStore';

const officesStore = useOfficesStore();
const resultsStore = useResultsStore();

</script>

<style scoped>
.results{
    width: 100%;
    height: 20%;
    border: 1px solid black;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

