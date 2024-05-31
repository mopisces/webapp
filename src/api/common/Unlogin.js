/*axios二次封装后的方法*/
import request from "@/util/request"
/*参数序列化*/
import QS from "qs"

/**
 * [fetchConfigList 获取首页参数]
 */
export function fetchConfigList(data) {
	return request({
		url: backStageUrl + '/arguments/unLogin/fetchList',
		method: 'POST',
		data: QS.stringify(data)
	})
}