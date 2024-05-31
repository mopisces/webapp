import { asyncStaffRouterMap } from '@/router/staff';
import { deepCopy, filterAsyncRouter } from '@/util/index';

import { getStorage, setStorage } from '@/util/storage'
const staff = {
	namespaced: true,
	state: {
		layout:{
			title:'首页'
		},
		detailForm:{
			orderId:'',
			orderType:''
		},
		wxConfig : null,
		navList  : null,
		backPath : '/staff/index/menu',
		isLogin: getStorage('jpdn-staff-isLogin', 'sessionStorage')
	},
	getters: {
		isLogin: (state) => state.isLogin,
		headerTitle: (state) => state.headerTitle,
		authMap: (state) => state.authMap
	},
	mutations:{
		setHeaderTitle( state, title ){
			state.layout.title = title
		},
		setDetailForm( state, data ){
			state.detailForm = Object.assign({},state.detailForm,data)
		},
		setNavList( state, navList ){
			state.navList = navList
		},
		setWxConfig( state, config ){
			state.wxConfig = config
		},
		setBackPath( state, path ){
			state.backPath = path
		},
		setIsLogin(state, isLogin){
			state.isLogin = isLogin
			setStorage('jpdn-staff-isLogin', isLogin, 'sessionStorage') 
		}
	},
	actions: {
		permission : ( { commit }, authUrlArr )=>{
			let routeArr  = deepCopy(asyncStaffRouterMap);
			const navList = filterAsyncRouter( routeArr, authUrlArr, 'staff' );
			commit('setNavList', navList);
		}
	},
};
export default staff;