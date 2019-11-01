import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const statis = {
	getProInfo( data ){
		let postData = {
			info_begin_date:data.beginDate,
			info_end_date:data.endDate
		}
		return post(staff.statis.getProInfo,postData);
	},
	getProInfoConfig(){
		return post(staff.statis.getProInfoConfig);
	},
	getOrdStock(){
		let postData = {
			stock_statis_state:'0',
			stock_date_type:'OrderDate',
			stock_begin_date:'2017-10-22',
			stock_end_date:'2019-10-22',
			stock_remain_day:'0',
			stock_diff_day:'0'
		}
		return post(staff.statis.getOrdStock,postData);
	},
	statisDetail( data ){
		let postData = {
			detail_begin_date:data.beginDate,
			detail_end_date:data.endDate,
			detail_date_type:data.dateType,
			detail_cur_page:data.curPage,
			detail_s_type:data.sType,
			detail_remain_day:'0',
			detail_diff_day:'0'
		}
		return post(staff.statis.statisDetail,postData);
	},
	getOrderSum(){
		let postData = {
			order_begin_date:'2017-11-01',
			order_end_date:'2019-10-31',
			order_statis_type:'0',
			order_date_type:'OrderDate'
		};
		return post(staff.statis.getOrderSum,postData);
	}
}
export default statis;