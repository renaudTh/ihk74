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
    async computeRouteTo(patientCoordinates){
        let route = await DAO.getRoutes(patientCoordinates, this.getCoordinates());
        return route;
    }
}

class Matrix{

    buildLocations(patient, officeList){
        let locations = [];
        locations.push(patient.geometry.coordinates);
        for (let office of officeList) {
            locations.push(office.getCoordinates());
        }
        return locations;
    }
    constructor(patient, officeList){
        this.patient = patient;
        this.officeList = officeList;
        this.locations = this.buildLocations(patient, officeList);
    }
    async fetchMatrix(){
        let data = await DAO.getMatrix(this.locations);
        this.matrix = data.distances.map((elt) => elt[0]);
    }
    findNearestOffice(){
        let minDist = Math.min(...this.matrix);
        let minIndex = this.matrix.indexOf(minDist);
        return this.officeList[minIndex];
    }
    findSelectedOffice(selected){
        return this.officeList[selected];
    }
    getPatient(){
        return this.patient;
    }
    getPatientLocation(){
       return this.locations[0];
    }   
}

class BackgroundMap{

    constructor(mapId, initCoordinates, zoomLevel){
        this.layers = L.geoJSON();
        this. map = L.map(mapId).setView(initCoordinates.reverse(), zoomLevel);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }

    addLayer(geoJson){
        this.layers.addData(geoJson)
    }

}