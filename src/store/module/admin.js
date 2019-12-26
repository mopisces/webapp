const admin = {
	namespaced: true,
	state: {
		layout:{
			title:'菜单页面'
		}
	},
	mutations:{
		setHeaderTitle( state, title ){
			state.layout.title = title;
		},
	},
	actions: {},
};
export default admin;