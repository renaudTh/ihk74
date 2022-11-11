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

function initMap(coordinates, id) {

    var map = L.map(id).setView(coordinates, 11);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map
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
            //Get patient location
            let patient = await DAO.getLocation(query);
            //Build locations array
            let locations = [];
            locations.push(patient.geometry.coordinates);
            for (let office of officeList) {
                locations.push(office.getCoordinates());
            }
            //compute Distance matrix
            let matrix = await DAO.getMatrix(locations);
            matrix = matrix.distances.map((elt) => elt[0])
            //Extract min office_id
            let min = Math.min(...matrix);
            let theMin = {
                min: min,
                index: matrix.indexOf(min)
            }
            let theMinOffice = officeList[theMin.index];
            let selectedOffice = officeList[selected];
            let minRoute = await DAO.getRoutes(locations[0], locations[theMin.index+1]);
            let selectedRoute = await DAO.getRoutes(locations[0], locations[selected+1]);
            
            results.innerHTML = `<p>Le cabinet le plus proche est ${theMinOffice.name} à ${(minRoute.distance / 1000).toFixed(2)} km</p> 
                                <p>Le cabinet ${selectedOffice.name} se trouve à ${(selectedRoute.distance / 1000).toFixed(2)} km</p>
                                <p><strong>Tarif applicable : ${computePrice(minRoute.distance / 1000)} €.</strong>
                                <p>Détails : ${priceDetails(minRoute.distance / 1000)}`;

            layers.clearLayers();
            layers.addData(theMinOffice.location)
            layers.addData(selectedOffice.location)
            layers.addData(patient);
            layers.addData(minRoute.geometry);
            layers.addData(selectedRoute.geometry);
            layers.addTo(map);
            map.fitBounds(layers.getBounds());

        }

    });

}

main();



