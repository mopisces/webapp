import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import request from './request';
import 'vue-easytable/libs/themes-base/index.css';
import './assets/icon/icon.css';
import './assets/icon/my.css';

import StowTableDelivery from '@/components/subject/stow/StowTableDelivery.vue';
import StowTableDetail from '@/components/subject/stow/StowTableDetail.vue';
import StowTableLoading from '@/components/subject/stow/StowTableLoading.vue';
import StowDetailHandle from '@/components/subject/stow/StowDetailHandle.vue';
Vue.component("StowTableDelivery",StowTableDelivery);
Vue.component("StowTableDetail",StowTableDetail);
Vue.component("StowTableLoading",StowTableLoading);
Vue.component("StowDetailHandle",StowDetailHandle);

Vue.config.productionTip = false;
Vue.prototype.$request = request;
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
