import { asyncClientRouterMap } from '@/router/client';
import { deepCopy, filterAsyncRouter } from '@/util/index';
const client = {
	namespaced: true,
	state: { 
		layout : {
			title : '首页'
		},
		navList      : null,
		tabbarActive : 'menu',
		isLogin      : sessionStorage.getItem('jpdn-client-isLogin'),
		backPath     : '/client/index/menu'
	},
	mutations:{ 
		setHeaderTitle( state, title ){
			state.layout.title = title;
		},
		setNavList( state, navList ){
			state.navList = navList;
		},
		setTabbarActive( state, active ){
			state.tabbarActive = active;
		},
		setIsLogin( state, isLogin ){
			state.isLogin = isLogin;
		}
	},
	actions:{
		permission : ( { commit }, authUrlArr )=>{
			let routeArr  = deepCopy(asyncClientRouterMap);
			const navList = filterAsyncRouter( routeArr, authUrlArr, 'client');
			commit('setNavList', navList);
		}
	}
};
export default client;