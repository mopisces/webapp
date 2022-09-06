import App from './App.vue';
import router from './router';
import store from './store';
import request from './request';
import 'vue-easytable/libs/themes-base/index.css';
import 'normalize.css/normalize.css';
import './assets/icon/icon.css';
import './assets/icon/my.css';
import TableOperate from '@/components/subject/table/TableOperate.vue'; 
Vue.component("TableOperate",TableOperate);

Vue.config.productionTip = false;//生产提示
Vue.prototype.$request   = request;
Vue.config.devtools = true
import config from '@/request/config.js';

config.requestRemoteIp().finally(res => {
	new Vue({
		router,
		store,
		render: h => h(App),
	}).$mount('#app');
});
/*new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');*/