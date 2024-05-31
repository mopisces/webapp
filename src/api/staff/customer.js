/*axios二次封装后的方法*/
import request from '@/util/request'
/*参数序列化*/
import QS from 'qs'
/*后台地址*/
import { backStageUrl } from '@/config/domain.js'
/*获取客户管理数据列表*/
export function fetchList( data ) {
	return request({
		url: backStageUrl + '/v2/staff/customer/fetchCustList',
		method: 'POST',
		data: QS.stringify(data)
	})
}
/*更新客户数据*/
export function doUpdate(data) {
	return request({
		url: backStageUrl + '/v2/staff/customer/doUpdate',
		method: 'POST',
		data: QS.stringify(data)
	})
}
