const sg = {
	namespaced: true,
	state: { 
		title : '',
		//socket连接状态
		isSuccessConnect : false
	},
	mutations:{ 
		setHeaderTitle( state, title ){
			state.title = title;
		},
		setConnect( state, value ){
			state.isSuccessConnect = value;
		}
	},
	actions:{
		
	}
};
export default sg;