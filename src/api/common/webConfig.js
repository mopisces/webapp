/*axios二次封装后的方法*/
import request from '@/util/request'
/*参数序列化*/
import QS from 'qs'
/*后台地址*/
import { backStageUrl } from '@/config/domain.js'
/*获取参数--无JWT解码*/
export function getWebConfig( data ) {
	return request({
		url: backStageUrl + '/arguments/arguments/getWebConfig',
		method: 'POST',
		data: QS.stringify(data)
	})
}
/*获取参数--含JWT解码*/
export function getWebConfigJWT( data ) {
	return request({
		url: backStageUrl + '/arguments/arguments/getWebConfigJWT',
		method: 'POST',
		data: QS.stringify(data)
	})
}
//获取客户、材质、箱型列表
export function fetchDataList( data ) {
	return request({
		url: backStageUrl + '/arguments/arguments/fetchDataList',
		method: 'POST',
		data: QS.stringify(data)
	})
}
//下单界面(纸箱纸板淘宝箱下单包含需要支付下单)参数
export function getBuildOrdConfig( data ) {
	return request({
		url: backStageUrl + '/arguments/arguments/getBuildOrdConfig',
		method: 'POST',
		data: QS.stringify(data)
	})
}