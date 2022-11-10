class Office {

    constructor() { }

    static from(json) {
        return Object.assign(new Office(), json);
    }
    getLocation() {
        return this.location;
    }
    getCoordinates() {
        return this.location.geometry.coordinates;
    }
    template() {
        let container = document.createElement('div')
        container.id = this.id;
        container.classList.add('office')
        container.innerHTML = `<h3>${this.name}</h3><p>${this.address.street}<br>${this.address.postalCode} ${this.address.city}</p>`
        return container;
    }
}

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
    return map
}

async function getMatrixOsrm(locations){

    let destinations = 0;
    let locationsUrl = locations[0][0]+","+locations[0][1]+";";
    let sources = "";
    for(let i = 1; i < locations.length; i++){
        let coord = locations[i]
        locationsUrl += coord[0]+","+coord[1]+";";
        sources += i+";" 
    }
    locationsUrl = locationsUrl.substring(0, locationsUrl.length - 1);
    sources = sources.substring(0, sources.length - 1);

    let url = "http://router.project-osrm.org/table/v1/driving/"+locationsUrl+"?sources="+sources+"&destinations="+destinations+"&annotations=distance";
    let res = await fetch(url);
    let data = await res.json();
    return data;
}

function minOffice(matrix) {

    let dmin = Math.min();
    let min = null;

    for (let i = 0; i < matrix.length; i++) {
        if (matrix[i].distance < dmin) {
            min = matrix[i];
            dmin = matrix[i].distance;
        }
    }
    return min;
}

async function getRoute(start, end) {
    let url = `http://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson`
    let res = await fetch(url);
    let data = await res.json();
    return data.routes[0];
}


async function fetchOfficeList() {
    let res = await fetch('office.json', { mode: 'no-cors' })
    let officeData = await res.json();
    return officeData.map((office) => Office.from(office))
}
function computePrice(distance){
    let ifd = 2.5;
    let ihk = Math.round((distance*2) - 2);
    return ifd + 0.51*ihk;
}

function priceDetails(distance){
    let ihk = Math.round((distance*2) - 2);
    return `(${distance.toFixed(2)} x 2) - 2 arrondi = ${ihk}, donc total = 2.5 + ${ihk}x0.51 = ${2.5+ihk*0.51}`;
}
async function main() {

    let officeList = await fetchOfficeList();
    let selected = 12;

    officeList.forEach((office) => {
        let template = office.template();
        document.getElementById('officeList').appendChild(template);
        template.addEventListener('click', () => {
            let prevId = selected.toString()
            if (template.id != prevId) {
                document.getElementById(prevId).classList.remove('selected');
                selected = parseInt(template.id);
                template.classList.add('selected');
            }
        })
    });
    document.getElementById(selected.toString()).classList.add('selected');
    let map = L.map('map').setView([
        6.3046332,
        46.0763007
    ].reverse(), 11);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    let layers = L.geoJSON();
    search.addEventListener('click', async () => {
        if (address.value != "") {
            let query = address.value;
            let data = await getLocationFromQuery(query);
            
            let locations = [];
            locations.push(getCoordinates(data));
            for (let office of officeList) {
                locations.push(office.getCoordinates());
            }
            let osrm = await getMatrixOsrm(locations);
            let matrix = await getMatrix(locations);
            matrix = prettifyMatrix(matrix)
            let theMin = minOffice(matrix);
            let theMinOffice = officeList[theMin.office_id];
            let selectedOffice = officeList[selected];
            let minRoute = await getRoute(locations[0], locations[theMin.office_id+1]);
            let selectedRoute = await getRoute(locations[0], locations[selected+1]);
            results.innerHTML = `<p>Le cabinet le plus proche est ${theMinOffice.name} à ${(minRoute.distance / 1000).toFixed(2)} km</p> 
                                <p>Le cabinet ${selectedOffice.name} se trouve à ${(selectedRoute.distance / 1000).toFixed(2)} km</p>
                                <p><strong>Tarif applicable : ${computePrice(minRoute.distance / 1000)} €.</strong>
                                <p>Détails : ${priceDetails(minRoute.distance / 1000)}`;

            layers.clearLayers();
            layers.addData(theMinOffice.location)
            layers.addData(selectedOffice.location)
            layers.addData(data);
            layers.addData(minRoute.geometry);
            layers.addData(selectedRoute.geometry);
            layers.addTo(map);
            map.fitBounds(layers.getBounds());

        }

    });

}

main();



