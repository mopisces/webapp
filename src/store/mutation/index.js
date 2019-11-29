const mutations = {
	setNavList(state, navList){
		state.navList = navList;
	},
	setWxConfig( state, config ){
		state.wxConfig = config;
	}
};
export default mutations;