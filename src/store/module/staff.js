const staff = {
	namespaced: true,
	state: {
		layout:{
			title:'首页'
		},
		detailForm:{
			orderId:'',
			orderType:''
		}
	},
	mutations:{
		setHeaderTitle( state, title ){
			state.layout.title = title;
		},
		setDetailForm( state, data ){
			state.detailForm = Object.assign({},state.detailForm,data);
		}
	},
	actions: {

	},
};
export default staff;