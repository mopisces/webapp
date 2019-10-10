import Vue from 'vue';
import Vuex from 'vuex';
import states from './state';
import actions from './action';
import mutations from './mutation';
import admin from './module/admin';
import staff from './module/staff';
Vue.use(Vuex);

export default new Vuex.Store({
　　states,
 	mutations,
 	actions,
 	modules:{
 		admin,
 		staff
 	}
});	