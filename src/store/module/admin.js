import { asyncAdminRouterMap } from '@/router/admin';
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
		permission : ({commit})=>{
			commit('setNavList', asyncAdminRouterMap);
		}
	},
};
export default admin;