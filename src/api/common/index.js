/*axios二次封装后的方法*/
import request from '@/util/request'
/*参数序列化*/
import QS from 'qs'
/*后台地址*/
import { backStageUrl } from '@/config/domain.js'
/*获取登录页面参数*/
export function getSF() {
	return request({
		url: backStageUrl + '/v1/staff/getSF',
		method: 'GET'
	})
}
/*用户登录*/
export function login(data) {
	return request({
		url: backStageUrl + '/v1/index/login',
		method: 'POST',
		data: QS.stringify(data)
	})
}
/*用户快速登录*/
export function quickLogin(data) {
	return request({
		url: backStageUrl + '/v1/index/login',
		method: 'GET',
		params: data
	})
}
/*获取用户信息及权限*/
export function getUserInfo() {
	return request({
		url: backStageUrl + '/v1/staff/staffGetAuthName',
		method: 'POST'
	})
}

/*获取页面配置参数*/
export function fetchConfig() {
	return request({
		url: backStageUrl + '/v1/staff/config/fetchConfig',
		method: 'POST'
	})
}