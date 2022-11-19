<script setup>
import Intro from "../components/Intro.vue";
import Header from "../components/Header.vue";
import SearchForm from "../components/SearchForm.vue";
import Results from "../components/Results.vue";
import BackgroundMap from "../components/BackgroundMap.vue";
import OfficeList from "../components/OfficeList.vue";

</script>

<template>
    <div class="container">
        <Header></Header>
        <intro></intro>
        <div class="content">
            <div class="left">
                <SearchForm></SearchForm>
                <BackgroundMap></BackgroundMap>
            </div>
            <div class="right">
                <Results></Results>
                <office-list></office-list>
            </div>
        </div>
    </div>
</template>


<style scoped>
.container {
    margin: auto;
    width: 1200px;
}
.content{
    width: 100%;
    display: flex;
    flex-direction: row;
    height: 600px;
}
.left {
    width: 50%;
    display: flex;
    flex-direction: column;
}

.right {
    display: flex;
    width: 50%;
    flex-direction: column;
    margin-left: 5px;
}
</style>