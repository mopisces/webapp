const sg = {
	namespaced: true,
	state: { 
		title : '',
		tabbar:'sgMenu',
		//socket连接状态
		isSuccessConnect : false,
		navList:null,
		alterValue:[]
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
		},
		setAlertValue( state, value ){
			if( value.type == 'push' ){
				if( !state.alterValue[value.configIndex] ){
					state.alterValue[value.configIndex] = [];
				}
				state.alterValue[value.configIndex].push(value.record);
			}
			if( value.type == 'clear' ){
				state.alterValue[value.configIndex] = [];
			}
		}
	},
	actions:{
		
	}
};
export default sg;