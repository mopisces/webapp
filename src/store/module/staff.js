import { asyncStaffRouterMap } from '@/router/staff';
import { deepCopy, filterAsyncRouter } from '@/util/index';
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
		backPath : '/staff/index/menu'
	},
	mutations:{
		setHeaderTitle( state, title ){
			state.layout.title = title;
		},
		setDetailForm( state, data ){
			state.detailForm = Object.assign({},state.detailForm,data);
		},
		setNavList( state, navList ){
			state.navList = navList;
		},
		setWxConfig( state, config ){
			state.wxConfig = config;
		},
		setBackPath( state, path ){
			state.backPath = path;
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