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
    getNearestOfficeIndex(){
        return () => this.minimalRoute.officeIndex;
    },
    getSelectedOfficeIndex(){
        return () => this.selectedRoute.officeIndex;
    }
  }
});