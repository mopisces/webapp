import { asyncStaffRouterMap } from '@/router/index';
const actions = {
	permission : ( { commit }, authUrlArr )=>{
		let routeArr  = deepCopy(asyncStaffRouterMap);
		const navList = filterAsyncRouter( routeArr, authUrlArr );
		console.log(navList);
		commit('setNavList', navList);
	}
};

function filterAsyncRouter (asyncStaffRouterMap, roles) {
	const accessedRouters = asyncStaffRouterMap.filter( route => { 
		/*for (var i = authUrlArr.length - 1; i >= 0; i--) {
			console.log(route.meta.title);
			console.log(authUrlArr[i]);
			//console.log(route.meta.title.indexOf(authUrlArr[i]));
			if( route.meta.title.indexOf(authUrlArr[i]) >= 0 ){
				if( route.children && route.children.length ){
					route.children = filterAsyncRouter( route.children,authUrlArr );
				}
				return route;
			}
		}*/
		if( typeof(roles) === 'object'){
			if( route.children && route.children.length ){
				route.children = filterAsyncRouter( route.children,roles )
			}
		}else{
			console.log(roles.length)
			for (var i = roles.length - 1; i >= 0; i--) {
				if( route.meta.title == '内部人员使用' || route.meta.title.indexOf(roles[i]) >= 0 ){
					return route;
				}
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

export default actions;