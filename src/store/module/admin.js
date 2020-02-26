import { asyncAdminRouterMap } from '@/router/admin';
const admin = {
	namespaced: true,
	state: {
		navList : null,
		asideActive:''
	},
	mutations:{
		setNavList( state, navList ){
			state.navList = navList;
		},
		setAsideActive( state, active ){
			state.asideActive = active;
		}
	},
	actions: {
		permission : ({commit})=>{
			commit('setNavList', asyncAdminRouterMap);
		}
	},
};
export default admin;