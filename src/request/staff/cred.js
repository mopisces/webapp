import { get, post } from '../request';
import { staff } from '../urlMap';

const cred = {
	wGetCusAmt( data ){
		let postData = {
			cus_id: data.cusId,
			is_stopped: data.isStopped,
			is_settle_day:data.isSettleDay
		};
		return post(staff.cred.wGetCusAmt,postData);
	},
	cusAmtDetail( data ){
		return post(staff.cred.cusAmtDetail,{detail_cus_id:data.cusId});
	}
}
export default cred;