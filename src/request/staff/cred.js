import { get, post } from '../request';
import { staff } from '../urlMap';
import axios from 'axios';

const cred = {
	wGetCusAmt( data ){
		let postData = {
			cus_id: '',
			is_stopped: '2',
			is_settle_day:'0'
		};
		return post(staff.cred.wGetCusAmt,postData);
	},
	cusAmtDetail( cusId ){
		return post(staff.cred.cusAmtDetail,{cus_id:cusId});
	}
}
export default cred;