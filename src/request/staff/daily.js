import { get, post } from '../request';
import { staff } from '../urlMap';

const daily = {
	dailyConfig(){
		return post(staff.daily.dailyConfig);
	},
	getDailyOrder( data ){
		let addUserId = data.addUserId === true ? 1 : 0;
		let postData = {
			daily_begin_date   : data.beginDate,
			daily_end_date     : data.endDate,
			daily_add_user_id  : addUserId,
			daily_order_cus_id : data.cusName
		};
		return post(staff.daily.staffDaily,postData);
	},
	getCusInfo( data ){
		let postData = {
			daily_cus_id     : data.CusId,
			daily_begin_date : data.beginDate,
			daily_end_date   : data.endDate,
		};
		return post(staff.daily.getCusDateInfo,postData);
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
		return post(staff.daily.dailyDetail,postData);
	},
	getCountOrder( data ){
		let postData = {
			daily_cus_id     : data.cusId,
			daily_begin_date : data.beginDate,
			daily_end_date   : data.endDate,
			daily_s_state    : data.sState
		};
		return post(staff.daily.countOrder,postData);
	},
	getDailyUser( data ){
		let postData = {
			daily_begin_date  : data.beginDate,
			daily_end_date    : data.endDate,
			daily_add_user_id : data.addUserId ? 1 : 0
		};
		return post(staff.daily.getDailyUser,postData);
	}
}
export default daily;