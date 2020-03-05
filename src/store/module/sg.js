const sg = {
	namespaced: true,
	state: { 
		title : '',
	},
	mutations:{ 
		setHeaderTitle( state, title ){
			state.title = title;
		}
	},
	actions:{
		
	}
};
export default sg;