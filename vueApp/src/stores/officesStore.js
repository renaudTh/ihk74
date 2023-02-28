import { defineStore } from 'pinia'

export const useOfficesStore = defineStore({

  id: 'offices',
  state: () => ({
    offices: [],
    selected: 10,

  }),

  actions: {
    async getOfficeList() {

      let res = await fetch('office.json');
      let data = await res.json();
      this.offices = data;
    },

    selectOne(id) {
      this.$patch((state) => {
        state.selected = id;
      })
    }
  },
  getters: {
    getOne: (state) => {
      return (id) => state.offices.find((office => office.id == id))
    },
    getSelected: (state) => {
      return () => state.offices.find((office => office.id == state.selected))
    },
    

  }
});