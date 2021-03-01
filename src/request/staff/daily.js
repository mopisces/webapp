import { get, post } from '../request';

const daily = {
	dailyConfig(){
		return post( window.jpdn_domain_staff + 'staffDailyConfig');
	},
	getDailyOrder( data ){
		let addUserId = data.addUserId === true ? 1 : 0;
		let postData = {
			daily_begin_date   : data.beginDate,
			daily_end_date     : data.endDate,
			daily_add_user_id  : addUserId,
			daily_order_cus_id : data.cusName
		};
		return post( window.jpdn_domain_staff + 'staffDaily', postData );
	},
	getCusInfo( data ){
		let postData = {
			daily_cus_id     : data.CusId,
			daily_begin_date : data.beginDate,
			daily_end_date   : data.endDate,
		};
		return post( window.jpdn_domain_staff + 'staffGetCusInfo', postData );
	},
	getOrderDeatil( data ){
		let postData = {
			daily_cus_id         : data.cusId,
			daily_s_state        : data.sState,
			daily_order_date     : data.orderDate,
			daily_board_length   : data.boardLength,
			daily_board_width    : data.boardWidth,
			daily_cus_po_no      : data.cusPoNo,
			daily_order_id       : data.orderId,
			daily_order_quantity : data.orderQuantity,
			daily_score_info     : data.scoreInfo
		};
		return post( window.jpdn_domain_staff + 'staffDailyDetail', postData );
	},
	getCountOrder( data, filter ){
		let postData = {
			daily_cus_id     : data.cusId,
			daily_begin_date : data.beginDate,
			daily_end_date   : data.endDate,
			daily_s_state    : data.sState,
			daily_order_date     : filter.orderDate,
			daily_board_length   : filter.boardLength,
			daily_board_width    : filter.boardWidth,
			daily_cus_po_no      : filter.cusPoNo,
			daily_order_id       : filter.orderId,
			daily_order_quantity : filter.orderQuantity,
			daily_score_info     : filter.scoreInfo
		};
		return post( window.jpdn_domain_staff + 'staffCountOrder', postData );
	},
	getDailyUser( data ){
		let postData = {
			daily_begin_date  : data.beginDate,
			daily_end_date    : data.endDate,
			daily_add_user_id : data.addUserId ? 1 : 0
		};
		return post( window.jpdn_domain_staff + 'staffDailyUser', postData );
	}
}
export default daily;