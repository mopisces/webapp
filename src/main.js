import App from './App.vue';
import router from './router';
import store from './store';
import request from './request';
import 'vue-easytable/libs/themes-base/index.css';
import './assets/icon/icon.css';
import './assets/icon/my.css';
import TableOperate from '@/components/subject/table/TableOperate.vue'; 
/*import axios from 'axios';*/
Vue.component("TableOperate",TableOperate);

Vue.config.productionTip = false;//生产提示
Vue.prototype.$request   = request;
/*Vue.prototype.getConfigJson = ()=>{
	axios.get('domainConfig.json').then((res)=>{
		console.log(res)
		window.jpdnApiUrl = res.data;
	}).catch(err=>{
		console.log(err)
	});
};*/
new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
