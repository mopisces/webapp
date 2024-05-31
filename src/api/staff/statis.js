/*axios二次封装后的方法*/
import request from '@/util/request'
/*参数序列化*/
import QS from 'qs'
/*后台地址*/
import { backStageUrl } from '@/config/domain.js'
/*获取统计数据列表*/
export function fetchList( data ) {
	return request({
		url: backStageUrl + '/v2/staff/statis/fetchList',
		method: 'POST',
		data: QS.stringify(data)
	})
}
/*统计详情列表*/
export function fetchDetailList(data) {
	return request({
		url: backStageUrl + '/v2/staff/statis/fetchDetailList',
		method: 'POST',
		data: QS.stringify(data)
	})
}