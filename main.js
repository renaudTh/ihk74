

async function getLocationFromQuery(query){

    let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1`)
    let data = await response.json();
    data = data[0]
    return {
        lon: data.lon,
        lat: data.lat
    }
}

function initMap(coordinates, id){
    var map = L.map(id).setView([coordinates.lat, coordinates.lon], 13);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    L.marker([coordinates.lat, coordinates.lon]).addTo(map);
    return map
}

async function getIsochrone(){

    let url = "https://api.openrouteservice.org/v2/isochrones/driving-car/"
    let body = {
        locations : [[6.305008661646254, 46.07830615322673]],
        range: [1500],
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
function getPolygonFromIsochrone(data){
    console.log(data)
    return data.features[0].geometry.coordinates[0];
}

function swapped(array){
    let converted = []
    for(elt of array){
        if(elt.length != 2) continue
        converted.push([elt[1], elt[0]])
    }
    return converted
}

function plotPolygon(coordinates, map){

    
    let coord = swapped(coordinates)
    L.polygon(coord).addTo(map);

}
async function  main(){

    let coordinates = await getLocationFromQuery("255 avenue Jean Morin 74800 La Roche sur foron")
    let map = initMap(coordinates, 'map')
    let iso = await getIsochrone();
    let isoPolygon = getPolygonFromIsochrone(iso);
    plotPolygon(isoPolygon,map)
}

main();