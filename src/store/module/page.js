const page = {
	namespaced: true,
	state: {
		/*页面宽度*/
		pageW: null,
		/*页面高度*/
		pageH: null,
		/*中间滑动区域高度*/
		viewH: null,
		/*顶部标题*/
		title: '利鹏科技',
		/*底部当前激活*/
		active: 'home',
	},

	getters: {
		pageW: (state) => state.pageW,
		pageH: (state) => state.pageH,
		viewH: (state) => state.viewH,
		title: (state) => state.title,
		active: (state) => state.active,
	},

	mutations: {
		setPageW( state, pageW ) {
			state.pageW = pageW
		},
		setPageH( state, pageH ) {
			state.pageH = pageH
		},
		setViewH( state, viewH ) {
			state.viewH = viewH
		},
		setTitle( state, title ) {
			state.title = title
		},
		setActive( state, active ) {
			state.active = active
		}
	},

	actions: {
		async setPageInfo({commit}, sysInfo) {
			await commit('setPageW', sysInfo.screenWidth)
			await commit('setPageH', sysInfo.screenHeight)
			await commit('setViewH', sysInfo.screenHeight - 96)
		}
	}
}
export default page