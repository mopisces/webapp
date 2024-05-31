import { asyncClientRouterMap } from '@/router/client';
import { deepCopy, filterAsyncRouter } from '@/util/index';

import { getStorage, setStorage } from '@/util/storage'
const client = {
	namespaced: true,
	state: { 
		layout: {
			title: '首页'
		},
		navList: null,
		tabbarActive: 'menu',
		isLogin: getStorage('jpdn-client-isLogin', 'sessionStorage'),
		backPath: '/client/index/menu',
		backIsGroup: true,
		loginRedirect: '/client/index/menu',
		headerTitle: '首页',
	},
	getters: {
		isLogin: (state) => state.isLogin,
		accessToken: (state) => state.accessToken,
		headerTitle: (state) => state.headerTitle,
		authMap: (state) => state.authMap
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
		async setIsLogin( state, isLogin ){
			state.isLogin = isLogin
			await setStorage('jpdn-client-isLogin', isLogin, 'sessionStorage') 
		},
		setBackIsGroup( state, isgroup ){
			state.backIsGroup = isgroup
		},
		setLoginRedirect( state, path ){
			state.loginRedirect = path;
		},
		setBackPath( state, path ) {
			state.backPath = path
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