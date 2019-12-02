const client = {
	namespaced: true,
	state: { 
		layout : {
			title : '首页'
		}
	},
	mutations:{ 
		setHeaderTitle( state, title ){
			state.layout.title = title;
		},
	}
};
export default client;