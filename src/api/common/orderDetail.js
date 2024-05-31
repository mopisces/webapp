/*axios二次封装后的方法*/
import request from '@/util/request'
/*参数序列化*/
import QS from 'qs'
/*后台地址*/
import { backStageUrl } from '@/config/domain.js'
/*获取订单详细信息*/
export function getOrderDetail( data ) {
	return request({
		url: backStageUrl + '/arguments/orderDetail/getOrderDetail',
		method: 'POST',
		data: QS.stringify(data)
	})
}