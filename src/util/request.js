/*vant组件*/
import { Dialog, Toast } from "vant"
/*vuex状态*/
import store from "@/store"
/*axios库*/
import axios from "axios"
/*QS库*/
import QS from "qs"
/*router路由*/
import router from "@/router"

import { 
	tokenName,
	successCode 
} from  '@/config/settings.js'

import { isArray } from '@/util/validate.js'

const request = axios.create()
/*全局超时时间*/
request.defaults.timeout = 15000
/*全局post请求头部*/
request.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
/*请求拦截器*/
request.interceptors.request.use(
	config => {
		Toast.loading({
			mask: true,
			message: '数据请求...',
			loadingType: 'spinner',
			duration: 0,
			getContainer: 'body'
		})
		if( store.getters['user/accessToken'] ) {
			config.headers.Authentication =  store.getters['user/accessToken']
		}
		/*外部用户token*/
		if( store.getters['client/accessToken'] ) {
			config.headers.Authentication =  store.getters['client/accessToken']
		}
		return config
	},
	error => {
		Toast.clear()

		return Promise.reject(config)
	}
)

/*响应拦截器*/
request.interceptors.response.use(
	response => {
		Toast.clear()
		const { status, data, config } = response
		const { errorCode, msg, result } = data
		const codeVerificationArray = isArray(successCode) ? [...successCode] : [...[successCode]]
		if (codeVerificationArray.includes(errorCode)) {
			return data
		} else {
			handleCode(errorCode, msg)
			return Promise.reject("请求异常拦截:" + JSON.stringify({ url: config.url, errorCode, msg }) || "Error")
		}
	},
	error => {
		Toast.clear()
		const { response, message } = error

		if (error.response && error.response.data) {
			const { status, data } = response
			Toast.fail(data.msg || message)
			return Promise.reject(error)
		} else {
			const { message } = error
			if (message === "Network Error") {
				message = "后端接口连接异常"
			}
			if (message.includes("timeout")) {
				message = "后端接口请求超时"
			}
			if (message.includes("Request failed with status code")) {
				const code = message.substr(message.length - 3)
				message = "后端接口" + code + "异常"
			}
			Toast.fail(message)
			return Promise.reject(error)
		}
	}
)

const handleCode = (code, msg) => {

	switch (code) {
		case 10001:
			Toast.fail('请求方式错误')
			break;
		case 10014:
			Toast.fail(msg || '微信模块参数错误')
			break;
		case 10203:
			relogin( msg || '服务器内部错误,请稍后再试' )
			break;
		//支付宝支付参数错误
		case 10300:
			Toast.fail(msg || '支付宝支付参数错误')
			break;
		//微信模块参数错误
		case 10400:
			Toast.fail( msg || '微信模块参数错误')
			break;
		//ERP下单系统不可用
		case 20200:
			Toast.fail('ERP下单系统不可用')
		//参数错误
		case 20201:
			Toast.fail( msg || '查询参数不符合条件')
			break;
		//没有访问权限
		case 20204:
			reMenu( msg || '没有访问权限,请重新登录' )
			break;
		//令牌验证失败
		case 20205:
			relogin( msg || '令牌验证失败,请重新登录' )
			break;
		//数据库操作失败
		case 20220:
			Toast.fail(msg || '数据库操作失败')
			break;
		//空数据
		case 20250:
			Toast.fail(msg || '没有更多数据了')
			break;
		//团购失败
		case 20260:
			Toast.fail(msg || '团购失败')
			break;
		default :
			Toast.fail(msg);
			break;
	}
}

const relogin = ( msg )=>{
	Dialog({
		message: msg || '请重新登录'
	}).then(()=>{
		switch(store.getters['user/userType']) {
			case 'client':
				router.push('/group/client/login')
			case 'staff':
				router.push('/group/staff/login')
			case 'admin': 
				router.push('/admin/login')
			default:
				router.push('/group/client/login')
				break
		}
	})
}

const reMenu = ( msg )=>{
	Dialog({
		message: msg || '请重新登录'
	}).then(()=>{
		switch(store.getters['user/userType']) {
			case 'client':
				router.push('/client/index/menu')
			case 'staff':
				router.push('/staff/index/menu')
			case 'admin': 
				router.push('/admin/login')
			default:
				router.push('/group/client/login')
				break
		}
	})
}

export default request