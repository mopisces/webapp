import { tokenTableName, userInfoName, authMapName } from '@/config/settings.js'
import { getStorage, setStorage } from '@/util/storage'
/*vant组件*/
import { Toast } from 'vant'
/*api接口*/
import { login, getUserInfo } from '@/api/common/index.js'
/*路由信息*/
import { asyncClientRouterMap } from '@/router/client'
import { asyncStaffRouterMap } from '@/router/staff'
import { asyncAdminRouterMap } from '@/router/admin'
import { deepCopy, filterAsyncRouter } from '@/util/index'
import router from '@/router'

const user = {
	namespaced: true,

	state: {
		accessToken: getStorage(tokenTableName, 'sessionStorage'),
		userInfo: JSON.parse(getStorage(userInfoName)),
		authMap: JSON.parse(getStorage(authMapName, 'sessionStorage')),
		userType: getStorage('login-type', 'sessionStorage'),
		navList: null,
	},

	getters: {
		accessToken: (state) => state.accessToken,
		userInfo: (state) => state.userInfo,
		authMap: (state) => state.authMap,
		userType: (state) => state.userType,
		navList: (state)=> state.navList
	},

	mutations: {
		setAccessToken( state, accessToken ){
			state.accessToken = accessToken
			setStorage(tokenTableName, accessToken, 'sessionStorage')
		},
		setUserInfo( state, info ){
			state.userInfo = info
			setStorage(userInfoName, JSON.stringify(info))
		},
		setAuthMap( state, auth ){
			state.authMap = auth
			setStorage(authMapName, auth, 'sessionStorage')
		},
		setUserType( state, type ) {
			state.userType = type
			setStorage('login-type', type, 'sessionStorage')
		},
		setNavList( state, navList ) {
			state.navList = navList
		}
	},

	actions: {
		async login({ commit }, userInfo){
			const { result } = await login(userInfo)
			const { access_token, user_name, user_pwd } = result
			if (result) {
				commit("setAccessToken", access_token)
				if( userInfo.user_type == 0 ) {
					commit("setUserType", "client")
				} else if( userInfo.user_type == 1 ) {
					commit("setUserType", "staff")
				} else {
					commit("setUserType", "admin")
				}
				this.dispatch("user/getUserInfo")
			} else {
				Toast.fail({
					message: '登录接口异常,未正确返回',
					duration: 3000
				})
			}
		},
		logout({ commit }) {
			commit("setAccessToken", '')
			commit("setUserInfo", {})
			commit("setAuthMap", [])
		},
		async getUserInfo({ commit, dispatch }) {
			const { result } = await getUserInfo()
			const { select, available, userInfo } = result
			commit("setUserInfo", userInfo)
			commit("setAuthMap", available)
			//dispatch("setNavList")
		},
		async setNavList({commit, state}) {
			if( state.userType == 'client' ) {
				let routeArr  = deepCopy(asyncClientRouterMap)
				const navList = filterAsyncRouter( routeArr, state.authMap, 'client')
				await commit('setNavList', navList)
			}
			if( state.userType == 'staff' ) {
				let routeArr  = deepCopy(asyncStaffRouterMap)
				const navList = filterAsyncRouter( routeArr, state.authMap, 'staff' )
				await commit('setNavList', navList)
			}
			if( state.userType == 'admin' ) {
				await commit('setNavList', asyncAdminRouterMap)
			}
			await router.addRoutes(state.navList)
		}
	}
}

export default user