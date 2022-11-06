import fetch from 'node-fetch';
import fs from 'fs'

async function getAllOffices() {

    let url = 'https://gateway.api.esante.gouv.fr/fhir/Organization?'

    let searchParams = new URLSearchParams({
        'type': decodeURI('https://mos.esante.gouv.fr/NOS/TRE_R75-InseeNAFrev2Niveau5/FHIR/TRE-R75-InseeNAFrev2Niveau5%7C86.90D'),
        'address-postalcode': '74800,74930,74570'
    })

    let header = {
        'ESANTE-API-KEY': '056a63e0-f48f-48f3-a9d9-7545f600210f',
    }

    let requestParams = {
        method: "GET",
        headers: header,
    }
    let res = await fetch(url + searchParams, requestParams)
    let data = await res.json()

    return data.entry;
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
    if(data.features.length > 0)
        return data.features[0];
}
async function buildOffice(entry) {

    let address = parseAddress(entry.address);
    return {
        name: entry.name,
        active: entry.active,
        address: address,
    }
}
function parseAddress(address) {

    let line = address[0]._line[0];
    let street = line.extension[0].valueString + ' ' + line.extension[1].valueString;
    let city = address[0].city.substring(address[0].city.indexOf(' ') + 1);
    let postalCode = address[0].postalCode;
    return {
        street: street,
        city: city,
        postalCode: postalCode,
        country: 'France'
    }
}

function hashAddress(address) {
    return address.street + " " + address.postalCode + " " + address.city
}
async function getLocation(address) {
    let params = new URLSearchParams(address)
    let response = await fetch(`https://nominatim.openstreetmap.org/search?${params}&format=geojson&limit=1`)
    let data = await response.json();
    if(data.features.length > 0)
        return data.features[0];

    let query = hashAddress(address);
    response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=1`,{method: 'GET', mode:'cors'})
    data = await response.json()
    return data.features[0];
}

async function createDataBase(all) {
    let cleaned = []
    let addresses = new Map()
    let id = 0;
    for (let entry of all) {

        let office = await buildOffice(entry.resource)
        let hash = hashAddress(office.address)
        if (!addresses.has(hash)) {
            addresses.set(hash, true)
            office.id = id;
            office.location = await getLocation(office.address)
            if (office.location)
                office.isochrone = await getIsochrone(office.location.geometry.coordinates.reverse(), 1500);
            
            cleaned.push(office)
            id++;
        }
    }
    return cleaned
}
let all = await getAllOffices();
let db = await createDataBase(all);

let json = JSON.stringify(db)
fs.writeFile("office.json", json, 'utf8', (err) => {
    if(err)
        console.log(err)
    else 
        console.log("db created")
});
