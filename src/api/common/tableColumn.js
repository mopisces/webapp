/*axios二次封装后的方法*/
import request from '@/util/request'
/*参数序列化*/
import QS from 'qs'
/*后台地址*/
import { backStageUrl } from '@/config/domain.js'

/*获取表头数据*/
export function fetchColList( data ) {
	return request({
		url: backStageUrl + '/arguments/tableColumn/fetchColList',
		method: 'POST',
		data: QS.stringify(data)
	})
}