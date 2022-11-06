async function getLocationFromQuery(query) {

    let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=geojson&addressdetails=1`)
    let data = await response.json();
    if (data.features.length >= 1)
        return data.features[0];

    return getUniqueLocationFromFrance(query);
}

async function getUniqueLocationFromFrance(query) {
    let response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=1`, { method: 'GET', mode: 'cors' })
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


function officeTemplate(office, map) {

    let container = document.createElement('div')
    container.id = office.id;
    container.classList.add('office')
    container.innerHTML = `<h3>${office.name}</h3><p>${office.address.street}<br>${office.address.postalCode} ${office.address.city}</p>`

    container.addEventListener('click', () => {
        let previous = document.getElementsByClassName('selected');
        [...previous].forEach((elt) => elt.classList.remove('selected'))
        container.classList.add('selected')

    })
    return container;
}
function officeListTemplate(parentNode, officeList, map) {
    for (let office of officeList) {
        let template = officeTemplate(office, map);
        parentNode.appendChild(template);
    }
}

function getCoordinates(office) {
    return office.geometry.coordinates;
}
function getSelectedIndex() {
    let selected = document.getElementsByClassName('selected');
    return parseInt(selected[0].id);
}

async function getMatrix(locations) {

    let size = locations.length;
    let sources = [...Array(size - 1).keys()].map((elt => (elt + 1 - '0')));

    let url = "https://api.openrouteservice.org/v2/matrix/driving-car/"
    let body = {
        locations: locations,
        destinations: [0],
        sources: sources,
        metrics: ["distance"],
        units: "km"
    }

    let requestParams = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": '5b3ce3597851110001cf624849f34c231cdf421d93bca946751bfc5e'
        },
        mode: "cors",
        body: JSON.stringify(body)
    }
    let res = await fetch(url, requestParams)
    let data = await res.json();
    return data.distances;
}

function minOffice(distances) {

    let min = Math.min();
    let index = 0;
    for (let i = 0; i < distances.length; i++) {
        if (distances[i][0] < min) {
            min = distances[i][0];
            index = i;
        }
    }
    return {
        min: min,
        id: index
    }

}

async function getRoute(start, end){

    let url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"
    let body = {
        coordinates : [start, end],
        instructions: false,
        preference: "shortest",
        units: "km"
    }

    let requestParams = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": '5b3ce3597851110001cf624849f34c231cdf421d93bca946751bfc5e'
        },
        mode: "cors",
        body: JSON.stringify(body)
    }
    let res = await fetch(url, requestParams)
    let data = await res.json();
    return data

}
async function main() {

    let res = await fetch('office.json', { mode: 'no-cors' })
    let cab = await res.json();
    
    officeListTemplate(officeList, cab);
    search.addEventListener('click', async () => {
        if (address.value != "") {
            let query = address.value;
            let data = await getUniqueLocationFromFrance(query);
            let locations = [];
            locations.push(getCoordinates(data));

            for (let office of cab) {
                locations.push(getCoordinates(office.location));
            }
            let matrix = await getMatrix(locations);

            let theMin = minOffice(matrix);
            let theMinOffice = cab[theMin.id];
            let selectedOffice = cab[getSelectedIndex()];
            let fromSelected = matrix[getSelectedIndex()][0]

            let minRoute = await getRoute(locations[0], locations[theMin.id+1]);
            let selectedRoute = await getRoute(locations[0], locations[getSelectedIndex()+1]);

            let map = L.map('map').setView([
                6.3046332,
                46.0763007
            ].reverse(), 11);
            const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            L.geoJSON(theMinOffice.location).addTo(map)
            L.geoJson(selectedOffice.location).addTo(map)
            L.marker(locations[0].reverse()).addTo(map)

            L.geoJSON(minRoute).addTo(map);
            L.geoJSON(selectedRoute).addTo(map);

        }

    });

}

main();



