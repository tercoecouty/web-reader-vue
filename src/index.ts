import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./app/App.vue";
import "./index.less";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");

// import Demo from "./app/Demo.vue";
// createApp(Demo).mount("#app");
