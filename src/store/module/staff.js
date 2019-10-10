const staff = {
	namespaced: true,
	state: {
		layout:{
			title:'首页'
		}
	},
	mutations:{
		setHeaderTitle( state, title ){
			state.layout.title = title;
		}
	},
	actions: {

	},
};
export default staff;