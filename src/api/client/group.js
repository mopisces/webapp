/*axios二次封装后的方法*/
import request from '@/util/request'
/*参数序列化*/
import QS from 'qs'
/*后台地址*/
import { backStageUrl } from '@/config/domain.js'
/*获取页面参数*/
export function fetchConfig( data ) {
	return request({
		url: backStageUrl + '/v2/client/group/fetchConfig',
		method: 'POST',
		data: QS.stringify(data)
	})
}
/*获取团购数据*/
export function fetchList( data ) {
	return request({
		url: backStageUrl + '/v2/client/group/fetchDataList',
		method: 'POST',
		data: QS.stringify(data)
	})
}