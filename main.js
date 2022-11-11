
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
function computePrice(distance) {
    let ifd = 2.5;
    let ihk = Math.round((distance * 2) - 2);
    return ifd + 0.51 * ihk;
}
function priceDetails(distance) {
    let ihk = Math.round((distance * 2) - 2);
    return `(${distance.toFixed(2)} x 2) - 2 arrondi = ${ihk}, donc total = 2.5 + ${ihk}x0.51 = ${2.5 + ihk * 0.51}`;
}

function printResults(nearestOffice, minRoute, selectedOffice, selectedRoute) {
    results.innerHTML = `<div><p>Le cabinet le plus proche est ${nearestOffice.name} à ${(minRoute.distance / 1000).toFixed(2)} km</p> 
    <p>Le cabinet ${selectedOffice.name} se trouve à ${(selectedRoute.distance / 1000).toFixed(2)} km</p>
    <p><strong>Tarif applicable : ${computePrice(minRoute.distance / 1000)} €.</strong>
    <p>Détails : ${priceDetails(minRoute.distance / 1000)}</div>`;
}
async function main() {

    let officeList = await fetchOfficeList();
    let selected = 12;
    let loading = false;
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
    patientAddress.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (address.value != "") {

            results.innerHTML = "<div class='loader'></div>";
            let query = address.value;
            //Get patient location from query
            let patient = await DAO.getLocation(query);
            //compute Distance matrix
            let matrix = new Matrix(patient, officeList);
            await matrix.fetchMatrix();
            let nearestOffice = matrix.findNearestOffice();
            let selectedOffice = matrix.findSelectedOffice(selected);
            let minRoute = await nearestOffice.computeRouteTo(matrix.getPatientLocation());
            let selectedRoute = await selectedOffice.computeRouteTo(matrix.getPatientLocation());

            //TODO: check if selected distance isn't lower than the actual minimum
            printResults(nearestOffice, minRoute, selectedOffice, selectedRoute);

            layers.clearLayers();
            layers.addData(nearestOffice.location)
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



