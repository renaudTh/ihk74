<template>
    <div class="results">
        <div v-if="resultsStore.status === 'no' ">Les résultats de la recherche s'afficheront ici</div>
        <div v-else-if="resultsStore.status === 'loading' " class="loader"></div>
        <div v-else class="result-content">
            Le cabinet le plus proche est {{ officesStore.offices[resultsStore.getNearestOfficeIndex()].name }}  à {{ resultsStore.getMinimalDistance() }} km. <br>
            Le cabinet sélectionné {{ officesStore.offices[resultsStore.getSelectedOfficeIndex()].name }} est à {{ resultsStore.getSelectedDistance() }} km. <br>
            <strong>Tarif applicable : {{ resultsStore.computePrice() }} € </strong> <span class="toggle" @click="toggle">Détails</span>
            
        </div>
        <div v-if="showDetails && resultsStore.status === 'done'">{{ resultsStore.priceDetails() }}</div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useOfficesStore } from '../stores/officesStore';
import { useResultsStore } from '../stores/resultsStore';

const officesStore = useOfficesStore();
const resultsStore = useResultsStore();
const showDetails = ref(false);

const toggle = () => {
    showDetails.value = !showDetails.value;
}

resultsStore.$subscribe((mutation, state) => {
    if(state.status === "loading"){
        showDetails.value = false;
    }
})
</script>

<style scoped>
.results{
    width: 100%;
    height: 20%;
    border: 1px solid black;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: top;
    padding: 10px;
}
.toggle{
    cursor: pointer;
    text-decoration: underline;
}
.loader{
    margin: auto;
}
.result-content{
    line-height: 1.5em;
    margin: 2px;
}
</style>

