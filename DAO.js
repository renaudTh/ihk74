class DAO{

    static async getMatrix(locations){
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

    static async getRoutes(start, end){
        let url = `http://router.project-osrm.org/route/v1/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&continue_straight=false`
        let res = await fetch(url);
        let data = await res.json();
        return data.routes[0];
    }

    static async getNominatimLocation(query){
        let response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=geojson&addressdetails=1`)
        let data = await response.json();
        if (data.features.length >= 1)
            return data.features[0];
        return 0;
    }

    static async getAddressLocation(query){
        let response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${query}&limit=1`, { method: 'GET', mode: 'cors' })
        let data = await response.json();
        return data.features[0]
    }
    
    static async getLocation(query){
        let nominatim = await this.getNominatimLocation(query);
        if(nominatim) return nominatim;
        let address = this.getAddressLocation(query);
        return address;
    }
}

