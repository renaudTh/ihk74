# Indemnités kilométriques pour les infirmières libérales de Haute-Savoie

Ce programme a pour but de calculer les indemnités kilométriques à facturer pour les infirmières libérales de Haute-Savoie.
A partir des cabinets actifs référencés, les infirmières et infirmirmiers d'un cabinet donné pourront, en entrant l'adresse d'un patient :
- Connaître son cabinet de référence
- Connaître la tarification à appliquer si ce patient doit être ajouté à la tournée en fonction du cabinet

## Stack

Pour la recherche des adresses, j'utilise l'API Adresse du gouvernement
Pour l'affichage d'une carte, j'utilise l'API leaflet.js
Pour le calcul d'itinéraires, j'utilise l'API openroute service

## Travail à faire

- Initialiser la carte sur le cabinet infirmier du foron à partir de son adresse
- champ de texte permettant de trouver l'adresse d'un patient (affichage des résultats dans une liste et sur la carte)
- Calcul et affichage sur la carte de l'itinéraire entre le cabinet et l'adresse du patient
- Calcul de la tarification à appliquer
- Tenir une base de donnée des cabinets infirmiers de la haute savoie, penser à stocker les isochrones (tableau des coordonnées) pour ne pas refaire d'appel à l'API systématiquement car ils sont chers
- Représenter les zones de 1.5km routiers autour du cabinet et les zones de tarification
- Déterminer le cabinet de référence de l'adresse du patient

## Organisation du code

- Créer un wrapper pour nominatim
- Créer un wrapper pour la carte
- créer un wrapper pour les appels à openroute