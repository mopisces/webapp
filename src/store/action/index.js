import { asyncStaffRouterMap } from '@/router/index';
const actions = {
	permission : ( { commit }, authUrlArr )=>{
		let routeArr  = deepCopy(asyncRouterMap);
		const navList = filterAsyncRouter( routeArr, authUrlArr );
		commit('setNavList', navList);
	}
};

function filterAsyncRouter (asyncRouterMap, roles) {
	const accessedRouters = asyncRouterMap.filter( route => { 
		
	});
}

function deepCopy (routeArr) {
	return routeArr.map((arr) => {
		arr = Object.assign({}, arr)
			return arr
	});
}

export default actions;