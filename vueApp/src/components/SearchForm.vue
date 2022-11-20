<template>
    <form @submit.prevent.stop="submit">
        <input type="text" name="address" id="address" placeholder="Entrez l'adresse d'un patient" v-model="content">
        <input type="submit" value="Rechercher">
    </form>
</template>

<script setup>
import { ref } from "vue";
import { useOfficesStore } from '../stores/officesStore';
import { useResultsStore } from '../stores/resultsStore';


const content = ref("");
const officesStore = useOfficesStore();
const resultsStore = useResultsStore();


const getAddress = async (query) => {

    let res = await tt.services.geocode({
        key: import.meta.env.VITE_TOMTOM_API_KEY,
        query: query,
        countrySet: "FR"
    });
    return res.results[0];
}

const getMatrix = async (patientAddress, officeList) => {
    let patientCoordinates = Object.values(patientAddress.position);
    let destinations = 0;
    let locationsUrl = patientCoordinates[0] + "," + patientCoordinates[1] + ";";
    let sources = "";
    for (let i = 0; i < officeList.length; i++) {
        let coord = Object.values(officeList[i].location.position);
        locationsUrl += coord[0] + "," + coord[1] + ";";
        sources += (i + 1) + ";"
    }
    locationsUrl = locationsUrl.substring(0, locationsUrl.length - 1);
    sources = sources.substring(0, sources.length - 1);

    let url = "https://router.project-osrm.org/table/v1/driving/" + locationsUrl + "?sources=" + sources + "&destinations=" + destinations + "&annotations=distance";
    let res = await fetch(url);
    let data = await res.json();

    return data.distances.map((elt, index) => {
        return {
            officeIndex: index,
            distance: elt[0],
            location: officeList[index].location
        }
    });
}

const batchRoute = async (patient, candidates) => {

    let batchItems = [];
    let officeIds = new Map()

    let destination = Object.values(patient.position);
    let i = 0;
    for (let candidate of candidates) {
        let source = Object.values(candidate.location.position);
        batchItems.push({
            locations: [source, destination],
            avoid: "unpavedRoads",
            routeType: 'shortest',
            traffic: false,
            travelMode: 'car',
        });
        officeIds.set(i, candidate.officeIndex);
        i++;
    }

    let res = await tt.services.calculateRoute({
        batchMode: 'sync',
        key: import.meta.env.VITE_TOMTOM_API_KEY,
        batchItems: batchItems
    })
    let data = res.batchItems;
    let results = []
    i = 0;
    for (let item of data) {

        results.push({
            officeIndex: officeIds.get(i),
            distance: item.routes[0].summary.lengthInMeters,
            duration: item.routes[0].summary.travelTimeInSeconds,
            data: item.toGeoJson(),
        })
        i++;
    }
    return results;
}
const extractCandidates = (matrix) => {
    let sorted = matrix.sort((a, b) => (a.distance - b.distance));
    let results = sorted.filter((elt) => (Math.abs(elt.distance - sorted[0].distance) < 1000));
    return results;
}
const findShortestRoute = (routes) => routes.sort((a,b) => (a.distance - b.distance))[0];

const submit = async () => {

    resultsStore.$patch((state) => state.status = "loading");
    let a = await getAddress(content.value);
    let m = await getMatrix(a, officesStore.offices);
    let c = extractCandidates(m);
    
    let r = await batchRoute(a, [...c, { officeIndex: officesStore.selected, location: officesStore.getSelected().location }]);
    console.log(r);
    let min = findShortestRoute(r);
    let selectedRoute = r.filter((route) => route.officeIndex === officesStore.selected)[0];
    resultsStore.setMinimalRoute(min);
    resultsStore.setSelectedRoute(selectedRoute);
    resultsStore.$patch((state) => state.status = "done");
}

</script>

<style scoped>
form {
    width: 100%;
}

input[type=text] {
    width: 79%;
    height: 50px;
    border-radius: 5px;
    border: 1px solid grey;
    padding: 10px;
}

input[type=submit] {
    width: 20%;
    height: 50px;
    border-radius: 5px;
    background-color: lightblue;
    border: 0;
}

input[type=submit]:hover {
    background-color: rgb(90, 190, 225);
    cursor: pointer;
}
</style>


