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
	statisDetail(){
		let postData = {
			detail_begin_date:'2017-10-22',
			detail_end_date:'2019-10-22',
			detail_date_type:'1',
			detail_cur_page:'1',
			detail_s_type:'3',
			detail_remain_day:'0',
			detail_diff_day:'0'
		}
		return post(staff.statis.statisDetail,postData);
	}
}
export default statis;