import { defineStore } from 'pinia'

export const useOfficesStore = defineStore({

  id: 'offices',
  state: () => ({
    offices: [],
    selected: 0,

  }),

  actions: {
    async getOfficeList() {

      let res = await fetch('office.json');
      let data = await res.json();
      this.offices = data;
    },

    selectOne(id){
      this.$patch((state) => {
        state.selected = id;
    })
    }
  },
  getters: {
    /*getOne: (state) => {
        return (id) => state.articles.find((article => article.id == id))
    },
    showPrice: () => {
        return (article) => (article.prix > 0) ? article.prix + " €" : "Gratuit"
    },
    showCategory: () => {
        return (article) => (article.categories) ? article.categories.nom : 'En vrac'
    }*/
  }

})