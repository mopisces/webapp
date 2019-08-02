import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import request from './request';
import 'vant/lib/index.css';

Vue.config.productionTip = false;
Vue.prototype.$request = request;

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
