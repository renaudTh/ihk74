<template>
   <p>
            Cet outil a pour but de calculer le montant des indemnités horo-kilométriques (ihk) facturables par les infirmières libérales de Haute-Savoie. Pour l'instant, seuls les cabinets des codes postaux 74800, 74930 et 74750 sont répertoriés.
            <br><br><strong>Mode d'emploi :</strong>
            <ul>
                <li>Sélectionnez votre cabinet dans la liste</li>
                <li>Entrez l'adresse d'un patient</li>
                <li>Cliquez sur le boutton "rechercher" ou appuyez sur entrée.</li>
                <li>Dans le rectangle en haut à droite s'affichent :
                <ul>
                    <li>Le cabinet le plus proche de l'adresse renseignée et la distance qui l'en sépare.</li>
                    <li>La distance entre votre cabinet et l'adresse renseignée.</li>
                    <li>Le montant facturable avec le calcul des indemnités kilométriques.</li>

                </ul></li>
            </ul>
        </p>
</template>

<style scoped>
p{
    margin: 5px;
}
ul{
    list-style-position: inside;
}
li ul{
    margin-left: 25px;
}
li {
    margin: 3px;
}
</style>