import base from '@/request/base';
const common = {
	namespaced: true,
	state: {
		title      : '',
		activeItem : '',
		useType    : '',
		indexActive: '',
		imgUrl     : base.imgDomain
	},
	mutations:{
		setTitle( state, title ){
			state.title = title;
		},
		setActive( state, active ){
			state.activeItem = active;
		},
		setType( state, type ){
			state.useType = type;
		},
		setIndexActive( state, name ){
			state.indexActive = name;
		}
	},
	actions: {
		
	},
};
export default common;