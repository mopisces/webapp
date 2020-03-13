import { asyncAdminRouterMap } from '@/router/admin';
const admin = {
	namespaced: true,
	state: {
		navList : null,
		asideActive:'',
		asideMenu:{
			boardGroup : false,
			boxGroup   : false
		}
	},
	mutations:{
		setNavList( state, navList ){
			state.navList = navList;
		},
		setAsideActive( state, active ){
			state.asideActive = active;
		},
		setAsideMenuBoard( state, value ){
			state.asideMenu.boardGroup = value;
		},
		setAsideMenuBox( state, value ){
			state.asideMenu.boxGroup = value;
		}
	},
	actions: {
		permission : ({commit})=>{
			commit('setNavList', asyncAdminRouterMap);
		}
	},
};
export default admin;