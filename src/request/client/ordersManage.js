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
			erp_date_type    : date.dateType,
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
	},
	dailyOrdersConfig(){
		return get(client.ordersManage.dailyOrdersConfig);
	},
	dailyOrdersCusInfo( data ){
		let postData = {
			daily_begin_date : data.beginDate,
			daily_end_date   : data.endDate
		};
		return post(client.ordersManage.cusInfo,postData);
	},
	dailyOrderOptionalDate( data ){
		let postData = {
			daily_begin_date : data.beginDate,
			daily_end_date   : data.endDate,
			order_id         : data.orderId,
			cus_order_id     : data.cusOrderId,
			border_length    : data.borderLength,
			border_width     : data.borderWidth,
			line_ball        : data.lineBall,
			order_quantities : data.orderQuantities,
			daily_order_state: data.orderState
		};
		return post(client.ordersManage.optionalDate,postData);
	},
	dailyOrders( data ){
		let postData = {
			daily_order_state  : data.orderState,
			daily_booking_date : data.bookingDate
		};
		return post(client.ordersManage.dailyOrders,postData);
	},
	commonOrders( data ){
		let postData = {
			common_order_type : data.orderType,
			cur_page          : data.curPage
		};
		return post(client.ordersManage.commonOrders, postData);
	},
	cancelCommon( orderId ){
		return post(client.ordersManage.cancelCommon, { cancel_order_id : orderId });
	}
};
export default ordersManage;