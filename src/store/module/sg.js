import { asyncSgRouterMap } from '@/router/sg';
const sg = {
	namespaced: true,
	state: { 
		title : '',
		tabbar:'sgMenu',
		//socket连接状态
		isSuccessConnect : false,
		navList:null
	},
	mutations:{ 
		setHeaderTitle( state, title ){
			state.title = title;
		},
		setConnect( state, value ){
			state.isSuccessConnect = value;
		},
		setNavList( state, navList ){
			state.navList = navList;
		},
		setTabbar( state, value ){
			state.tabbar = value;
		}
	},
	actions:{
		permission : ( { commit } )=>{
			commit('setNavList', asyncSgRouterMap);
		}
	}
};
export default sg;