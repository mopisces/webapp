import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const statis = {
	getProInfo( data ){
		let postData = {
			info_begin_date : data.beginDate,
			info_end_date   : data.endDate
		}
		return post(staff.statis.getProInfo,postData);
	},
	getProInfoConfig(){
		return post(staff.statis.getProInfoConfig);
	},
	getOrdStockConfig(){
		return post(staff.statis.getOrdStockConfig);
	},
	getOrdStock( data ){
		let postData = {
			stock_statis_state : data.statisState,
			stock_date_type    : data.dateType,
			stock_begin_date   : data.beginDate,
			stock_end_date     : data.endDate,
			stock_remain_day   : data.remainDay,
			stock_diff_day     : data.diffDay,
		}
		return post(staff.statis.getOrdStock,postData);
	},
	statisDetail( data ){
		let postData = {
			detail_begin_date : data.beginDate,
			detail_end_date   : data.endDate,
			detail_date_type  : data.dateType,
			detail_cur_page   : data.curPage,
			detail_s_type     : data.sType,
			detail_remain_day : '0',
			detail_diff_day   : '0',
			/*detail_limit_factor : '',
			detail_limit_value  : '',*/
		}
		return post(staff.statis.statisDetail,postData);
	},
	getOrderSum( data ){
		let postData = {
			order_begin_date  : '2017-11-01',
			order_end_date    : '2019-10-31',
			order_statis_type : '0',
			order_date_type   : 'OrderDate'
		};
		return post(staff.statis.getOrderSum,postData);
	},
	getOrdReturnSum( data ){
		let postData={
			return_begin_date   : '2017-11-02',
			return_end_date     : '2019-11-02',
			return_statis_state : '0',
			return_date_type    : 'IssueDate',   
		};
		return post(staff.statis.getOrdReturnSum,postData)
	}
}
export default statis;