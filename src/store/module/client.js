import { asyncClientRouterMap } from '@/router/client';
const client = {
	namespaced: true,
	state: { 
		layout : {
			title : '首页'
		},
		navList : null
	},
	mutations:{ 
		setHeaderTitle( state, title ){
			state.layout.title = title;
		},
		setNavList( state, navList ){
			state.navList = navList;
		}
	},
	actions:{
		permission : ( { commit } )=>{
			commit('setNavList', asyncClientRouterMap);
		}
	}
};
export default client;