import { get, post } from '../request';
import { client } from '../urlMap';
import axios from 'axios';
const ordersManage = {
	erpOrdersConfig(){
		return get(client.ordersManage.erpOrdersConfig);
	},
	erpOrders( data ){
		let postData = {
			erp_begin_date   : data.beginDate,
			erp_end_date     : data.endDate,
			erp_date_type    : '0',
			order_id         : data.orderId,
			border_length    : data.boardLength,
			border_width     : data.boardWidth,
			box_length       : data.boxLength,
			box_width        : data.boxWidth,
			box_height       : data.boxHeight,
			order_quantities : data.orderQuantity,
			is_from_wx       : data.isWx,
			order_type_state : data.orderType,
			cur_page         : data.curPage

		};
		return post(client.ordersManage.erpOrders,postData);
	}
};
export default ordersManage;