import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import request from './request';
import 'vue-easytable/libs/themes-base/index.css';
import './assets/icon/icon.css';
import './assets/icon/my.css';

import ElementUI from 'element-ui';
Vue.use(ElementUI);

import TableOperate from '@/components/subject/table/TableOperate.vue'; 
/*import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
	color: '#1890ff',
	failedColor: 'red',
	height: '1rem'
});*/
Vue.component("TableOperate",TableOperate);

Vue.config.productionTip = false;
Vue.prototype.$request = request;
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
