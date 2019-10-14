import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import request from './request';
import 'vue-easytable/libs/themes-base/index.css';
import './assets/icon/icon.css';
import './assets/icon/my.css';
Vue.config.productionTip = false;
Vue.prototype.$request = request;

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
