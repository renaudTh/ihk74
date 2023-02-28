import { defineStore } from 'pinia'

export const useResultsStore = defineStore({

  id: 'results',
  state: () => ({
    minimalRoute: null,
    selectedRoute: null,
    patientLocation: null,
    status: "no"
  }),

  actions: {
    setMinimalRoute(route){
        this.$patch((state) => {
            state.minimalRoute = route;
        })
    },
    setSelectedRoute(route){
        this.$patch((state) => {
            state.selectedRoute = route;
        })
    },
    setPatientLocation(location){
        this.$patch((state) => {
            state.patientLocation = location;
        })
    }
  },
  getters: {

    getMinimalDistance(){
        return () => (this.minimalRoute.distance / 1000).toFixed(2);
    },
    getSelectedDistance(){
        return () => (this.selectedRoute.distance / 1000).toFixed(2);
    },
    computePrice(){
        return () => {
            let distance = this.getMinimalDistance();
            let ifd = 2.5;
            let ihk = (distance < 1.5) ? 0 : Math.round((distance * 2) - 2);
            return (ifd + 0.51 * ihk).toFixed(2);
        }
    },
    priceDetails(){
        return () => {
            let s = "";
            let distance = this.getMinimalDistance();
            let ifd = 2.5;
            let ihk = 0
            if(distance < 1.5){
                s = `ihk = 0`
            }
            else{
                ihk = Math.round((distance * 2) - 2)
                s = `ihk = [2x${distance}-2] = ${ihk}`
            }
            s+=` ; ifd + 0.51ihk = ${ifd} + 0.51 x ${ihk} = ${this.computePrice()}`;
            return s;
        }
    },
    getNearestOfficeIndex(){
        return () => this.minimalRoute.officeIndex;
    },
    getSelectedOfficeIndex(){
        return () => this.selectedRoute.officeIndex;
    }
  }
});