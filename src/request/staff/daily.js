import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const daily = {
	dailyConfig(){
		return post(staff.daily.dailyConfig);
	},
	getDailyOrder( data ){
		let addUserId = data.addUserId === true ? 1 : 0;
		let postData = {
			daily_begin_date:data.beginDate,
			daily_end_date:data.endDate,
			daily_add_user_id:addUserId,
			daily_order_cus_id:data.cusName
		};
		return post(staff.daily.staffDaily,postData);
	},
	getCusInfo( data ){
		let postData = {
			daily_cus_id:data.CusId,
			daily_begin_date:data.beginDate,
			daily_end_date:data.endDate,
		};
		return post(staff.daily.getCusDateInfo,postData);
	},
	getOrderDeatil( data ){
		let postData = {
			daily_cus_id:data.cusId,
			daily_s_state:data.sState,
			daily_order_date:data.orderDate
		};
		return post(staff.daily.dailyDetail,postData);
	},
	getCountOrder( data ){
		let postData = {
			daily_cus_id:data.cusId,
			daily_begin_date:data.beginDate,
			daily_end_date:data.endDate,
			daily_s_state:data.sState
		};
		return post(staff.daily.countOrder,postData);
	}
}
export default daily;