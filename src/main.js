import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { instance } from './axios';
import VueAxios from 'vue-axios';
import { store } from './store';
import moment from 'moment';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "@fortawesome/fontawesome-free/css/regular.css";
import "@fortawesome/fontawesome-free/css/solid.css";
import "./main.css";

const app = createApp(App);

app.use(router);
app.use(VueAxios, instance);
app.use(store);

app.mixin({
    methods: {
        fromNow(value) {
            return moment(value).fromNow();
        },
        is404(error) {
            return error.response && error.response.status && 404 == error.response.status;
        },
        is422(error) {
            return error.response && error.response.status && 422 == error.response.status;
        },
    }
});

app.mount('#app');