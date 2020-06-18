import { asyncAdminRouterMap } from '@/router/admin';
import { deepCopy } from '@/util/index';
const admin = {
	namespaced: true,
	state: {
		navList : null,
	},
	mutations:{
		setNavList( state, navList ){
			state.navList = navList;
		}
	},
	actions: {
		permission : ({commit}, isAdmin)=>{
			let routeArr  = deepCopy(asyncAdminRouterMap);
			commit('setNavList', asyncAdminRouterMap);
		}
	},
};
export default admin;