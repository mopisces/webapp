import { asyncStaffRouterMap } from '@/router/staff';
const actions = {
	permission : ( { commit }, authUrlArr )=>{
		let routeArr  = deepCopy(asyncStaffRouterMap);
		const navList = filterAsyncRouter( routeArr, authUrlArr );
		commit('setNavList', navList);
	}
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
export default actions;