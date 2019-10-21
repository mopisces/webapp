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
	}
}
export default statis;