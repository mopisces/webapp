/*axios二次封装后的方法*/
import request from '@/util/request'
/*参数序列化*/
import QS from 'qs'
/*后台地址*/
import { backStageUrl } from '@/config/domain.js'
/*获取客户数据列表*/
export function fetchList( data ) {
	return request({
		url: backStageUrl + '/v2/client/customer/fetchList',
		method: 'POST',
		data: QS.stringify(data)
	})
}
/*数据增删改*/
export function doOpData(data) {
	return request({
		url: backStageUrl + '/v2/client/customer/doOpData',
		method: 'POST',
		data: QS.stringify(data)
	})
}