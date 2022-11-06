async function getLocationFromQuery(query) {

    let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=geojson&addressdetails=1`)
    let data = await response.json();
    return data
}

async function getLocationFromQueryFrance(query) {
    let response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}`)
    let data = await response.json();
    data = data.features[0].geometry.coordinates;
    return data.reverse()
}

async function getUniqueLocationFromFrance(query) {
    let response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=1`,{method: 'GET', mode:'cors'})
    let data = await response.json();
    return data.features[0]
}
function initMap(coordinates, id) {

    var map = L.map(id).setView(coordinates, 11);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    //L.marker(coordinates).addTo(map);
    return map
}

async function getIsochrone(startCoordinates, distance) {

    let url = "https://api.openrouteservice.org/v2/isochrones/driving-car/"
    let body = {
        locations: [startCoordinates.reverse()],
        range: [distance],
        range_type: "distance",
        area_units: "m",
        units: "m"
    }
    let myHeaders = new Headers({
        "Content-Type": "application/json",
        "Authorization": '5b3ce3597851110001cf624849f34c231cdf421d93bca946751bfc5e'
    });

    let requestParams = {
        method: "POST",
        headers: myHeaders,
        mode: "cors",
        body: JSON.stringify(body)
    }
    let res = await fetch(url, requestParams)
    let data = await res.json();
    return data;
}

function plotIsochrone(map, isochrone, color='blue') {
    let style = {
        color: color,
        fillColor: color,
        fillOpacity: 0.2
    }

    L.geoJSON(isochrone, {
        style: style
    }).addTo(map)
}

function plotPoint(map, point){

    L.geoJson(point).addTo(map);
}

function swapped(array) {
    let converted = []
    for (elt of array) {
        if (elt.length != 2) continue
        converted.push([elt[1], elt[0]])
    }
    return converted
}

function officeTemplate(office, map){

    let container = document.createElement('div')
    container.id = office.id;
    container.classList.add('office')
    container.innerHTML = `<h3>${office.name}</h3><p>${office.address.street}<br>${office.address.postalCode} ${office.address.city}</p>`

    container.addEventListener('click', ()=>{
        let previous = document.getElementsByClassName('selected');
        [...previous].forEach((elt) => elt.classList.remove('selected'))
        container.classList.add('selected')
        console.log(getSelectedIndex())
    })
    return container;
}
function officeListTemplate(parentNode, officeList, map){
    for(let office of officeList){
        let template = officeTemplate(office, map);
        parentNode.appendChild(template);
    }
}
function getSelectedIndex(){
    let selected = document.getElementsByClassName('selected');
    return selected[0].id;
}
async function main() {


    let coordinates = await getLocationFromQueryFrance("255 avenue Jean Morin 74800 La Roche sur foron")
    let map = initMap(coordinates, 'map')
    let res = await fetch('office.json', {mode: 'no-cors'})
    let cab = await res.json();
    
    for(let elt of cab){
        plotPoint(map, elt.location);
        plotIsochrone(map,elt.isochrone, 'blue')
    }

    officeListTemplate(officeList, cab, map);    
    search.addEventListener('click', async () => {

        let query = address.value;
        let data = await getUniqueLocationFromFrance(query)
        
        
    })
    
}

main();



