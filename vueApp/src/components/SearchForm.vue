<template>
<form>
    <input type="text" name="address" id="address" placeholder="Entrez l'adresse d'un patient">
    <input type="submit" value="Rechercher">
</form>  
</template>

<script setup> 


</script>

<style scoped>
form{
    width: 100%;
}
input[type=text]{
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


