import { asyncStaffRouterMap } from '@/router/index';
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
		domain:'http://test.leaper.ltd:1104',
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
			const navList = filterAsyncRouter( routeArr, authUrlArr );
			commit('setNavList', navList);
		}
	},
};
function filterAsyncRouter (asyncStaffRouterMap, roles) {
	const accessedRouters = asyncStaffRouterMap.filter( route => { 
		if( typeof(roles) === 'object'){
			for (var i = roles.length - 1; i >= 0; i--) {
				if( inStaffWhiteList(route.meta.title) || route.meta.title.indexOf(roles[i]) >= 0 ){
					if( route.children && route.children.length){
						route.children = filterAsyncRouter( route.children,roles );
					}
					return route;
				}
			}
		}else{
			if( inStaffWhiteList(route.meta.title)  || route.meta.title.indexOf(roles) >= 0 ){
				return route;
			}
		}
	});
	return accessedRouters;
}

function deepCopy (routeArr) {
	return routeArr.map((arr) => {
		arr = Object.assign({}, arr)
			return arr
	});
}

function inStaffWhiteList( search ){
	let staffWhiteList = [
		'内部人员使用',
		'菜单页面'
	];
	for (var i = staffWhiteList.length - 1; i >= 0; i--) {
		if( staffWhiteList[i] === search ){
			return true;
			break;
		}
	}
	return false;
}
export default staff;