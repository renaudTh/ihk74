import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";


const app = createApp(App);

export const tomTomKey = import.meta.env.TOMTOM_API_KEY;

app.use(createPinia());
app.use(router);

app.mount("#app");
