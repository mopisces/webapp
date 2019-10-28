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
	getOrderDeatil(){
		let postData = {
			daily_cus_id:'AQ',
			daily_s_state:'6',
			daily_order_date:'2018-03-20'
		};
		return post(staff.daily.dailyDetail,postData);
	},
	getCountOrder(){
		let postData = {
			daily_cus_id:'AQ',
			daily_begin_date:'2016-10-30',
			daily_end_date:'2019-08-29',
			daily_s_state:'0'
		};
		return post(staff.daily.countOrder,postData);
	}
}
export default daily;